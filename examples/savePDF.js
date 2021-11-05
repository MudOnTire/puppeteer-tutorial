const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://github.com/puppeteer/puppeteer", {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "puppeteer.pdf",
    format: "a4",
  });

  await browser.close();
})();