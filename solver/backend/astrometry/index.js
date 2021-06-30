'use strict'

import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'

import config from '../../config.js'
import Logger from '../../logger.js'


const log = Logger.getInstance()

/**
 * send request to astrometry api by axios
 * @param object options { url, form, headers, config, callback }
 * @returns void
 */
const request = (options) => {
    axios.defaults.baseURL = config.BASE_URL

    return new Promise((resolve, reject) => {
        log.debug(`url: ${options.url}`)
        let self = this

        let promise = null
        if (options.method === 'post') {
            promise = axios.post(options.url, options.form, options.config)
        } else {
            promise = axios.get(options.url, options.config)
        }
        
        promise.then((response) => {
            if (typeof options.callback === 'function') {
                // callback(response.data, resolve, reject)
                options.callback.call(self, response, resolve, reject)
            }
        })
        .catch((error) => {
            const response = {
                status: config.STATUS_ERROR,
                errormessage: ''
            }
            if (error.response) {
                response.errormessage = `http ${error.response.status} error`
            } else if (error.request) {
                response.errormessage = `request ${error.request._currentUrl} failed`
            } else {
                response.errormessage = error.message
            }

            log.error(`request error: ${response.errormessage}`)
            reject(response)
        })
    });
}

/**
 * retrieve session from astrometry api
 * @param string apikey
 * @returns string session
 */
const login = async (apikey) => {
    const url = config.API_LOGIN
    const form = new FormData()
    form.append('request-json', JSON.stringify({ 'apikey': apikey }))

    const callback = (response, resolve, reject) => {
        const status = response.data.status
        const session = response.data.session
        
        if (status === config.STATUS_SUCCESS && typeof session !== 'undefined') {
            log.debug(`login success, session: ${session}`)
            resolve(response.data.session)
        } else {
            log.warn(`login failed: ${response.data.errormessage}`)
            reject(response.data)
        }
    }

    let session = null
    try {
        session = await request(
        {
            'url': url,
            'form': form,
            'config': { headers: form.getHeaders() },
            'method': 'post',
            'callback': callback
        })
    } catch (e) {
        console.log(e)
    }

    return session
}

/**
 * upload image url to astrometry
 * @param string session
 * @param string image_url, astro image url
 * @returns int subid, submission id
 */
const upload = async (session, image_url) => {
    const url = config.API_URL_UPLOAD
    const form = new FormData()
    const json = {
        'session': session,
        'url': image_url // 'https://bbs.imufu.cn/data/attachment/forum/202105/15/052433hb2ms80mz1f50h0o.jpg'
    }

    form.append('request-json', JSON.stringify(json))

    const callback = (response, resolve, reject) => {
        const status = response.data.status
        const subid = response.data.subid
        // const hash = response.data.hash
        
        if (status === config.STATUS_SUCCESS && subid) {
            log.debug(`url upload success, subid: ${subid}`)
            resolve(subid)
        } else {
            log.warn(`url upload failed: ${response.data.errormessage}`)
            reject(response.data)
        }
    }

    let subid = null
    try {
        subid = await request(
        {
            'url': url,
            'form': form,
            'config': { headers: form.getHeaders() },
            'method': 'post',
            'callback': callback
        })
    } catch (e) {
        console.log(e)
    }

    return subid
}

/**
 * retrive submission status from astrometry
 * @param int subid
 * @returns Object sub
    sub {
        "user": 27946,
        "processing_started": "2021-06-29 06:24:01.873119",
        "processing_finished": "2021-06-29 06:24:03.171189",
        "user_images": [
            4824972
        ],
        "images": [
            11241864
        ],
        "jobs": [
            5391553
        ],
        "job_calibrations": [
            [
                5391553,
                3775027
            ]
        ]
    }
 */
const submission = async (subid) => {
    const url = `${config.API_SUB_STATUS}/${subid}`

    const callback = (response, resolve, reject) => {
        const jobs = response.data.jobs
        const job_calibrations = response.data.job_calibrations

        if (jobs.length !== 0 && jobs[0]) {
            log.debug(`get submission success, jobs: ${jobs.join(', ')}`)
        }
        resolve({
            jobs: jobs,
            job_calibrations: job_calibrations
        })
    }

    let sub = null
    try {
        sub = await request(
        {
            'url': url,
            'method': 'get',
            'config': {},
            'callback': callback
        })
    } catch (e) {
        console.log(e)
    }

    return sub
}

/**
 * retrieve job info
 * @param int jobid
 * @returns object job
    job {
        "objects_in_field": [
            "The star 34Cyg",
            "NGC 6888",
            "IC 4996",
            "Crescent Nebula"
        ],
        "machine_tags": [
            "Crescent Nebula",
            "NGC 6888",
            "IC 4996",
            "The star 34Cyg"
        ],
        "tags": [
            "Crescent Nebula",
            "NGC 6888",
            "IC 4996",
            "The star 34Cyg"
        ],
        "status": "success",
        "original_filename": "170731i7ts6la2h89c72c9.jpg",
        "calibration": {
            "ra": 303.03413131799505,
            "dec": 38.34357146538215,
            "radius": 1.869603156099992,
            "pixscale": 5.484660589627083,
            "orientation": 359.2039311771184,
            "parity": 1.0
        }
    }
 */
const job = async (jobid) => {
    const url = config.API_JOB_INFO.replace('{jobid}', jobid)

    const callback = (response, resolve, reject) => {
        log.debug(`job status: ${response.data.status}`)
        resolve(response.data)
    }

    let sub = null
    try {
        sub = await request(
        {
            'url': url,
            'config': {},
            'method': 'get',
            'callback': callback
        })
    } catch (e) {
        console.log(e)
    }

    return sub
}

/**
 * get annotated image from astrometry
 * @param int jobid
 * @param string path, local path
 * @param string type, full/display
 * @returns void
 */
const annotate = async (jobid, path, type='full') => {
    const url = (type === 'full')
                ? `${config.API_ANNOTATED_FULL}/${jobid}`
                : `${config.API_ANNOTATED_DISPLAY}/${jobid}`

    const callback = (response, resolve, reject) => {
        response.data.pipe(fs.createWriteStream(path))
        resolve(response.data)
    }

    let sub = null
    try {
        sub = await request(
        {
            'url': url,
            'config': { responseType: 'stream' },
            'method': 'get',
            'callback': callback
        })
    } catch (e) {
        console.log(e)
    }

    return sub
}

export { login, upload, submission, job, annotate }
