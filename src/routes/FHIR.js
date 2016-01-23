'use strict';

import express from 'express';
import axios from 'axios';
let jwt = require('jsonwebtoken');
let nano = require('nano')('http://localhost:5984');
let debug = require('debug')('src:routes/FHIR');

let FHIRRouter = express.Router();

// Get Single resource
FHIRRouter.get('/:resource/:id', (req, res) => {
    // Create Resource URL
    let resourceURL = `/${req.params.resource}` + (req.params.id ? `/${req.params.id}`:'');
    debug('Get data from ', resourceURL, req.query);

    // Decode token and get user data
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.decode(token);
    debug('GET ', token, decoded);

    let fhirServerURL = decoded.fhirServerList[0].url;

    axios.get(resourceURL, {
        baseURL: fhirServerURL
    }).then(response => {
        debug(`GET ${resourceURL}: `, JSON.stringify(response.data));
        res.json(response.data);
    }).catch(err => {
        console.error(err);
        res.status(404).json({
            type: 'not_found',
            message: `Unable to import ${req.params.resource}.`,
            error: new Error('Unable to import patient.')
        });
    });
});

// Get Bundle of resources
FHIRRouter.get('/:resource', (req, res) => {
    // Create Resource URL
    let resourceURL = `/${req.params.resource}`;
    debug('Get data from ', resourceURL, req.query);

    // Decode token and get user data
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.decode(token);
    debug('GET ', token, decoded);

    let fhirServerURL = decoded.fhirServerList[0].url;

    axios.get(resourceURL, {
        baseURL: fhirServerURL,
        params: req.query || {}
    }).then(response => {
        debug(`GET ${resourceURL}: `, JSON.stringify(response.data));
        res.json(response.data);
    }).catch(err => {
        console.error(err);
        res.status(404).json({
            type: 'not_found',
            message: `Unable to import ${req.params.resource}.`,
            error: new Error(`Unable to import ${req.params.resource}.`)
        });
    });
});

// Get next pages of resources
FHIRRouter.get('/', (req, res) => {
    // Create Resource URL
    debug('Get next pages from ', req.query);

    // Decode token and get user data
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.decode(token);
    debug('GET ', token, decoded);

    let fhirServerURL = decoded.fhirServerList[0].url;

    axios.get('', {
        baseURL: fhirServerURL,
        params: req.query || {}
    }).then(response => {
        debug(`GET : `, JSON.stringify(response.data));
        res.json(response.data);
    }).catch(err => {
        console.error(err);
        res.status(404).json({
            type: 'not_found',
            message: `Unable to import ${req.params.resource}.`,
            error: new Error(`Unable to import ${req.params.resource}.`)
        });
    });
});

export default FHIRRouter;
