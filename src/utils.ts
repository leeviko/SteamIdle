import type { Page, Protocol } from 'puppeteer';

type Cookie = Protocol.Network.Cookie;

export function parseJwt(token: Cookie | undefined) {
  if (!token) return;

  return JSON.parse(
    Buffer.from(token.value.split('.')[1], 'base64').toString()
  );
}
