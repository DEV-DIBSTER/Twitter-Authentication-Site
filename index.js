const ExpressJS = require('express');
const Session = require('express-session');

const CallbackRouter = require('./src/routes/callback.js');
//const PinRouter = require('./src/routes/pin.js');
const AuthSite = ExpressJS();
const Configuration = require('./config.json');

AuthSite.set('view engine', 'ejs');
AuthSite.use(Session({
    secret: 'twitter-api-v2',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

AuthSite.use(CallbackRouter);
//AuthSite.use(PinRouter);

AuthSite.use((Error, Request, Response, Next) => {
    console.log(Error);
    Response.status(500).render('error');
});

AuthSite.listen(Configuration.Port, () => {
    console.log(`[Twitter Authentication] Twitter Authentication is online at http://127.0.0.1:${Configuration.Port}`);
});