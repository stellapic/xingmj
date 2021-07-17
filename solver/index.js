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
        log.info(`sleep ${ms/1000} secnods`)
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

    let ready = false
    setInterval(() => {
        if (!ready) return
    
        console.log(workers.size, config.process.MAX_PROCESS, workers.size >= config.process.MAX_PROCESS)
        if (workers.size >= config.process.MAX_PROCESS) return

        let count = config.process.MAX_PROCESS - workers.size
        if (count <= 0) {
            log.debug(`workers map is full`)
            return
        }

        // log.debug(`need ${count} solver work`)

        // send get task command
        // redis_worker.send({ 'command': config.command.GET_TASKS, 'count': count })
    }, 1000)

    redis_worker.on('message', async (msg) => {
        log.debug(`receive command[${msg.command}] from redis_worker[${redis_worker.pid}]`)

        // redis connect success
        switch (msg.command) {
            // redis connect sucess
            case config.command.REDIS_READY:
                log.debug('redis connection is ready')

                ready = true
                break

            // new task from redis, fork new process to solve
            case config.command.NEW_TASK:
                const solve_worker = fork('./worker/solver.js', ['|', './node_modules/bunyan/bin/bunyan'])

                if (!solve_worker) {
                    log.error('fork solver.js failed')
                    return
                }

                // message handler
                solve_worker.on('message', async (msg) => {
                    // console.log(msg)

                    // annotation success
                    if (msg.command === config.command.TASK_SOLVED) {
                        const annotation = msg.annotated

                        redis_worker.send({ 'command': config.command.SAVE_ANNOTATION, 'annotated': annotation })
                    }
                    
                    // solve process exited
                    else if (msg.command === config.command.PROCESS_EXIT) {
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
                    }
                    
                    // task annotation error occured
                    else if (msg.command === config.command.TASK_EXCEPTION) {
                        // task error(e.g. annotate failed, url not exists, etc.), move task to failure list
                        log.debug(`solver worker report task[${msg.task.id}] error`)
                        console.log(msg.task)

                        redis_worker.send({ 'command': config.command.TASK_EXCEPTION, 'task': msg.task, 'error': msg.error })
                    }

                    //
                    else {
                        log.warn(`unknow command from solver: ${JSON.stringify(msg)}`)
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

            // redis connection failed
            case config.command.REDIS_FAILED:
                log.error('redis connection failed')

                ready = false
                break

            // redis error occured
            case config.command.REDIS_ERROR:
                log.error('redis error occured')
                break

            // default case
            default:
                log.warn(`unknow command from redis: ${JSON.stringify(msg)}`)
                break
        }
    })
})()
