/**
 * Entry point of the server and manupulate configurations
 * @authors Milan Karunarathne <mhkarunarathne@gmail.com>
 *
 * USAGE:
 *
 */

'use strict';

//import 'source-map-support/register';
require('source-map-support').install({
    environment: 'node'
});

// Module dependencies
import http from 'http';
import express from 'express';
import Server from './server/Server';
import d from 'debug';
let debug = d('src:index');
import config from '../config';

console.log('Server start with configuration: ', config);

// Serve Client Side files
Server.use('/public', express.static(__dirname + config.staticFilesDirectory));

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(config.hostPort || '3000');
Server.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(Server);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = (typeof addr === 'string') ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log(`\n\tGo to http://${config.hostAddress}:${config.hostPort}/public/login.html`);
}
