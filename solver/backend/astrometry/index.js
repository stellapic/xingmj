'use strict'

import fs from 'fs'
import retry from 'async-retry'
import { setTimeout } from 'timers/promises'

import config from '../../config.js'
import Logger from '../../logger.js'
import { login, upload, submission, job, annotate, skyplot, grid } from './functions.js'

export default class AstrometrySolver {
    /**
     * constructor
     */
    constructor() {
        this._instance = null
    }

    /**
     * get AstrometrySolver instance
     * @returns AstrometrySolver instance
     */
    static getInstance() {
        if (!this._instance) {
            this._instance = new AstrometrySolver()
        }

        return this._instance
    }

    /**
     * 
     * @returns object astrometry result
     */
    async run(id, image_url) {
        // define result, null initial
        let result = null

        // create logger
        const log = Logger.getInstance()
        
        // annotation dir
        const annotated_dir = `${config.annotated}/${id}`

        // check dir is or not exists
        if (fs.existsSync(annotated_dir)) {
            log.error(`annotated dir already exists: ${annotated_dir}`)
            // throw new Error(`annotated dir already exists: ${annotated_dir}`)

            return null
        }

        // create annotated image dir
        fs.mkdirSync(annotated_dir)

        try {
            // get session from astrometry
            const session = await login(config.api.API_KEY)

            // post url to astrometry and retrieve submission
            const subid = await upload(session, image_url)

            let sub = {
                jobs: [],
                job_calibrations: []
            }
            let jobinfo = {}

            // loop get submission info, retry 20 times
            await retry(async bail => {
                sub = await submission(subid)
            }, {
                retries: config.api.retry.RETRIES,
                minTimeout: config.api.retry.MIN_TIMEOUT,
                maxTimeout: config.api.retry.MAX_TIMEOUT,
                onRetry: error => {
                    // log.info(`retry to get submission`)
                }
            })

            let job_solved = false
            let jobid = sub.jobs[0]
    
            if (!jobid) {
                throw new Error(`job error: ${sub.jobs.join(', ')}`)
            }

            do {
                await setTimeout(1000)

                jobinfo = await job(jobid)
                job_solved = (jobinfo.status === config.api.STATUS_SUCCESS)
            } while (!job_solved)

            // annotation
            const annotated = { 'full': '', 'display': '' }
            for (let type of config.types) {
                const annotated_path = `${annotated_dir}/annotated_${type}_${jobinfo.original_filename}`
                const bytes = await annotate(jobid, annotated_path, type)
                if (bytes === 0) {
                    log.warn(`get annotated ${type} image failed: ${annotated_path}`)
                    continue
                }

                annotated[type] = annotated_path
            }

            const skyplots = []
            if (sub.job_calibrations.length !== 0 && sub.job_calibrations[0].length >= 2) {
                const job_cal_id = sub.job_calibrations[0][1]

                for (let zoom of [0, 1, 2, 3]) {
                    let plot_path = `${annotated_dir}/skyplot_zoom${zoom}.png`
                    const bytes = await skyplot(job_cal_id, plot_path, zoom)
                    if (bytes === 0) {
                        log.warn(`get skyplot zoom${zoom} image failed: ${plot_path}, bytes: ${bytes}`)
                        continue
                    }

                    skyplots.push(plot_path)
                }
            }

            const grids = { 'full': '', 'display': '' }
            for (let type of config.types) {
                const grid_path = `${annotated_dir}/grid_${type}_${jobinfo.original_filename}`
                const bytes = await grid(jobid, grid_path, type)
                if (bytes === 0) {
                    log.warn(`get grid ${type} image failed: ${grid_path}`)
                    continue
                }

                grids[type] = grid_path
            }

            result = {
                'id': id,
                'status': jobinfo.status,
                'tags': jobinfo.tags,
                'calibration': jobinfo.calibration,
                'submission': sub,
                'original': jobinfo.original_filename,
                'annotated': annotated,
                'grid': grids,
                'zoom': skyplots
            }

            log.info(`task ${id} solve finish`)
        } catch (e) {
            log.error(e)

            return null
        }

        return result
    }
}
