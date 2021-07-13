'use strict'

import IORedis from 'ioredis'
import retry from 'async-retry'

import config from '../config.js'
import Logger from '../logger.js'

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


(async () => {
    const log = Logger.getInstance()
    
    // task queue from php
    const q_pending = 'queue:sovler:pending'

    // task queue needs to be run by solver
    const q_solving = 'queue:sovler:solving'

    // queue done
    const q_done = 'queue:sovler:done'

    log.info('create redis client')
    // create redis client with lazy connect
    const client = new IORedis(config.redis.connect)

    // event handler
    client.once('error',  error => {
        log.error(error.message)
        
        // process.send({ ready: config.commandREDIS_FAILED })
    })

    client.once('ready', () => {
        log.info(`connect to redis success`)
        process.send({ 'command': config.command.REDIS_READY })
    })

    client.once('end', () => {
        process.send({ 'command': config.commandREDIS_FAILED })
    })

    client.once('disconnect', () => {
        process.send({ 'command': config.commandREDIS_FAILED })
    })

    await retry(async (bail, times) => {
        log.info(`connecting to redis, try ${times} times`)
        await client.connect()
    }, {
        retries: config.redis.retry.RETRIES,
        minTimeout: config.redis.retry.MIN_TIMEOUT,
        maxTimeout: config.redis.retry.MAX_TIMEOUT,
        onRetry: error => {
            log.error(`connect failed: ${error.message}`)
        }
    })

    process.on('message', async msg => {
        if (msg.command === config.command.GET_TASK_COUNT) {
            log.info('retrieve task from queue')

            const task_length = await client.llen(q_pending)
            log.info(`get ${task_length} tasks`)

            process.send({ 'command': config.command.TASK_COUNT, 'count': task_length })
        } else if (msg.command === config.command.GET_TASKS) {
            const task_length = await client.llen(q_pending)
            log.info(`${task_length} tasks wait for solve`)

            if (task_length > 0) {
                for (let i = 0; i < msg.count; i++) {
                    const text = await client.rpoplpush(q_pending, q_solving)
                    if (!text || typeof text !== 'string') {
                        log.debug(`no more task in ${q_pending}`)
                        break
                    }

                    const task = getTask(text)
                    log.debug(`get task: ${task?.id}`)

                    process.send({ 'command': config.command.NEW_TASK, 'task': task })
                }
            }
        } else if (msg.command === config.command.SAVE_ANNOTATION) {
            const annotated = msg.annotated

            log.debug(`store solve task[${annotated.id}] to ${q_done}`)

            // store solve result to queue done
            const result = await client
                .multi()
                .lpush(q_done, JSON.stringify(annotated)) // push astrometry result into queue done
                .rpop(q_solving) // remove task from queue solving
                .exec()

            log.debug(result)

            process.send({ 'command': config.command.ANNOTATION_SAVED, 'annotated': annotated })
        }
    })
})()
