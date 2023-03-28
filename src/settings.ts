import type { Protocol } from 'puppeteer';

export type TSettings = {
  Auth: {
    steamLoginSecure: string;
    sessionid: string;
    steamid: string;
  };
  Cookies: Protocol.Network.Cookie[];
};

export const Settings: TSettings = {
  Auth: {
    steamLoginSecure: '',
    sessionid: '',
    steamid: '',
  },
  Cookies: [],
};
