import dotenv from 'dotenv';
dotenv.config();

import { createCookies } from './auth';
import { Settings } from './settings';

async function Init() {
  if (!Settings.Auth.steamLoginSecure) {
    console.log('- Login into Steam');
    await createCookies();
  }
}

try {
  Init();
} catch (err) {
  console.log('- Error on Init function');
  console.log('--- ', err);
}
