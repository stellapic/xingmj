'use strict'

import os from 'os'
import log4js from 'log4js'
// console.log(log4js)

const config = {
    log: {
        backend: 'log4js',
        bunyan: {
            LOG_LEVEL: 'trace', // fatal/error/warn/info/debug/trace
            LOG_SRC: false // do not set true in production env, only for debug
        },
        log4js: {
            LOG_LEVEL: log4js.levels.ALL // OFF/FATAL/ERROR/WARN/INFO/DEBUG/TRACE/ALL
        }
    },
    process: {
        MAX_PROCESS: os.cpus().length
    },
    UUID_NAMESPACE: 'fbd16f6f-bdb4-4312-8ffa-bb9deb0c8e7f',
    solver: 'astrometry', // astrometry | pi
    timeout: 2000, // 2s
    types: ['full', 'display'],
    api: {
        BASE_URL: 'http://nova.astrometry.net',
        API_KEY: 'hopttfyedswulqlv',
        STATUS_SUCCESS: 'success',
        STATUS_FAILURE: 'failure',
        STATUS_ERROR: 'error',
        STATUS_SOLVING: 'solving',
        API_LOGIN: '/api/login',
        API_URL_UPLOAD: '/api/url_upload',
        API_SUB_STATUS: '/api/submissions',
        API_JOB_INFO: `/api/jobs/{jobid}/info`,
        API_ANNOTATED_FULL: '/annotated_full',
        API_ANNOTATED_DISPLAY: '/annotated_display',
        API_SKY_PLOT: '/sky_plot/zoom',
        API_GRID: '/grid',
        retry: {
            RETRIES: 40,
            MIN_TIMEOUT: 10000, // 10s
            MAX_TIMEOUT: 20000 // 20s
        }
    },
    annotated: '/Users/chenxi/Desktop/imufu/xingmj/solver/test/annotated_images',
    redis: {
        connect: {
            port: 23697,
            host: 'redis-13697.c275.us-east-1-4.ec2.cloud.redislabs.com',
            password: '19810704',
            db: 0,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            retryStrategy: () => { return false }
        },
        retry: {
            RETRIES: 999999,
            MIN_TIMEOUT: 1000, // 500ms
            MAX_TIMEOUT: 2000 // 2s
        },
        TIMEOUT: 0, // seconds, 0 means infinity
        QUEUE_PENDING: 'queue:sovler:pending', // task queue from php
        QUEUE_SOLVING: 'queue:sovler:solving', // task queue needs to be run by solver
        QUEUE_DONE: 'queue:sovler:done', // queue done
        QUEUE_FAILED: 'queue:sovler:failed' // queue failed
    },
    command: {
        REDIS_READY: 0,
        REDIS_FAILED: 1,
        GET_TASK_COUNT: 2,
        NEW_TASK: 3,
        TASK_SOLVED: 4,
        SAVE_ANNOTATION: 5,
        PROCESS_EXIT: 6,
        ANNOTATION_SAVED: 7,
        TASK_EXCEPTION: 8,
        TASK_COUNT: 9,
        GET_TASKS: 10,
        REDIS_ERROR: 11
    },
    map: [
        'REDIS_READY',
        'REDIS_FAILED',
        'GET_TASK_COUNT',
        'NEW_TASK',
        'TASK_SOLVED',
        'SAVE_ANNOTATION',
        'PROCESS_EXIT',
        'ANNOTATION_SAVED',
        'TASK_EXCEPTION',
        'TASK_COUNT',
        'GET_TASKS',
        'REDIS_ERROR'
    ]
}

export default config
