import { TwitterApi } from "twitter-api-v2";
import Config from "@/config";

const RequestClient = new TwitterApi({
  appKey: Config.ConsumerToken,
  appSecret: Config.ConsumerSecret
});

export default RequestClient;