const TwitterAPI = require('twitter-api-v2').TwitterApi;
const Configuration = require('../../config.json');

const RequestClient = new TwitterAPI({
    appKey: Configuration.ConsumerToken,
    appSecret: Configuration.ConsumerSecret
});

module.exports = RequestClient;