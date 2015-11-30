/**
 * PHR API server
 * USAGE:
 *
 */

'use strict';

import path from 'path';
import express from 'express';
import session from 'express-session';

import LoginRouter from '../routes/Login';

// Policies
import SessionPolicy from '../config/policy/SessionPolicy';

let Server = express();

// Setup environment
//Server.use('/public', express.static('public'));
Server.use('/public', express.static('/home/milan/softbrew/dashboard/public'));
Server.use(session({
    secret: 'session@secret',
    resave: false,
    cookie: {
        maxAge: 60000
    }
}));

// Set Policies
Server.use(SessionPolicy);

// Set routes
Server.use('/', LoginRouter);


export default Server;
