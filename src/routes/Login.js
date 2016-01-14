/**
 *
 */

'use strict';

import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
let nano = require('nano')('http://localhost:5984');
let Users = nano.use('phr_users');
let debug = require('debug')('src:routes/login');

let LoginRouter = express.Router();

// Get user details
LoginRouter.get('/:username', (req, res) => {
    debug('/:username : ', req.params.username);

    let username = req.params.username || '';
    Users.get(username, (err, user) => {
        debug('/:username get user: ', err, ' user: ', user);

        if(user) {
            let newUser = {
                id: user._id,
                rev: user._rev,
                username: user.username,
                email: user.email,
                name: user.name,
                address: user.address,
                birthDate: user.birthDate,
                gender: user.gender,
                telecom: user.telecom,
                fhirServerList: user.fhirServerList,
                createdAt: user.createdAt,
                modifiedAt: user.modifiedAt,
            };

            res.json({
                user: newUser
            });
        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    }); // END - GetUser
});

// Authenticate user login
LoginRouter.post('/signin', (req, res) => {
    // TODO: validate username and password
    debug('/signin : ', req.body);

    Users.get(req.body.username, (err, user) => {
        debug('/signin get user: ', err, ' user: ', user);

        if(user) {
            if(!(req.body.username === user.username &&
                    req.body.password === user.password)) {
                //if is invalid, return 401
                res.status(401).json({
                    error: 'Wrong username or password.'
                });
                return;
            }

            let newUser = {
                id: user._id,
                rev: user._rev,
                username: user.username,
                email: user.email,
                name: user.name
            };
            // sending the profile inside the token
            let token = jwt.sign(newUser, 'secret', {
                expiresIn: '12h'
            });
            res.json({
                token: token,
                user: newUser
            });
        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    });
});

// Create a new user
LoginRouter.post('/signup', (req, res) => {
    debug('/signup : ', req.body);

    // TODO: Should validate new user details
    let user = req.body.patient;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    // Create a new User in PHR database
    Users.insert(user, user.username, (err, body) => {
        if(body) {
            debug('/signup create user: ', err, ' body: ', body);

            let newUser = {
                id: body.id,
                rev: body.rev,
                username: user.username,
                email: user.email,
                name: user.name
            };
            // sending the profile inside the token
            let token = jwt.sign(newUser, 'secret', {
                expiresIn: '12h'
            });

            res.json({
                token: token,
                user: newUser
            });
        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    });
});

// Change User password
LoginRouter.put('/pwChange/:username', (req, res) => {
    let username = req.params.username;
    debug('/pwChange : ', req.body);

    // Get existing user form PHR database
    Users.get(username, (err, user) => {
        if(user) {
            debug('/pwChange get user : ', err, ' user: ', user);

            if(!(username === user.username &&
                    req.body.password === user.password)) {
                //if is invalid, return 401
                res.status(400).json({
                    error: 'Please chech and enter, current password correctly.'
                });
                return;
            }

            if(req.body.hasOwnProperty('newPassword')) {
                user.password = req.body.newPassword;
            }
            user.modifiedAt = Date.now();

            Users.insert(user, (err, newUser) => {
                debug('/pwChange change password : ', err, newUser);
                if(!err) {
                    res.json({
                        message: "Password changed successful."
                    });
                } else {
                    res.status(err.statusCode).json({
                        type: err.name,
                        message: err.reason,
                        error: err.error
                    });
                }
            });

        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    });
});

// Update User (Excluding some fileds)
LoginRouter.put('/:username', (req, res) => {
    let username = req.params.username;
    debug('Update user : ', req.body);

    // Get existing user form PHR database
    Users.get(username, (err, user) => {
        if(user) {
            debug('Update user (get): ', err, ' user: ', user);

            const valideFields = ['address', 'birthDate', 'gender', 'name', 'telecom', 'fhirServerList'];
            for(let i of Object.keys(req.body)) {
                if(valideFields.indexOf(i) > -1) {
                    user[i] = req.body[i];
                } else {
                    res.status(400).json({
                        error: `Not allowed to change '${i}' field.`
                    });
                    return;
                }
            }
            user.modifiedAt = Date.now();

            Users.insert(user, (err, updatedUser) => {
                debug('Update user (updatedUser) : ', err, updatedUser);
                if(!err) {
                    let newUser = {
                        id: user._id,
                        rev: user._rev,
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        address: user.address,
                        birthDate: user.birthDate,
                        gender: user.gender,
                        telecom: user.telecom,
                        fhirServerList: user.fhirServerList,
                        createdAt: user.createdAt,
                        modifiedAt: user.modifiedAt,
                    };

                    res.json({
                        user: newUser
                    });
                } else {
                    res.status(err.statusCode).json({
                        type: err.name,
                        message: err.reason,
                        error: err.error
                    });
                }
            });

        } else {
            res.status(err.statusCode).json({
                type: err.name,
                message: err.reason,
                error: err.error
            });
        }
    });
});

// import Patient form third party FHIR server
LoginRouter.post('/import/patient', (req, res) => {
    debug('Import Patient: ', req.body);
    axios.get(`/Patient/${req.body.patientId}`, {
        baseURL: req.body.baseURL
    }).then(response => {
        console.log('Patient: ', JSON.stringify(response.data));
        res.json(response.data);
    }).catch(err => {
        console.error(err);
        res.status(404).json({
            type: 'not_found',
            message: 'Unable to import patient.',
            error: new Error('Unable to import patient.')
        });
    });
});

export default LoginRouter;
