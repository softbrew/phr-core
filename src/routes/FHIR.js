'use strict';

import express from 'express';
import axios from 'axios';
let jwt = require('jsonwebtoken');
let nano = require('nano')('http://localhost:5984');
let debug = require('debug')('src:routes/FHIR');

let FHIRRouter = express.Router();

FHIRRouter.get('/:resource/:id', (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.decode(token);
    debug('GET ', token, decoded);

    let fhirServerURL = decoded.fhirServerList[0].url;

    axios.get(`/${req.params.resource}/${req.params.id}`, {
        baseURL: fhirServerURL
    }).then(response => {
        debug(`GET ${req.params.resource}: `, JSON.stringify(response.data));
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

export default FHIRRouter;
