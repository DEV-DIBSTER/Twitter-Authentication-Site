// Twitter Authentication Configurations:

import ConfigJSON from '../../config.json';

interface Config {
  Secure: boolean;
  SiteURL: string;
  Port: number;
  ConsumerToken: string;
  ConsumerSecret: string;
  SessionSecret: string;
}

const Config: Config = ConfigJSON;

export default Config;