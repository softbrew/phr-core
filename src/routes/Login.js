/**
 *
 */

'use strict';

import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
let debug = require('debug')('src:routes/login');

let LoginRouter = express.Router();

// Authenticate user login
LoginRouter.post('/signin', (req, res) => {
    //TODO validate username and password
    console.log('Req Body ', req.body);

    if (!(req.body.username === 'milan' && req.body.password ===
            'milan123')) {
        //if is invalid, return 401
        res.status(401).json({
            error: 'Wrong username or password.'
        });
        return;
    }

    var profile = {
        first_name: 'Milan',
        last_name: 'karunarathne',
        email: 'mhkarunarathne.com',
        id: 123
    };

    // sending the profile inside the token
    const token = jwt.sign(profile, 'secret', {
        expiresIn: '10s'
    });

    res.json({
        token: token
    });
});

LoginRouter.get('/signup', (req, res) => {
    res.json({
        message: 'SignUp successful.'
    });
});

LoginRouter.post('/import/patient', (req, res) => {
    debug('Import Patient: ', req.body);
    axios.get(`/Patient/${req.body.patientId}`, {
        baseURL : req.body.baseURL
    }).then(response => {
        console.log('Patient: ', response.data);
        res.json(response.data);
    }).catch(err => {
        console.error(err);
    });
});

export default LoginRouter;
