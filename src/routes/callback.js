const ExpressJS = require('express');
const Router = require('express').Router;
const TwitterAPI = require('twitter-api-v2').TwitterApi;
const Configuration = require('../../config.json');
const RequestClient = require('../misc/client.js');
const { AsyncWrapOrError } = require('../misc/utils.js');

const CallbackRouter = Router();

CallbackRouter.get('/', AsyncWrapOrError(async (Request, Response) => {
    const Link = await RequestClient.generateAuthLink(`${Configuration.Secure ? "https" : "http"}:${Configuration.Secure == true ? Configuration.SiteURL : `localhost:${Configuration.Port}`}/callback`);

    Request.session.oauthToken = Link.oauth_token;
    Request.session.oauthSecret = Link.oauth_token_secret;

    console.log(Request.session);

    Response.render('index', { authLink: Link.url, authMode: 'callback' });
}));

CallbackRouter.get('/callback', AsyncWrapOrError(async (Request, Response) => {
    if (!Request.query.oauth_token || !Request.query.oauth_verifier) {
        Response.status(400).render('error', { error: 'Bad request, or you denied application access. Please renew your request.' });
        return;
    };
    
    const Token = Request.query.oauth_token;
    const verifier = Request.query.oauth_verifier;
    const SavedToken = await Request.session.oauthToken;
    const SavedSecret = await Request.session.oauthSecret;
    
    console.log(Request.session);

    if (!SavedToken || !SavedSecret || SavedToken !== Token) {
        Response.status(400).render('error', { error: 'OAuth token is not known or invalid. Your request may have expire. Please renew the auth process.' });
        return;
    };
    
      // Build a temporary client to get access token
    const TemporaryClient = new TwitterAPI({
        appKey: Configuration.ConsumerToken,
        appSecret: Configuration.ConsumerSecret,
        accessToken: Token,
        accessSecret: SavedSecret
    });
    
      // Ask for definitive access token
      const { accessToken, accessSecret, screenName, userId } = await TemporaryClient.login(verifier);
      // You can store & use accessToken + accessSecret to create a new client and make API calls!
    
      Response.render('callback', { accessToken, accessSecret, screenName, userId });
}));

module.exports = CallbackRouter;