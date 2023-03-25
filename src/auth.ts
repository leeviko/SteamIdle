import puppeteer, { Page } from 'puppeteer';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Check if user is logged into Steam
export async function isAuth(profileId: string, existingPage?: Page) {
  let page;
  if (!existingPage) {
    const browser = await puppeteer.launch();
    page = await browser.newPage();
  } else {
    page = existingPage;
  }
  await page.goto(`https://www.steamcommunity.com/${profileId}`);

  const editBtnExists = await page.$('span.notification_count');
  return !!editBtnExists;
}

// Create cookies
export async function createCookies() {
  const rl = readline.createInterface({ input, output });

  const steamLoginSecure = await rl.question('>steamLoginSecure: ');
  const sessionid = await rl.question('>sessionid: ');

  const cookies = [
    {
      name: 'steamLoginSecure',
      value: steamLoginSecure,
      domain: 'steamcommunity.com',
    },
    {
      name: 'sessionid',
      value: sessionid,
      domain: 'steamcommunity.com',
    },
  ];
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setCookie(...cookies);

  console.log('Authenticated: ', await isAuth('username', page));

  return cookies;
}
