import puppeteer from 'puppeteer';
import type { Page, Protocol } from 'puppeteer';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Settings } from './settings';
import creds from './config.json';

// Get and Save credentials
export async function getAndSaveCreds() {
  if (creds.steamLoginSecure && creds.sessionid) {
    const steamid = creds.steamLoginSecure.substring(0, 17);

    Settings.Auth = {
      steamLoginSecure: creds.steamLoginSecure,
      sessionid: creds.sessionid,
      steamid,
    };

    await isAuth();
    return;
  }

  const rl = readline.createInterface({ input, output, terminal: false });

  const steamLoginSecure = await rl.question('-> steamLoginSecure: ');
  const sessionid = await rl.question('-> sessionid: ');

  const steamid = steamLoginSecure.substring(0, 17);

  Settings.Auth = {
    steamLoginSecure,
    sessionid,
    steamid,
  };

  await isAuth();
}

export function clearAuth() {
  Settings.Auth = {
    steamLoginSecure: '',
    sessionid: '',
    steamid: '',
  };
}

// Check if user is logged into Steam
export async function isAuth() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const cookies = [
    {
      name: 'steamLoginSecure',
      value: Settings.Auth.steamLoginSecure,
      domain: 'steamcommunity.com',
    },
    {
      name: 'sessionid',
      value: Settings.Auth.sessionid,
      domain: 'steamcommunity.com',
    },
  ];
  await page.setCookie(...cookies);

  await page.goto('https://www.steamcommunity.com/');

  const editBtnExists = !!(await page.$('span.notification_count'));

  if (!editBtnExists) {
    clearAuth();
  }

  Settings.Cookies = await page.cookies();

  return editBtnExists;
}
