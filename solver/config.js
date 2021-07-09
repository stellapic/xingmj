'use strict'

const config = {
    log: {
        LOG_LEVEL: 'trace', // fatal/error/warn/info/debug/trace
        LOG_SRC: true, // do not set true in production env
    },
    solver: 'astrometry', // astrometry | pi
    timeout: 10000, // 10s
    types: ['full', 'display'],
    api: {
        BASE_URL: 'http://nova.astrometry.net',
        API_KEY: 'hopttfyedswulqlv',
        STATUS_SUCCESS: 'success',
        STATUS_ERROR: 'error',
        API_LOGIN: '/api/login',
        API_URL_UPLOAD: '/api/url_upload',
        API_SUB_STATUS: '/api/submissions',
        API_JOB_INFO: `/api/jobs/{jobid}/info`,
        API_ANNOTATED_FULL: '/annotated_full',
        API_ANNOTATED_DISPLAY: '/annotated_display',
        API_SKY_PLOT: '/sky_plot/zoom',
        API_GRID: '/grid_display',
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
            showFriendlyErrorStack: true
        },
        retry: {
            RETRIES: 3,
            MIN_TIMEOUT: 1000, // 500ms
            MAX_TIMEOUT: 2000 // 2s
        },
        TIMEOUT_INDEFINITELY: 0
    }
}

export default config
