import bunyan from 'bunyan'

import config from './config.js'

export default class Logger {
    constructor() {
        this._instance = null
        this.init()
    }

    init() {
        this._log = bunyan.createLogger({
            name: 'solver',
            level: config.log.LOG_LEVEL,    // fatal/error/warn/info/debug/trace
            src: config.log.LOG_SRC
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [{
            //     level: 'info',
            //     stream: process.stdout            // log INFO and above to stdout
            // },
            // {
            //     level: 'error',
            //     path: '/var/tmp/myapp-error.log'  // log ERROR and above to a file
            // }],   // Optional, see "Streams" section
            // serializers: <serializers mapping> // Optional, see "Serializers" section
        })
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new Logger()
        }
        
        return this._instance._log
    }
}


// const logger = Logger.getInstance()
// logger.fatal('fatal')
// logger.error('error')
// logger.warn('warn')
// logger.info('info')
// logger.debug('debug')
// logger.trace('trace')
