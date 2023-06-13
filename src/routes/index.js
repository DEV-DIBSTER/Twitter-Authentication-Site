const Router = require('express').Router;
const Configuration = require('../../config.json');
const RequestClient = require('../misc/client.js');
const { AsyncWrapOrError } = require('../misc/utils.js');

const GeneralRouter = Router();

//This will show a HTML page with two options.
GeneralRouter.get('/', AsyncWrapOrError(async (Request, Response) => {
    Response.render('main');
}));

//Online endpoint.
GeneralRouter.get('/online', AsyncWrapOrError(async (Request, Response) => {
    Response.status(200).send('Indeed!');
}));

//Uptime endpoint.
GeneralRouter.get('/uptime', AsyncWrapOrError(async (Request, Response) => {
    Response.status(200).send('Work in progress');
}));


module.exports = GeneralRouter;