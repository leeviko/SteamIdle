import puppeteer from 'puppeteer';
import { Settings } from './settings';

type Badge = {
  gameTitle: string;
  gameID: string;
  dropsRemaining: string;
};

export let Badges: Badge[] = [];

export async function getBadges() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const steamid = Settings.Auth.steamid;

  await page.setCookie(...Settings.Cookies);
  await page.goto(`https://www.steamcommunity.com/profiles/${steamid}/badges`);

  const badgeEls = await page.$$('.badge_row.is_link');
  const badgesWithDrops = [];
  for (const badge in badgeEls) {
    try {
      const dropsRemaining = await badgeEls[badge].$eval(
        '.progress_info_bold',
        (el) => el.innerHTML.replace(/\D/g, '')
      );
      if (!dropsRemaining) continue;

      const gameTitle = await badgeEls[badge].$eval('.badge_title', (el) =>
        el.firstChild.nodeValue.trim()
      );

      const gameIDNode = await badgeEls[badge].$eval(
        '.badge_row_overlay',
        (el) => el.getAttribute('href')
      );

      const getGameID = /(?:gamecards\/)([0-9]+)/.exec(gameIDNode);
      if (!getGameID) continue;

      const gameID = getGameID[1];

      const newBadgeObj = {
        gameTitle,
        gameID,
        dropsRemaining,
      };
      badgesWithDrops.push(newBadgeObj);
    } catch (err) {
      // console.log('LOG: no drops remaining');
    }
  }
  Badges = badgesWithDrops;
  console.log(badgesWithDrops);
  browser.close();
}
