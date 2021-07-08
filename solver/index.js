'use strict'

import IORedis from 'ioredis'
import urlExist from "url-exist"
import { setTimeout } from 'timers/promises'

import config from './config.js'
import Logger from './logger.js'
import SolverFactory from './factory/SolverFactory.js'


(async () => {
    const log = Logger.getInstance()

    process.on('unhandledRejection', (reason, promise) => {
        log.error(`Unhandled Rejection at: ${promise}, 'reason: ${reason}`)
    })

    try {
        const client = new IORedis(config.redis.connect)

        do {
            // task queue from php
            const q_pending = 'queue:sovler:pending'

            // task queue needs to be run by solver
            const q_solving = 'queue:sovler:solving'

            // queue done
            const q_done = 'queue:sovler:done'

            // block
            const text = await client.brpoplpush(q_pending, q_solving, config.redis.TIMEOUT_INDEFINITELY)
            const task = JSON.parse(text)
            log.debug(`get task: ${text}`)

            // check image url is or not exists
            const exists = await urlExist(task.url)
            if (!exists) {
                log.warn(`url is not exists[${task.url}]`)
                continue
            }

            // create solver
            const solver = SolverFactory.getSolver(config.solver)
            // run solve process
            const annotated = await solver.run(task.id, task.url)

            // improve me!
            // check solve result is or not valid

            // store solve result to queue done
            if (annotated) {
                const result = await client
                    .multi()
                    .lpush(q_done, JSON.stringify(annotated)) // push astrometry result into queue done
                    .rpop(q_solving) // remove task from queue solving
                    .exec()
            }

            log.info('sleep 10s')
            await setTimeout(config.timeout)
        } while (true)
    } catch (e) {
        log.error(e)

        // push unfinished task to the top of queue solving
        await client
            .multi()
            .rpop(q_solving)
            .lpush(q_solving, text)
    } finally {
    }
})()
