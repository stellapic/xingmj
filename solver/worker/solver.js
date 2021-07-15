'use strict'

import urlExist from "url-exist"
import { setTimeout } from 'timers/promises'

import config from '../config.js'
import Logger from '../logger.js'
import SolverFactory from '../factory/SolverFactory.js'


/**
 * check annotated data is or not valid
 * @param object annotated
 * @returns boolean
 */
const isValidAnnotated = annotated => {
    if (!annotated) return false

    return annotated.status === config.api.STATUS_SUCCESS
}

/**
 * send task error to master process
 * @param object task
 * @param string error
 * @returns boolean
 */
const sendErrorTask = (task, error) => {
    process.send({ 'command': config.command.TASK_EXCEPTION, 'task': task, 'error': error })
}

(async () => {
    // get logger instance
    const log = Logger.getInstance()

    // message handler
    process.on('message', async (msg) => {
        log.debug(`get message from master: ${msg.command}`)

        // new task annotation
        if (msg.command === config.command.NEW_TASK) {
            let task = msg.task

            // check image url is or not exists
            const exists = await urlExist(task.url)

            if (!exists) {
                log.warn(`url of task[${task.id}] does't exists, ${task.url}`)

                // send error task to master process
                log.debug(`send task[${task.id}] exception to master`)
                sendErrorTask(task, `image url does't exists`)

                await setTimeout(1000)

                log.debug('process.exit')
                process.exit()

                return
            }

            // task = Object.assign(task, { 'pid': msg.pid })

            // create solver
            const solver = SolverFactory.getSolver(config.solver)
            // run solve process
            let annotated = await solver.run(task.id, task.url)

            if (!isValidAnnotated(annotated)) {
                log.warn(`annotation[${annotated.id}] failed`)

                const error = annotated?.error ? annotated?.error: 'unknown error'

                log.debug(`send error task[${task.id}] to master`)
                sendErrorTask(task, error)

                await setTimeout(1000)

                log.debug('process.exit')
                process.exit()

                return
            }

            annotated = Object.assign(annotated, { 'pid': msg.pid })

            // send annotated to master process
            log.debug(`send solved task[${task.id}] to master`)
            process.send({ 'command': config.command.TASK_SOLVED, 'annotated': annotated })
        }
        
        // do process exit
        else if (msg.command === config.command.PROCESS_EXIT) {
            log.debug(`exiting subprocess solver[${process.pid}]`)

            process.exit()
        }

        // default
        else {
            log.warn(`unknow command from master: ${JSON.stringify(msg)}`)
        }
    })

    // on process exit
    process.on('exit', () => {
        log.debug(`subprocess solver[${process.pid}] has exited`)

        process.send({ 'command': config.command.PROCESS_EXIT, 'pid': process.pid })
    })
})()
