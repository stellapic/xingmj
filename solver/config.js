'use strict'

const config = {
    LOG_LEVEL: 'trace', // fatal/error/warn/info/debug/trace
    LOG_SRC: false, // do not set true in production env
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
    API_SKY_PLOT: 'sky_plot/zoom'
}

export default config
