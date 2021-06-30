'use strict'

import Hapi from '@hapi/hapi'

(() => {
    const SOLVER_HOST = 'localhost'
    const SOLVER_PORT = 3000

    const server = new Hapi.server({
        port: SOLVER_PORT,
        host: SOLVER_HOST
    })

    // 
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'welcome to astrometry'
        }
    })

    process.on('unhandledRejection', (err) => {
        console.log(err)
        process.exit(1)
    })

    await server.start()
    console.log('Server running on %s', server.info.uri)
})()
