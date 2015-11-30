/**
 *
 */

'use strict';

import express from 'express';

let LoginRouter = express.Router();

LoginRouter.get('/', (req, res, next) => {
    res.redirect('/public/index.html');
});

LoginRouter.get('/signup', (req, res) => {
    res.send('viewed this page ' + req.session.views['/signup'] +
        ' times');
});

export default LoginRouter;
