'use strict'

import { setTimeout, setInterval } from 'timers/promises'

import config from '../config.js'
// import login from '../backend/astrometry/login.js'
// import upload from '../backend/astrometry/upload.js'
// import submission from '../backend/astrometry/submission.js'
// import job from '../backend/astrometry/job.js'
// import annotate from '../backend/astrometry/annotate.js'

import { login, upload, submission, job, annotate } from '../backend/astrometry/index.js'

try {
    let image_url = 'https://bbs.imufu.cn/data/attachment/forum/202106/30/065112ztl4397z39kkaldv.jpg'
    let session = await login(config.API_KEY)
    let subid = await upload(session, image_url)

    let got_sub_result = false
    let sub = {
        jobs: []
    }
    do {
        await setTimeout(10 * 1000)
        sub = await submission(subid)
        got_sub_result = (sub.jobs.length !== 0 && sub.jobs[0])
    } while (!got_sub_result)

    let job_solved = false
    let jobid = sub.jobs[0]
    let jobinfo
    do {
        await setTimeout(10 * 1000)

        // 只有档job_calibrations不为空时继续获取其他信息
        // if (sub.job_calibrations.length !== 0) {
            jobinfo = await job(jobid)
            job_solved = (jobinfo.status === config.STATUS_SUCCESS)
        // }
    } while (!job_solved)

    let tags = jobinfo.tags

    let type = 'display' // full/display
    let path = `./test/annotated_images/annotated_${type}_${jobinfo.original_filename}`
    await annotate(jobid, path, type)
    // await annotate(jobid, path, type)
    
    console.log(session, subid, sub, tags, path)
    console.log('finish')
} catch (e) {
    console.log(e)
}