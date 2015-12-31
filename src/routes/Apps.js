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
    data.type = username;

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

AppsRouter.get('/:appId/:username', (req, res) => {
    let appId = req.params.appId;
    let username = req.params.username;
    debug('AppsRouter POST : ', appId, username, req.query);

    let query = req.query || {};

    let App = nano.use(`phr_apps_${appId}`);
    // Query with User
    query.username = username;

    App.view('apps', 'by_type', {"key": username}, (err, body) => {
        if(body) {
            debug('/apps get : ', err, ' body: ', body);
            console.log(body.rows);
            let rows = [];
            for(let row of body.rows) {
                delete row.value.type;
                rows.push(row.value);
            }
            res.json(rows);
        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    });
});

AppsRouter.put('/:appId/:username', (req, res) => {
    let appId = req.params.appId;
    let username = req.params.username;
    debug('AppsRouter PUT : ', appId, username, req.query, req.body);

    let query = req.query || {};
    let data = req.body || {};

    let App = nano.use(`phr_apps_${appId}`);
    // Categorize with User
    data.type = username;

    App.insert(data, (err, body) => {
        if(body) {
            debug('/apps update : ', err, ' body: ', body);
            delete data.type;
            data._id = body.id;
            data._rev = body.rev;
            res.json(data);
        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    });
});

AppsRouter.delete('/:appId/:username', (req, res) => {
    debug('AppsRouter DELETE : ', req.body);

    let data = req.body.data || {};
    res.json(data);
});

export default AppsRouter;
