'use strict'

import fs from 'fs'
import { basename } from 'path'
import { setTimeout } from 'timers/promises'

import config from '../config.js'

import { login, upload, submission, job, annotate, skyplot } from '../backend/astrometry/index.js'

const run_test = async (image_url) => {
    try {
        // let image_url = 'https://bbs.imufu.cn/data/attachment/forum/202106/21/155259okyu8eu8s8bou8kb.jpg'
        let session = await login(config.api.API_KEY)
        let subid = await upload(session, image_url)

        let got_sub_result = false
        let sub = {
            jobs: [],
            job_calibrations: []
        }
        let jobinfo = {}
        let retry = 0
        let sleep = [30, 30, 20, 20, 20, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
        const max_retry = 20
        do {
            retry++
            console.log(`try ${retry} times, sleep ${sleep[retry]} seconds`)
            await setTimeout(sleep[retry] * 1000)
            sub = await submission(subid)
            got_sub_result = (sub.jobs.length !== 0 && sub.jobs[0] && sub.job_calibrations.length !== 0)
            console.log(got_sub_result, sub.jobs.length !== 0, sub.jobs[0], sub.job_calibrations.length !== 0)
        } while (!got_sub_result && retry <= max_retry)
        console.log(sub)

        let job_solved = false
        let jobid = sub.jobs[0]

        if (!jobid) {
            throw new Error(`job error: ${sub.jobs.join(', ')}`)
        }

        do {
            await setTimeout(10 * 1000)

            // 只有档job_calibrations不为空时继续获取其他信息
            // if (sub.job_calibrations.length !== 0) {
                jobinfo = await job(jobid)
                job_solved = (jobinfo.status === config.api.STATUS_SUCCESS)
            // }
        } while (!job_solved)

        let tags = jobinfo.tags

        const dir = basename(image_url, '.jpg')
        fs.mkdirSync(`./test/annotated_images/${dir}`)

        let type = 'full' // full/display
        let path = `./test/annotated_images/${dir}/annotated_${type}_${jobinfo.original_filename}`
        let bytes = await annotate(jobid, path, type)
        // await annotate(jobid, path, type)
        if (bytes === 0) {
            console.log(`get annotated image failed: ${path}`)
        }

        if (sub.job_calibrations.length !== 0 && sub.job_calibrations[0].length >= 2) {
            const job_cal_id = sub.job_calibrations[0][1]
            for (let zoom of [0, 1, 2, 3]) {
                let plot_path = `./test/annotated_images/${dir}/skyplot_zoom${zoom}.jpg`
                bytes = await skyplot(job_cal_id, plot_path, zoom)
                if (bytes === 0) {
                    console.log(`get annotated image failed: ${path}`)
                }
            }
        }
        
        const result = {
            sub: sub,
            job: jobinfo
        }
        console.log('finish')

        return result
    } catch (e) {
        console.log(e)
    }
}

const images = [
    'https://bbs.imufu.cn/data/attachment/forum/202106/21/155259okyu8eu8s8bou8kb.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/21/155259mbm3h3m3e6z0i0nm.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/21/155300tez5x5212ex6hlue.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/21/155300yfh4em4c40py39mh.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/21/155258o7ukz76xz8wjjnex.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/21/155258v3cyofay2yj2icyc.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/20/205419si6pzixij8zypr6j.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/20/192412zzs7jj25wu3nuas5.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/19/210431ae661me1plyezpjj.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/16/142003v3yekioodeai6tdy.jpg',
    'https://bbs.imufu.cn/data/attachment/forum/202106/16/170847m8z2f5zrc58oct42.jpg'
]

for (let url of images) {
    console.log('##################################################################################################################')
    await run_test(url)
    console.log('##################################################################################################################')
}
