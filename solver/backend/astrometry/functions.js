'use strict'

import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import nodemailer from 'nodemailer'

import config from '../../config.js'
import Logger from '../../logger.js'


const log = Logger.getInstance('solver')

axios.defaults.baseURL = config.api.BASE_URL
axios.interceptors.response.use(response => {
    return response
}, function (error) {
    if (error.response.status === 500) {
        sendMail('astrometry http 500 error', error.request.res.responseUrl)
    }

    return Promise.reject(error)
})

/**
 * send email
 * @param stribg subject, mail subject
 * @param stribg text, mail content
 * @returns void
 */
const sendMail = (subject, text) => {
    const transporter = nodemailer.createTransport(config.smtp.options)

    const data = Object.assign(config.smtp.tpl, { 'subject': subject, 'text': text })
    transporter.sendMail(data, (err, info) => {
        if (err) log.error(err)
        else log.debug(info)
    })
}

/**
 * send request to astrometry api by axios
 * @param object options { url, form, headers, config, callback }
 * @returns void
 */
const request = (options) => {
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
        }).catch((error) => {
            const response = {
                status: config.api.STATUS_ERROR,
                errormessage: ''
            }

            if (error.response) {
                response.errormessage = `http ${error.response.status} error, [${error.request.res.responseUrl}]`
            } else if (error.request) {
                response.errormessage = `request ${error.request.res.responseUrl} failed`
            } else {
                response.errormessage = error.message
            }

            // log.error(`request error: ${response.errormessage}`)
            reject(response)
        })
    })
}

/**
 * retrieve session from astrometry api
 * @param string apikey
 * @returns string session
 */
const login = async (apikey) => {
    log.info('login')

    const url = config.api.API_LOGIN
    const form = new FormData()
    form.append('request-json', JSON.stringify({
        'apikey': apikey
    }))

    const callback = (response, resolve, reject) => {
        const status = response.data.status
        const session = response.data.session

        if (status === config.api.STATUS_SUCCESS && typeof session !== 'undefined') {
            log.debug(`login success, session: ${session}`)
            resolve(response.data.session)
        } else {
            log.warn(`login failed: ${response.data.errormessage}`)
            reject(response.data)
        }
    }

    let session = null
    try {
        session = await request({
            'url': url,
            'form': form,
            'config': {
                headers: form.getHeaders()
            },
            'method': 'post',
            'callback': callback
        })
    } catch (e) {
        const message = e.message || e.errormessage
        log.error(message)

        throw new Error(message)
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
    const url = config.api.API_URL_UPLOAD
    const form = new FormData()
    const json = {
        'session': session,
        'url': image_url,
        'parity': 2, // 0/1/2
        'allow_commercial_use': 'n',
        'allow_modifications': 'n',
        'publicly_visible': 'n'
    }

    form.append('request-json', JSON.stringify(json))

    const callback = (response, resolve, reject) => {
        const status = response.data.status
        const subid = response.data.subid
        // const hash = response.data.hash

        if (status === config.api.STATUS_SUCCESS && subid) {
            log.debug(`url upload success, subid: ${subid}`)
            resolve(subid)
        } else {
            log.warn(`url upload failed: ${response.data.errormessage}`)
            reject(response.data)
        }
    }

    let subid = null
    try {
        subid = await request({
            'url': url,
            'form': form,
            'config': {
                headers: form.getHeaders()
            },
            'method': 'post',
            'callback': callback
        })
    } catch (e) {
        log.error(e.message || e.errormessage)
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
    const url = `${config.api.API_SUB_STATUS}/${subid}`

    const callback = (response, resolve, reject) => {
        const jobs = response.data.jobs
        const job_calibrations = response.data.job_calibrations

        // log.debug(jobs, job_calibrations, jobs.length, jobs[0], job_calibrations.length)
        if (jobs.length === 0 || !jobs[0]) { //  || job_calibrations.length === 0
            reject('submission is not finished yet')
        } else {
            // log.debug(`get submission success, jobs: [${jobs.join(', ')}], job_calibrations: [${job_calibrations[0].join(', ')}]`)
            log.debug(`get submission success, jobs: [${jobs.join(', ')}]`)
            resolve({
                jobs: jobs,
                job_calibrations: job_calibrations
            })
        }
    }

    return await request({
        'url': url,
        'method': 'get',
        'config': {},
        'callback': callback
    })
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
    const url = config.api.API_JOB_INFO.replace('{jobid}', jobid)

    const callback = (response, resolve, reject) => {
        log.debug(`job status: ${response.data.status}`)

        if (response.data.status === config.api.STATUS_SOLVING) {
            reject('job still in solving')
        } else {
            resolve(response.data)
        }
    }

    return await request({
        'url': url,
        'config': {},
        'method': 'get',
        'callback': callback
    })
}

/**
 * annotate and skyplot callback function for request 
 * @param object response
 * @param function resolve
 * @param function reject
 * @returns void
 */
const image_callback = async function (response, resolve, reject) {
    const content_type = response.headers['content-type']
    const content_length = parseInt(response.headers['content-length'])
    const is_image = (content_type.split('/')[0] === 'image')

    if (!is_image) {
        log.debug(`content type: ${content_type}`)
        reject('astrometry returns is not image')
        return
    }

    try {
        const fd = fs.openSync(this.filepath, 'w')
        const bytes = fs.writeSync(fd, response.data)

        if (content_length !== bytes) {
            reject(`write image file failed, bytes: ${bytes}/${content_length}`)
        }

        resolve(bytes)
    } catch (e) {
        reject(e)
    }
}

/**
 * get annotated image from astrometry
 * @param int jobid
 * @param string filepath, local path to storage annotated images
 * @param string type, full/display, default is full
 * @returns int bytes, images bytes
 */
const annotate = async (jobid, filepath, type = 'full') => {
    // try {
    //     fs.accessSync(filepath, fs.constants.R_OK | fs.constants.W_OK)
    // } catch (e) {
    //     return 0
    // }

    const url = (type === 'full') ?
        `${config.api.API_ANNOTATED_FULL}/${jobid}` :
        `${config.api.API_ANNOTATED_DISPLAY}/${jobid}`

    try {
        await request({
            'url': url,
            'config': {
                responseType: 'arraybuffer'
            },
            'method': 'get',
            'callback': image_callback.bind({
                'filepath': filepath
            })
        })
    } catch (e) {
        log.error(e.message || e.errormessage)
        return 0
    }
}

/**
 * get skp plot image from astrometry, zoom[0-3]
 * @param int job_calibration_id
 * @returns void
 */
const skyplot = async (job_calibration_id, filepath, zoom = 0) => {
    const url = `${config.api.API_SKY_PLOT}${zoom}/${job_calibration_id}`

    try {
        await request({
            'url': url,
            'config': {
                responseType: 'arraybuffer'
            },
            'method': 'get',
            'callback': image_callback.bind({
                'filepath': filepath
            })
        })
    } catch (e) {
        log.error(e.message || e.errormessage)
    }
}

/**
 * get sdss image from astrometry
 * @param int job_calibration_id
 * @returns void
 */
const grid = async (job_calibration_id, filepath, type = 'full') => {
    const url = `${config.api.API_GRID}_${type}/${job_calibration_id}`

    try {
        await request({
            'url': url,
            'config': {
                responseType: 'arraybuffer'
            },
            'method': 'get',
            'callback': image_callback.bind({
                'filepath': filepath
            })
        })
    } catch (e) {
        log.error(e.message || e.errormessage)
    }
}


export {
    login,
    upload,
    submission,
    job,
    annotate,
    skyplot,
    grid
}