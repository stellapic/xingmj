'use strict'

import fs from 'fs'
import retry from 'async-retry'
import { setTimeout } from 'timers/promises'

import config from '../../config.js'
import Logger from '../../logger.js'
import { login, upload, submission, job, annotate, skyplot } from './functions.js'

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
        const log = Logger.getInstance()

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
                retries: config.retry.RETRIES,
                minTimeout: config.retry.MIN_TIMEOUT,
                maxTimeout: config.retry.MAX_TIMEOUT,
                onRetry: error => {
                    log.info(`retry to get submission`)
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

            let tags = jobinfo.tags
            const annotated_dir = `${config.annotated}/${id}`
            fs.mkdirSync(annotated_dir)

            let type = 'full' // full/display
            let annotated_path = `${annotated_dir}/annotated_${type}_${jobinfo.original_filename}`
            let bytes = await annotate(jobid, annotated_path, type)
            if (bytes === 0) {
                console.log(`get annotated image failed: ${annotated_path}`)
            }

            const skyplots = []
            if (sub.job_calibrations.length !== 0 && sub.job_calibrations[0].length >= 2) {
                const job_cal_id = sub.job_calibrations[0][1]

                for (let zoom of [0, 1, 2, 3]) {
                    let plot_path = `${annotated_dir}/skyplot_zoom${zoom}.png`
                    bytes = await skyplot(job_cal_id, plot_path, zoom)
                    if (bytes === 0) {
                        console.log(`get annotated image failed: ${plot_path}`)
                        continue
                    }

                    skyplots.push(plot_path)
                }
            }

            result = {
                'id': id,
                'status': jobinfo.status,
                'tags': jobinfo.tags,
                'calibration': jobinfo.calibration,
                'submission': sub,
                'original': jobinfo.original_filename,
                'annotated': annotated_path,
                'zoom': skyplots
            }
            console.log('finish')
        } catch (e) {
            console.log(e)
        }

        return result
    }
}
