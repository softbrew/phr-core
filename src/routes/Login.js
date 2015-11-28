/**
 *
 */

'use strict';

import express from 'express';

let LoginRouter = express.Router();

LoginRouter.get('/', (req, res, next) => {
    res.redirect('/public/index.html');
});

export default LoginRouter;
