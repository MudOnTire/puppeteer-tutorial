const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.trendmicro.com/", {
    waitUntil: "networkidle2",
  });
  await page.waitForSelector("main.container-fluid");
  await page.pdf({
    path: "trendmicro.pdf",
    format: "a2",
  });

  await browser.close();
})();