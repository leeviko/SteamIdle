import dotenv from 'dotenv';
dotenv.config();

import { getAndSaveCreds } from './auth';
import { getBadges } from './badges';
import { Settings } from './settings';

async function Init() {
  if (!Settings.Auth.steamLoginSecure) {
    console.log('- Login into Steam');
    await getAndSaveCreds();
  }

  await getBadges();
}

try {
  Init();
} catch (err) {
  console.log('- Error on Init function');
  console.log('--- ', err);
}
