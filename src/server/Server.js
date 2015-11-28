/**
 * PHR API server
 * USAGE:
 *
 */

'use strict';

import express from 'express';
import path from 'path';

import LoginRouter from '../routes/Login';

let Server = express();

// Setup environment
//Server.use('/public', express.static('public'));
Server.use('/public', express.static('/home/milan/softbrew/dashboard/public'));

// Set routes
Server.use('/', LoginRouter);

export default Server;
