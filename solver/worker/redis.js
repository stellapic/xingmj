'use strict'

import IORedis from 'ioredis'
import retry from 'async-retry'

import config from '../config.js'
import Logger from '../logger.js'
import { sleep } from './utils.js'


/**
 * get task object
 * @param string str
 * @returns json
 */
const getTask = str => {
    if (typeof (str) === 'string') {
        try {
            const json = JSON.parse(str)
            if (typeof (json) === 'object' && json) {
                return json
            }
        } catch (e) {
            return null
        }
    }

    return null
}

(async () => {
    let ready = false
    let tasks = 0
    const log = Logger.getInstance('redis')

    log.info('create redis client')
    // create redis client with lazy connect
    const client = new IORedis(config.redis.connect)

    // event handler
    client.once('error', error => {
        log.error(error.message)

        // process.send({ 'command': config.command.REDIS_ERROR, 'error': error.message })
    })

    client.once('ready', () => {
        log.info(`connect to redis success`)

        ready = true
        process.send({ 'command': config.command.REDIS_READY })
    })

    client.once('end', () => {
        ready = false
        log.error('redis client end')
        // process.send({ 'command': config.command.REDIS_FAILED })
    })

    client.once('disconnect', () => {
        ready = false
        log.error('redis client disconnect')
        // process.send({ 'command': config.command.REDIS_FAILED })
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
            if (error) log.error(`connect failed: ${error.message}`)
        }
    })


    // worker message handler
    process.on('message', async msg => {
        if (msg.command === config.command.SAVE_ANNOTATION) {
            const annotated = msg.annotated

            log.debug(`store solve task[${annotated.id}] to ${config.redis.QUEUE_DONE}`)

            // store solve result to queue done
            const result = await client
                .multi()
                .lrem(config.redis.QUEUE_SOLVING, 0, JSON.stringify(msg.task))
                // .rpop(config.redis.QUEUE_SOLVING) // remove task from queue solving
                .lpush(config.redis.QUEUE_DONE, JSON.stringify(annotated)) // push astrometry result into queue done
                .exec()

            log.debug(result)

            process.send({ 'command': config.command.ANNOTATION_SAVED, 'annotated': annotated })
            tasks--
            log.debug(`${tasks} in pool`)
        }

        // delete task when error occured, e.g. url not exists, dir exists, annotation failed, etc.
        else if (msg.command === config.command.TASK_EXCEPTION) {
            let task = msg.task

            log.warn(`remove error task[${task.id}] from queue solving`)
            const ret = await client.lrem(config.redis.QUEUE_SOLVING, 0, JSON.stringify(task))
            log.debug(`ret = ${ret}`, JSON.stringify(task))
            if (ret <= 0) {
                const cmd = `lrem ${config.redis.QUEUE_SOLVING} 0 ${JSON.stringify(task)}`
                log.warn(`cmd failed: ${cmd}`)
                tasks--

                log.debug(`${tasks} in pool`)

                return
            }

            // save eroor task to queue failed
            task = Object.assign(task, { 'status': config.api.STATUS_ERROR, 'error': msg.error })
            const lpush_result = await client.lpush(config.redis.QUEUE_FAILED, JSON.stringify(task))

            log.warn(`save error task[${task.id}] to ${config.redis.QUEUE_FAILED}`)
            tasks--

            log.debug(`${tasks} in pool`)
        }

        // default
        else {
            log.warn(`unknow command from master: ${JSON.stringify(msg)}`)
        }
    })

    // console.log(123)
    let last_diff = 0
    do {
        if (!ready) {
            await sleep(1)
            continue
        }

        const diff = config.process.MAX_PROCESS - tasks
        if (last_diff !== diff) {
            last_diff = diff
        }
        if (diff <= 0) {
            await sleep(0.5)

            continue
        }

        // log.debug('loop rpoplpush')
        // As per Redis 6.2.0, BRPOPLPUSH is considered deprecated. Please prefer BLMOVE in new code.
        // const text = await client.lmove(config.redis.QUEUE_PENDING, config.redis.QUEUE_SOLVING, 'right', 'left')
        // const text = await client.brpoplpush(config.redis.QUEUE_PENDING, config.redis.QUEUE_SOLVING, config.redis.TIMEOUT)
        const text = await client.rpoplpush(config.redis.QUEUE_PENDING, config.redis.QUEUE_SOLVING)
        const task = getTask(text)

        if (!task) {
            // log.debug(`no task found or task json string invalid`)

            await sleep(1)
            continue
        }

        log.info(`send task[${task.id}] to master, and transfer to solver worker`)
        let ret = process.send({ 'command': config.command.NEW_TASK, 'task': task })
        if (!ret) {
            log.info(`send task[${task.id}] failed`)
        }

        tasks++
        log.debug(`task pool: ${tasks}/${config.process.MAX_PROCESS}`)
    } while (true)
})()
