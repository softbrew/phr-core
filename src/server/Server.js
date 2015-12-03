/**
 * PHR API server
 * USAGE:
 *
 */

'use strict';

import path from 'path';
import express from 'express';
import expressJwt from 'express-jwt';
import bodyParser from 'body-parser';

import LoginRouter from '../routes/Login';

import isAdmin from '../config/policy/isAdmin';

let Server = express();

/* Setup environment */
Server.use(bodyParser.json()); // for parsing application/json
Server.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

/* Set Policies */
Server.all('/admin/*', isAdmin);
Server.use('/api', expressJwt({
    secret: 'secret'
})); // protect /api routes with JWT

/* Set routes */
Server.use('/user', LoginRouter);


export default Server;
