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
import AppsRouter from '../routes/Apps';
import FHIRRouter from '../routes/FHIR';

import isAdmin from '../config/policy/isAdmin';

let Server = express();

/* Setup environment */
Server.use(bodyParser.json()); // for parsing application/json
Server.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded


/*************  Set Policies ************************/
Server.all('/admin/*', isAdmin);

Server.use('/api', expressJwt({
    secret: 'secret'
})); // protect /api routes with JWT

Server.use('/user', expressJwt({
    secret: 'secret'
}).unless({
    path: ['/user/signin', '/user/signup', '/user/import/patient']
})); // protect /user routes with JWT

Server.use('/apps', expressJwt({
    secret: 'secret'
})); // protect /user routes with JWT

Server.use('/fhir', expressJwt({
    secret: 'secret'
})); // protect /user routes with JWT


// Send JSON error when Unauthorized error
Server.use(function(err, req, res, next) {
    console.log('Server Error : ', JSON.stringify(err));
    if(err.name === 'UnauthorizedError') {
        delete err.inner.stack;
        res.status(401).json({
            type: err.code,
            message: err.message,
            error: err.inner
        });
    }
});

/*************  Set Routes ************************/
Server.use('/user', LoginRouter);
Server.use('/apps', AppsRouter);
Server.use('/fhir', FHIRRouter);

export default Server;
