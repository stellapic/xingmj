'use strict';

const Hapi = require('@hapi/hapi');

(async () => {
    const SOLVER_HOST = 'localhost';
    const SOLVER_PORT = 3000;

    const server = new Hapi.server({
        port: SOLVER_PORT,
        host: SOLVER_HOST
    });

    // 
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
})();
