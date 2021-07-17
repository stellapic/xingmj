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

    log.info('create redis client')
    // create redis client with lazy connect
    const client = new IORedis(config.redis.connect)

    // event handler
    client.once('error',  error => {
        log.error(error.message)
        
        process.send({ 'command': config.command.REDIS_ERROR, 'error': error.message })
    })

    client.once('ready', () => {
        log.info(`connect to redis success`)
        process.send({ 'command': config.command.REDIS_READY })
    })

    client.once('end', () => {
        process.send({ 'command': config.command.REDIS_FAILED })
    })

    client.once('disconnect', () => {
        process.send({ 'command': config.command.REDIS_FAILED })
    })

    // retry loop
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

    // message handler
    process.on('message', async msg => {
        // retrieve count of pending tasks
        if (msg.command === config.command.GET_TASK_COUNT) {
            log.info('retrieve task from queue')

            const task_length = await client.llen(config.redis.QUEUE_PENDING)
            log.info(`get ${task_length} tasks`)

            process.send({ 'command': config.command.TASK_COUNT, 'count': task_length })
        }

        // send pending tasks to master
        else if (msg.command === config.command.GET_TASKS) {
            const task_length = await client.llen(config.redis.QUEUE_PENDING)
            // log.info(`${task_length} tasks wait for solve`)

            // pop task if pending queue has tasks
            if (task_length > 0) {
                log.debug(`task_length > 0, ready to get ${msg.count} tasks`)
                for (let i = 0; i < msg.count; i++) {
                    const text = await client.rpoplpush(config.redis.QUEUE_PENDING, config.redis.QUEUE_SOLVING)
                    // log.debug(`get new task: ${text}`)

                    // task data is not valid json
                    if (!text || typeof text !== 'string') {
                        log.debug(`no more task in ${config.redis.QUEUE_PENDING}`)
                        break
                    }

                    const task = getTask(text)
                    // log.debug(`get task: ${task?.id}`)

                    process.send({ 'command': config.command.NEW_TASK, 'task': task })
                }
            }
        }

        // move solving task to queue done when annotation finished
        else if (msg.command === config.command.SAVE_ANNOTATION) {
            const annotated = msg.annotated

            log.debug(`store solve task[${annotated.id}] to ${config.redis.QUEUE_DONE}`)

            // store solve result to queue done
            const result = await client
                .multi()
                .lpush(config.redis.QUEUE_DONE, JSON.stringify(annotated)) // push astrometry result into queue done
                .rpop(config.redis.QUEUE_SOLVING) // remove task from queue solving
                .exec()

            log.debug(result)

            process.send({ 'command': config.command.ANNOTATION_SAVED, 'annotated': annotated })
        }

        // delete task when error occured, e.g. url not exists, dir exists, annotation failed, etc.
        else if (msg.command === config.command.TASK_EXCEPTION) {
            let task = msg.task

            log.warn(`remove error task[${task.id}] from queue solving`)
            const ret = await client.lrem(config.redis.QUEUE_SOLVING, 0, JSON.stringify(task))
            console.log(`ret = ${ret}`, JSON.stringify(task))
            if (ret <= 0) {
                const cmd = `lrem ${config.redis.QUEUE_SOLVING} 0 ${JSON.stringify(task)}`
                log.warn(`cmd failed: ${cmd}`)

                return
            }

            // save eroor task to queue failed
            task = Object.assign(task, { 'status': config.api.STATUS_ERROR, 'error': msg.error })
            const lpush_result = await client.lpush(config.redis.QUEUE_FAILED, JSON.stringify(task))
            
            log.warn(`save error task[${task.id}] to ${config.redis.QUEUE_FAILED}`)
        }

        // default
        else {
            log.warn(`unknow command from master: ${JSON.stringify(msg)}`)
        }
    })
})()
