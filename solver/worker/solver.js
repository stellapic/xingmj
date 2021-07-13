'use strict'

import urlExist from "url-exist"

import config from '../config.js'
import Logger from '../logger.js'
import SolverFactory from '../factory/SolverFactory.js'

(async () => {
    // get logger instance
    const log = Logger.getInstance()

    // message handler
    process.on('message', async (msg) => {
        log.debug(`get message from master: ${msg.command}`)

        if (msg.command === config.command.NEW_TASK) {
            const task = msg.task

            // check image url is or not exists
            const exists = await urlExist(task.url)

            if (!exists) {
                log.warn(`task[${task.id}]'s url does't exists, ${task.url}`)

                // send to master process
                process.send({ 'command': config.command.ERROR_TASK, 'task': task })

                process.exit()
            }

            // create solver
            const solver = SolverFactory.getSolver(config.solver)
            // run solve process
            const annotated = await solver.run(task.id, task.url)

            // send annotated to master process
            if (annotated) {
                Object.assign(annotated, { 'pid': task.pid })
                process.send({ 'command': config.command.TASK_SOLVED, 'annotated': annotated })
            }
        } else if (msg.command === config.command.PROCESS_EXIT) {
            process.exit()
        }
    })

    process.on('exit', () => {
        log.debug(`subprocess solver[${process.pid}] exited`)

        process.send({ 'command': config.command.PROCESS_EXIT, 'pid': process.pid })
    })
})()
