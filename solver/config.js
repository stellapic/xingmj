'use strict'

import os from 'os'

const config = {
    log: {
        LOG_LEVEL: 'trace', // fatal/error/warn/info/debug/trace
        LOG_SRC: true, // do not set true in production env, only for debug
    },
    process: {
        MAX_PROCESS: 3 // os.cpus().length
    },
    solver: 'astrometry', // astrometry | pi
    timeout: 2000, // 2s
    types: ['full', 'display'],
    api: {
        BASE_URL: 'http://nova.astrometry.net',
        API_KEY: 'hopttfyedswulqlv',
        STATUS_SUCCESS: 'success',
        STATUS_FAILURE: 'failure',
        STATUS_ERROR: 'error',
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
            port: 13697,
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
        TIMEOUT_INDEFINITELY: 0
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
        ERROR_TASK: 8,
        TASK_COUNT: 9,
        GET_TASKS: 10
    }
}

export default config
