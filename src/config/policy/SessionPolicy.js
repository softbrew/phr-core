import parseurl from 'parseurl';

export default (req, res, next) => {
    const session = req.session;
    console.log('Session: ', session);
    console.log('SessionID: ', session.id);

    var views = req.session.views;

    if (!views) {
        views = req.session.views = {};
    }

    // get the url pathname
    var pathname = parseurl(req).pathname;

    // count the views
    views[pathname] = (views[pathname] || 0) + 1;
    next();
};
