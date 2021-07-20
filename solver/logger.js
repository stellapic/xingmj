import bunyan from 'bunyan'
import log4js from 'log4js'

import config from './config.js'

export default class Logger {
    constructor() {
        this._instance = null

        // this.initBunyan()
        this.initLog4js()
    }

    initBunyan() {
        this.bunyan = bunyan.createLogger({
            name: 'solver',
            level: config.log.bunyan.LOG_LEVEL,    // fatal/error/warn/info/debug/trace
            src: config.log.bunyan.LOG_SRC
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

    initLog4js() {
        log4js.configure({
            appenders: {
                'console': { 'type': 'stdout', 'layout': {
                    type: 'coloured',
                    pattern: '[%d] [%p] %c/%z - %m'
                }},
                'file': { 'type': 'dateFile', 'filename': 'logs/solver.log', 'layout': {
                    type: 'basic',
                    pattern: '[%d] [%p] %c/%z - %m'
                }, daysToKeep: 7 }
            },
            categories: {
                default: { appenders: ['console'], level: 'debug'},
                master: { appenders: ['console', 'file'], level: 'all' },
                redis: { appenders: ['console', 'file'], level: 'all' },
                solver: { appenders: ['console', 'file'], level: 'all' }
            }
        })

        this.log4js_master = new log4js.getLogger('master')
        this.log4js_redis = new log4js.getLogger('redis')
        this.log4js_solver = new log4js.getLogger('solver')
    }

    static getInstance(category) {
        if (!this._instance) {
            this._instance = new Logger(category)
        }

        return this._instance[`${config.log.backend}_${category}`]
    }
}


// const master = Logger.getInstance('master')
// const master2 = Logger.getInstance('master')
// console.log(master === master2)
// const redis = Logger.getInstance('redis')
// const solver = Logger.getInstance('solver')
// master.fatal('fatal')
// master.error('error')
// redis.warn('warn')
// redis.info('info')
// solver.debug('debug')
// solver.trace('trace')
