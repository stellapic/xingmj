'use strict'

import { fork } from 'child_process'
import { setTimeout, setInterval } from 'timers/promises'

import config from './config.js'
import Logger from './logger.js'

(async () => {
    const log = Logger.getInstance()

    /**
     * check annotated data is or not valid
     * @param object annotated
     * @returns boolean
     */
    const isValidAnnotated = annotated => {
        if (!annotated) return false
    
        return annotated.status === config.api.STATUS_SUCCESS
    }
    
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

            // case config.command.TASK_COUNT:
            //     const worker_count = workers.size
            //     const pending_count = msg.count

            //     let count = config.process.MAX_PROCESS - worker_count
            //     if (count > 0) {
            //         redis_worker.send({ 'command': , 'count': count })
            //     }
            //     break

            // new task from redis, fork new process to solve
            case config.command.NEW_TASK:
                const solve_worker = fork('./worker/solver.js', ['|', './node_modules/bunyan/bin/bunyan'])

                if (!solve_worker) {
                    log.error('fork solver.js failed')
                    return
                }

                solve_worker.on('message', async (msg) => {
                    if (msg.command === config.command.TASK_SOLVED) {
                        const annotation = msg.annotated

                        if (!isValidAnnotated(annotation)) {
                            log.warn(`annotation[${annotation.id}] failed`)
                            return
                        }

                        redis_worker.send({ 'command': config.command.SAVE_ANNOTATION, 'annotated': annotation })
                    } else if (msg.command === config.command.PROCESS_EXIT) {
                        const key = `solver_${solve_worker.pid}`
                        workers.delete(key)
                        log.debug(`delete worker[${key}] from map`)

                        // get new task from redis
                        if (workers.size < config.process.MAX_PROCESS) {
                            log.debug(`${workers.size} workers, create new one`)

                            await sleep(5000)
                            redis_worker.send({ 'command': config.command.GET_TASKS })
                        }
                    }
                })

                const task = msg.task
                task.pid = solve_worker?.pid
                await setTimeout(1000)
                solve_worker.send({ 'command': config.command.NEW_TASK, 'task': task })

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

            // task annotate failed, move task to failure list
            case config.command.ERROR_TASK:
                break
        }
    })
})()
