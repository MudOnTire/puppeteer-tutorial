const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto("https://github.com/puppeteer/puppeteer", {
    waitUntil: "networkidle2",
  });
  await page.pdf({
    path: "puppeteer.pdf",
    format: "a2",
  });

  await browser.close();
})();