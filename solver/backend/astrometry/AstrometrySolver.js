'use strict'

import fs from 'fs'
import retry from 'async-retry'
import { setTimeout } from 'timers/promises'

import utils from '../../utils.js'
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

    storeAnnotation(result, annotated_dir) {
        const filepath = `${annotated_dir}/result.json`
        fs.writeFileSync(filepath, JSON.stringify(result))
    }

    /**
     * 
     * @returns object astrometry result
     */
    async run(id, image_url) {
        // define result, null initial
        let result = {
            'id': id,
            'status': config.api.STATUS_ERROR
        }

        // create logger
        const log = Logger.getInstance('solver')
        
        // annotation dir
        const annotated_dir = `${config.annotated}/${id}`

        // check dir is or not exists
        if (fs.existsSync(annotated_dir)) {
            const error = `annotated dir already exists: ${annotated_dir}`
            log.warn(error)

            return Object.assign(result, { 'error': error })
        }

        // create annotated image dir
        fs.mkdirSync(annotated_dir, { recursive: true })

        try {
            // get session from astrometry
            const session = await login(config.api.API_KEY)

            // post url to astrometry and retrieve submission
            const subid = await upload(session, image_url)

            let sub = {
                jobs: [],
                job_calibrations: []
            }

            // loop get submission info, retry 20 times
            await retry(async bail => {
                sub = await submission(subid)
            }, {
                retries: config.api.retry.RETRIES,
                minTimeout: config.api.retry.MIN_TIMEOUT,
                maxTimeout: config.api.retry.MAX_TIMEOUT,
                onRetry: (error, times) => {
                    // log.info(`retry ${times} times`)
                }
            })

            let jobinfo = {}
            let is_annotated = true
            let jobid = sub.jobs[0]

            if (!jobid) {
                throw new Error(`job error: ${sub.jobs.join(', ')}`)
            }

            // loop get job info
            await retry(async bail => {
                jobinfo = await job(jobid)
            }, {
                retries: config.api.retry.RETRIES,
                minTimeout: config.api.retry.MIN_TIMEOUT,
                maxTimeout: config.api.retry.MAX_TIMEOUT,
                onRetry: (error, times) => {
                    log.info(`retry ${times} times`)
                }
            })

            if (jobinfo.status !== config.api.STATUS_SUCCESS) {
                return Object.assign(result, { 'error': 'image solve failed' })
            }

            sub = await submission(subid)

            // annotation
            const skyplots = []
            const grids = { 'full': '', 'display': '' }
            const annotated = { 'full': '', 'display': '' }

            if (is_annotated) {
                for (let type of config.types) {
                    const annotated_path = `${annotated_dir}/annotated_${type}_${jobinfo.original_filename}`
                    const bytes = await annotate(jobid, annotated_path, type)
                    if (bytes === 0) {
                        log.warn(`get annotated ${type} image failed: ${annotated_path}`)
                        continue
                    }

                    annotated[type] = annotated_path
                }

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

                for (let type of config.types) {
                    const grid_path = `${annotated_dir}/grid_${type}_${jobinfo.original_filename}`
                    const bytes = await grid(jobid, grid_path, type)
                    if (bytes === 0) {
                        log.warn(`get grid ${type} image failed: ${grid_path}`)
                        continue
                    }

                    grids[type] = grid_path
                }
            }

            const calibration = Object.assign({}, jobinfo.calibration)
            calibration.ra = utils.ra_degree2hms(jobinfo.calibration.ra)
            calibration.dec = utils.dec_degree2hms(jobinfo.calibration.dec)

            result = {
                'id': id,
                'url': image_url,
                'status': jobinfo.status,
                'tags': jobinfo.tags,
                'calibration': calibration,
                'calibration_original': jobinfo.calibration,
                'submission': sub,
                'original': jobinfo.original_filename,
                'annotated': annotated,
                'grid': grids,
                'zoom': skyplots
            }

            this.storeAnnotation(result, annotated_dir)

            log.info(`task ${id} solve finish`)
        } catch (e) {
            log.error(e)

            // delete task annotation dir
            fs.rmdirSync(annotated_dir)

            return Object.assign(result, { 'error': e.message })
        }

        return result
    }
}
