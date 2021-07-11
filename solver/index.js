'use strict'

import IORedis from 'ioredis'
import urlExist from "url-exist"
import { setTimeout } from 'timers/promises'

import config from './config.js'
import Logger from './logger.js'
import SolverFactory from './factory/SolverFactory.js'
import { annotate } from './backend/astrometry/functions.js'

/**
 * get task object
 * @param string str
 * @returns json
 */
const getTask = str => {
    if (typeof(str) === 'string') {
        try {
            const json = JSON.parse(str)
            if (typeof(json) === 'object' && json) {
                return json
            }
        } catch(e) {
            return null
        }
    }

    return null
}

/**
 * check annotated data is or not valid
 * @param object annotated
 * @returns boolean
 */
const isValidAnnotated = annotated => {
    if (!annotated) return false

    if (annotated.status !== 'success') return false

    // improve me!
    // check annotated data structure

    return true
}


(async () => {
    const log = Logger.getInstance()

    process.on('unhandledRejection', (reason, promise) => {
        log.error(`Unhandled Rejection at: ${promise}, 'reason: ${reason}`)
    })

    log.info('astrometry solver started')

    try {
        log.info('connect to redis server')
        const client = new IORedis(config.redis.connect)

        do {
            // task queue from php
            const q_pending = 'queue:sovler:pending'

            // task queue needs to be run by solver
            const q_solving = 'queue:sovler:solving'

            // queue done
            const q_done = 'queue:sovler:done'

            // block
            log.info('retrieve task from queue')
            const text = await client.brpoplpush(q_pending, q_solving, config.redis.TIMEOUT_INDEFINITELY)
            const task = getTask(text)
            log.debug(`task: ${task?.id}`)

            if (task) {
                log.debug(`get task: ${text}`)

                // check image url is or not exists
                const exists = await urlExist(task.url)
                log.debug(`image url ${exists ? '': 'not'} exists`)
                if (exists) {
                    // create solver
                    const solver = SolverFactory.getSolver(config.solver)
                    // run solve process
                    const annotated = await solver.run(task.id, task.url)

                    // check solve result is or not valid
                    const valid = isValidAnnotated(annotated)
                    log.debug(`annotated ${valid ? 'is': 'not'} valid`)
                    if (valid) {
                        log.debug(`store solve result[${task.id}] to ${q_done}`)
                        // store solve result to queue done
                        const result = await client
                            .multi()
                            .lpush(q_done, JSON.stringify(annotated)) // push astrometry result into queue done
                            .rpop(q_solving) // remove task from queue solving
                            .exec()
                    }
                }
            }

            log.info(`sleep ${config.timeout} secnods`)
            await setTimeout(config.timeout)
        } while (true)
    } catch (e) {
        log.error(e.message)

        // push unfinished task to the top of queue solving
        log.info(`rollback task[${task.id}] to ${q_solving}`)
        await client
            .multi()
            .rpop(q_solving)
            .lpush(q_pending, text)
    } finally {
    }
})()
