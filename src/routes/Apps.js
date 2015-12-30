/**
 *
 */

'use strict';

import express from 'express';
import axios from 'axios';
let nano = require('nano')('http://localhost:5984');
let debug = require('debug')('src:routes/apps');

let AppsRouter = express.Router();

AppsRouter.post('/:appId/:username', (req, res) => {
    let appId = req.params.appId;
    let username = req.params.username;
    debug('AppsRouter POST : ', appId, username, req.query, req.body);

    let query = req.query || {};
    let data = req.body || {};

    let App = nano.use(`phr_apps_${appId}`);
    // Categorize with User
    data.username = username;

    App.insert(data, (err, body) => {
        if(body) {
            debug('/apps create : ', err, ' body: ', body);
            res.json(body);
        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    });
});

AppsRouter.get('/', (req, res) => {
    debug('AppsRouter GET : ', req.params);

    let data = req.params || {};
    res.json(data);
});

AppsRouter.put('/', (req, res) => {
    debug('AppsRouter PUT : ', req.body);

    let data = req.body.data || {};
    res.json(data);
});

AppsRouter.delete('/', (req, res) => {
    debug('AppsRouter DELETE : ', req.body);

    let data = req.body.data || {};
    res.json(data);
});

export default AppsRouter;
