import { TwitterApi } from 'twitter-api-v2';

const RequestClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY!,
  appSecret: process.env.CONSUMER_SECRET!,
});

export default RequestClient;
