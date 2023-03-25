import dotenv from 'dotenv';
dotenv.config();

import { createCookies, isAuth } from './auth';

async function Init() {
  if (await isAuth('username')) {
    console.log('Logged in');
  } else {
    console.log('Not logged in');
    createCookies();
  }
}

Init();
