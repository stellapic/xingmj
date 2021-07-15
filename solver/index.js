'use strict'

import { fork } from 'child_process'
import { setTimeout } from 'timers/promises'

import config from './config.js'
import Logger from './logger.js'

(async () => {
    const log = Logger.getInstance()
    
    /**
     * sleep
     * @param int ms
     */
    const sleep = async (ms) => {
        log.info(`sleep ${ms} secnods`)
        await setTimeout(ms)
    }

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        log.error(`uncaught exception: ${err}, 'origin: ${origin}`)
    })

    process.on('unhandledRejection', (reason, promise) => {
        log.error(`Unhandled Rejection at: ${promise}, 'reason: ${reason}`)
    })

    log.info('astrometry solver started')

    const workers = new Map()
    const redis_worker = fork('./worker/redis.js')

    // setInterval(() => {
    //     console.log(workers.size)
    // }, 1000)

    redis_worker.on('message', async (msg) => {
        log.debug(`receive command[${msg.command}] from redis_worker[${redis_worker.pid}]`)

        // redis connect success
        switch (msg.command) {
            // redis connect sucess
            case config.command.REDIS_READY:
                log.debug('redis connection is ready')

                let count = config.process.MAX_PROCESS - workers.size
                if (count <= 0) {
                    log.debug(`workers map is full`)
                    return
                }

                log.debug(`retrieve ${count} tasks from redis worker`)

                // send get task command
                redis_worker.send({ 'command': config.command.GET_TASKS, 'count': count })
                break

            // new task from redis, fork new process to solve
            case config.command.NEW_TASK:
                const solve_worker = fork('./worker/solver.js', ['|', './node_modules/bunyan/bin/bunyan'])

                if (!solve_worker) {
                    log.error('fork solver.js failed')
                    return
                }

                solve_worker.on('message', async (msg) => {
                    console.log(msg)
                    if (msg.command === config.command.TASK_SOLVED) {
                        const annotation = msg.annotated

                        redis_worker.send({ 'command': config.command.SAVE_ANNOTATION, 'annotated': annotation })
                    } else if (msg.command === config.command.PROCESS_EXIT) {
                        const key = `solver_${solve_worker.pid}`
                        workers.delete(key)
                        log.debug(`delete worker[${key}] from map`)

                        log.debug(`${workers.size} worker in map now`)

                        // get new task from redis
                        let count = config.process.MAX_PROCESS - workers.size
                        if (count > 0) {
                            log.debug(`${workers.size} workers, create new one`)

                            await sleep(100)

                            log.debug(`retrieve ${count} tasks from redis worker`)
                            redis_worker.send({ 'command': config.command.GET_TASKS, 'count': count })
                        }
                    } else if (msg.command === config.command.TASK_EXCEPTION) {
                        // task error(e.g. annotate failed, url not exists, etc.), move task to failure list
                        log.debug(`solver worker report task[${msg.task.id}] error`)
                        console.log(msg.task)

                        redis_worker.send({ 'command': config.command.TASK_EXCEPTION, 'task': msg.task, 'error': msg.error })
                    }
                })

                const task = msg.task
                await setTimeout(1000)
                solve_worker.send({ 'command': config.command.NEW_TASK, 'task': task, 'pid': solve_worker?.pid })

                workers.set(`solver_${solve_worker?.pid}`, solve_worker)
                break

            // annotation finish, save result to done list
            case config.command.ANNOTATION_SAVED:
                    const annotated = msg.annotated

                    const worker = workers.get(`solver_${annotated?.pid}`)

                    // kill sovler subprocess
                    if (worker) {
                        worker.send({ 'command': config.command.PROCESS_EXIT })
                    }
                break

            // default case
            default:
                console.log(msg)
                break
        }
    })
})()
