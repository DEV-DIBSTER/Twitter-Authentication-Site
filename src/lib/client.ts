import { TwitterApi } from 'twitter-api-v2';

let _client: TwitterApi | null = null;

export const getRequestClient = (): TwitterApi => {
  if (!_client) {
    _client = new TwitterApi({
      appKey: process.env.CONSUMER_KEY || '',
      appSecret: process.env.CONSUMER_SECRET || '',
    });
  }
  return _client;
};

const RequestClient = new Proxy({} as TwitterApi, {
  get(_target, prop, receiver) {
    const client = getRequestClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export default RequestClient;

