const Router = require('express').Router;
const TwitterAPI = require('twitter-api-v2').TwitterApi;
const Configuration = require('../../config.json');
const RequestClient = require('../misc/client.js');
const { AsyncWrapOrError } = require('../misc/utils.js');

const PinRouter = Router();

PinRouter.get('/pin-flow', AsyncWrapOrError(async (Request, Response) => {
    const Link = await RequestClient.generateAuthLink(`oob`);

    Request.session.oauthToken = Link.oauth_token;
    Request.session.oauthSecret = Link.oauth_token_secret;

    Response.render('pin', { authLink: Link.url });
}));

PinRouter.post('/validate-pin', require('express').json(), AsyncWrapOrError(async (Request, Response) => {
    const Pin = Request.body;

    if(!Pin){
        Response.status(400).json({message: 'Invalid Pin.'});
    };

    const SavedToken = await Request.session.oauthToken;
    const SavedSecret = await Request.session.oauthSecret;

    if (!SavedToken || !SavedSecret) {
        Response.status(400).render('error', { error: 'Tokens are missing from session. Please retry the auth flow.' });
        return;
    };

    // Build a temporary client to get access token.
    const TemporaryClient = new TwitterAPI({
        appKey: Configuration.ConsumerToken,
        appSecret: Configuration.ConsumerSecret,
        accessToken: SavedToken,
        accessSecret: SavedSecret
    });
    
    try {
        const { accessToken, accessSecret, screenName, userId } = await TemporaryClient.login(Pin.pin);
        // You can store & use accessToken + accessSecret to create a new client and make API calls!
    
        Response.json({ accessToken, accessSecret, screenName, userId });
      } catch (Error) {
        Response.status(400).json({ message: 'Bad PIN code. Please check your input.' });
    };
}));

module.exports = PinRouter;