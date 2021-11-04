# What's puppeteer

Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/). Puppeteer runs [headless](https://developers.google.com/web/updates/2017/04/headless-chrome) by default, but can be configured to run full (non-headless) Chrome or Chromium.

### What can I do?

Most things that you can do manually in the browser can be done using Puppeteer! Here are a few examples to get you started:

- Generate screenshots and PDFs of pages.
- Crawl a SPA (Single-Page Application) and generate pre-rendered content (i.e. "SSR" (Server-Side Rendering)).
- Automate form submission, UI testing, keyboard input, etc.
- Create an up-to-date, automated testing environment. Run your tests directly in the latest version of Chrome using the latest JavaScript and browser features.
- Capture a [timeline trace](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/) of your site to help diagnose performance issues.
- Test Chrome Extensions.

# Getting Started

## Installation

```shell
npm i puppeteer
```

or

```shell
yarn add puppeteer
```

> When you install Puppeteer, it downloads a recent version of Chromium (~170MB Mac, ~282MB Linux, ~280MB Win) that is guaranteed to work with the API. To skip the download, download into another path, or download a different browser, see [Environment variables](https://github.com/puppeteer/puppeteer/blob/v10.4.0/docs/api.md#environment-variables).

## puppeteer-core

`puppeteer-core` is a version of Puppeteer that doesn't download any browser by default.

```shell
npm i puppeteer-core
```

or

```shell
yarn add puppeteer-core
```

`puppeteer-core` is intended to be a lightweight version of Puppeteer for launching an existing browser installation or for connecting to a remote one. Be sure that the version of puppeteer-core you install is compatible with the browser you intend to connect to.

See [puppeteer vs puppeteer-core](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteer-vs-puppeteer-core).

## Usage

**Example 1** - navigating to https://example.com and saving a screenshot as example.png:

Save file as **screenshot.js**

```js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
```

Execute script on the command line

```shell
node example.js
```

Puppeteer sets an initial page size to 800×600px, which defines the screenshot size. The page size can be customized with [Page.setViewport()](https://github.com/puppeteer/puppeteer/blob/v10.4.0/docs/api.md#pagesetviewportviewport), for example:

```js
page.setViewport({
  width: 1600,
  height: 1080,
  deviceScaleFactor: 2,
});
```

**Example 2** - create a PDF.

Save file as **pdf.js**

```js
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
```

Execute script on the command line

```shell
node hn.js
```

See [Page.pdf()](https://github.com/puppeteer/puppeteer/blob/v10.4.0/docs/api.md#pagepdfoptions) for more information about creating pdfs.

**Example 3** - evaluate script in the context of the page

Save file as **get-dimensions.js**

```js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });

  console.log("Dimensions:", dimensions);

  await browser.close();
})();
```

Execute script on the command line

```shell
node get-dimensions.js
```

See [Page.evaluate()](https://github.com/puppeteer/puppeteer/blob/v10.4.0/docs/api.md#pageevaluatepagefunction-args) for more information on `evaluate` and related methods like `evaluateOnNewDocument` and `exposeFunction`.

# Default runtime settings

### 1. Uses Headless mode

Puppeteer launches Chromium in [headless](https://developers.google.com/web/updates/2017/04/headless-chrome) mode. To launch a full version of Chromium, set the [headless option](https://github.com/puppeteer/puppeteer/blob/v11.0.0/docs/api.md#puppeteerlaunchoptions) when launching a browser:

```js
const browser = await puppeteer.launch({ headless: false }); // default is true
```

### 2. Runs a bundled version of Chromium

By default, Puppeteer downloads and uses a specific version of Chromium so its API is guaranteed to work out of the box. To use Puppeteer with a different version of Chrome or Chromium, pass in the executable's path when creating a Browser instance:

```js
const browser = await puppeteer.launch({
  executablePath:
    "C:\\Users\\bruce_zhang\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
});
```

You can also use Puppeteer with Firefox Nightly (experimental support). See [Puppeteer.launch()](https://github.com/puppeteer/puppeteer/blob/v11.0.0/docs/api.md#puppeteerlaunchoptions) for more information.

### 3. Creates a fresh user profile

Puppeteer creates its own browser user profile which it cleans up on every run.

# Debugging tips

1. Turn off headless mode - sometimes it's useful to see what the browser is displaying. Instead of launching in headless mode, launch a full version of the browser using `headless: false`:

```js
const browser = await puppeteer.launch({ headless: false });
```

2. Slow it down - the `slowMo` option slows down Puppeteer operations by the specified amount of milliseconds. It's another way to help see what's going on.

```js
const browser = await puppeteer.launch({
  headless: false,
  slowMo: 250, // slow down by 250ms
});
```

3. Capture console output - You can listen for the `console` event. This is also handy when debugging code in `page.evaluate()`:

```js
page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

await page.evaluate(() => console.log(`url is ${location.href}`));
```

4. Use debugger in application code browser

There are two execution context: node.js that is running test code, and the browser running application code being tested. This lets you debug code in the application code browser; ie code inside `evaluate()`.

- Use `{devtools: true}` when launching Puppeteer:

```js
const browser = await puppeteer.launch({ devtools: true });
```

- Add an evaluate statement with `debugger` inside / add `debugger` to an existing evaluate statement:

```js
await page.evaluate(() => {
  debugger;
});
```

The test will now stop executing in the above evaluate statement, and chromium will stop in debug mode.

5. Enable verbose logging - internal DevTools protocol traffic will be logged via the [debug](https://github.com/visionmedia/debug) module under the `puppeteer` namespace.

**Basic verbose logging**

```shell
env DEBUG=puppeteer:* node ./examples/screenshot.js
```

For windows, use [cross-env](https://www.npmjs.com/package/cross-env)

```shell
npx cross-env DEBUG=puppeteer:* node ./examples/screenshot.js
```

**Protocol traffic can be rather noisy. This example filters out all Network domain messages**

```shell
env DEBUG=puppeteer:\* env DEBUG_COLORS=true node ./examples/screenshot.js 2>&1 | grep -v '"Network'
```

6. Debug your Puppeteer (node) code easily, using [ndb](https://github.com/GoogleChromeLabs/ndb)

- `yarn global add ndb` or `yarn add -D ndb`

- add a `debugger` to your Puppeteer (node) code

- use `ndb` instead of the `node` command

  ```shell
  ndb server.js

  # Alternatively, you can prepend `ndb`
  ndb node server.js
  ```

- Prepend `ndb` in front of any other binary

  ```shell
  # If you use some other binary, just prepend `ndb`
  ## npm run unit
  ndb npm run unit

  # Debug any globally installed package
  ## mocha
  ndb mocha

  # To use a local binary, use `npx` and prepend before it
  ndb npx mocha
  ```

# Resources

1. [API documentation](https://github.com/puppeteer/puppeteer/blob/v11.0.0/docs/api.md)
1. [Examples](https://github.com/puppeteer/puppeteer/tree/main/examples/)
1. [Github - Awesome Puppeteer](https://github.com/transitive-bullshit/awesome-puppeteer)
1. [Troubleshooting](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md)
