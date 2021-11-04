const puppeteer = require("puppeteer");
const path = require("path");
const { delay } = require("../utils");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
    width: 1680,
    height: 1080,
    deviceScaleFactor: 2
  });
  await page.goto("https://www.trendmicro.com/", {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector("main.container-fluid");
  await delay(1000);
  await page.pdf({
    printBackground: true,
    path: path.resolve(__dirname, "trendmicro.pdf"),
    format: "a2",
    margin: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    }
  });

  await browser.close();
})();