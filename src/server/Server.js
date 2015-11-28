/**
 * PHR API server
 * USAGE:
 *
 */

'use strict';

import express from 'express';
import path from 'path';

import {
    router as login
}
from 'Login';

let Server = express();

// Set routes
Server.use('/', login);

export default Server;
