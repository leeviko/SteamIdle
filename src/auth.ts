import puppeteer, { Page } from 'puppeteer';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Settings } from './settings';

// Check if user is logged into Steam
export async function isAuth(page: Page) {
  await page.goto('https://www.steamcommunity.com/');

  let steamid;
  let steamLoginSecure;
  let sessionid;
  const cookies = await page.cookies();
  try {
    steamLoginSecure = cookies.find(
      (cookie) => cookie.name === 'steamLoginSecure'
    );
    sessionid = cookies.find((cookie) => cookie.name === 'sessionid');

    if (!steamLoginSecure || !sessionid) return false;

    steamid = steamLoginSecure.value.substring(0, 17);
  } catch (err) {
    console.log('Error: Invalid steamLoginSecure');
    console.log('--- ', err);
    return false;
  }

  const editBtnExists = await page.$('span.notification_count');

  if (!!editBtnExists) {
    Settings.Auth = {
      steamLoginSecure: steamLoginSecure.value,
      sessionid: sessionid.value,
      steamid,
    };
  }

  return !!editBtnExists;
}

// Create cookies
export async function createCookies() {
  const rl = readline.createInterface({ input, output, terminal: false });

  const steamLoginSecure = await rl.question('-> steamLoginSecure: ');
  const sessionid = await rl.question('-> sessionid: ');

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

  if (!(await isAuth(page))) {
    console.log('- Invalid credentials');
  }
}
