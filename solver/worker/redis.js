'use strict'

import IORedis from 'ioredis'
import retry from 'async-retry'
import { setTimeout } from 'timers/promises'

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
    let ready = false
    let tasks = 0
    const log = Logger.getInstance()

    log.info('create redis client')
    // create redis client with lazy connect
    const client = new IORedis(config.redis.connect)

    // event handler
    client.once('error',  error => {
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
        log.error('redis disconnect end')
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
                .lpush(config.redis.QUEUE_DONE, JSON.stringify(annotated)) // push astrometry result into queue done
                .rpop(config.redis.QUEUE_SOLVING) // remove task from queue solving
                .exec()

            log.debug(result)

            process.send({ 'command': config.command.ANNOTATION_SAVED, 'annotated': annotated })
            tasks--
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
                tasks--

                return
            }

            // save eroor task to queue failed
            task = Object.assign(task, { 'status': config.api.STATUS_ERROR, 'error': msg.error })
            const lpush_result = await client.lpush(config.redis.QUEUE_FAILED, JSON.stringify(task))
            
            log.warn(`save error task[${task.id}] to ${config.redis.QUEUE_FAILED}`)
            tasks--
        }

        // default
        else {
            log.warn(`unknow command from master: ${JSON.stringify(msg)}`)
        }
    })

    // console.log(123)
    do {
        console.log(ready)
        if (!ready) {
            await setTimeout(1000)
            continue
        }

        const diff = config.process.MAX_PROCESS - tasks
        console.log(diff)
        if (diff <= 0) {
            log.info(`task pool is full[${config.process.MAX_PROCESS}]`)
            await setTimeout(500)

            continue
        }

        const text = await client.brpoplpush(config.redis.QUEUE_PENDING, config.redis.QUEUE_SOLVING, config.redis.TIMEOUT)
        const task = getTask(text)
        log.debug(`get task: ${text}`)

        // check task string is or not valid json
        if (!text || typeof text !== 'string') {
            log.debug(`task json string invalid`)
            break
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
