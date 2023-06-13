const ExpressJS = require('express');
const Session = require('express-session');
const Execute = require('child_process').exec;
const FaviconJS = require('serve-favicon');


const CallbackRouter = require('./src/routes/callback.js');
const GeneralRouter = require('./src/routes/index.js');
const PinRouter = require('./src/routes/pin.js');
const AuthSite = ExpressJS();
const Configuration = require('./config.json');

AuthSite.set('view engine', 'ejs');
AuthSite.use(ExpressJS.static(__dirname));
AuthSite.use(FaviconJS(__dirname + "/Assets/favicon.ico"));
AuthSite.use(Session({
    secret: Configuration.SessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

setInterval(() => {
        Execute(`git pull`, async (Error, Stdout) => {
            let Response = (Error || Stdout);
            if (!Error) {
                if (Response.includes("Already up to date.")) {
                
                } else {
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                };
            };
        });
}, 60 * 1000);

AuthSite.use(CallbackRouter);
AuthSite.use(GeneralRouter);
AuthSite.use(PinRouter);

AuthSite.use((Error, Request, Response, Next) => {
    console.log(Error);
    Response.status(500).render('error');
});

AuthSite.listen(Configuration.Port, () => {
    console.log(`[Twitter Authentication] Twitter Authentication is online at ${Configuration.Secure ? "https" : "http"}://${Configuration.Secure == true ? Configuration.SiteURL : `127.0.0.1:${Configuration.Port}`}`);
});