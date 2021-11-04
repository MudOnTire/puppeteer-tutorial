const puppeteer = require('puppeteer');
const { delay } = require('../utils');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(puppeteer.devices['iPhone 11 Pro Max']);
  await page.goto('https://github.com/puppeteer/puppeteer', {
    waitUntil: 'networkidle0'
  });
  await page.screenshot({ path: 'full.png', fullPage: true });
  await browser.close();
})();