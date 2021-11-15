# Puppeteer 是什么

Puppeteer 是一个 Node library，提供了一套通过 [DevTools 协议](https://chromedevtools.github.io/devtools-protocol/)操纵 Chrome 或 Chromium 的 API。Puppeteer 默认以 [无头（headless）](https://developers.google.com/web/updates/2017/04/headless-chrome) 的方式运行, 也可以配置用 GUI 的方式运行 Chrome 和 Chromium。

熟悉爬虫或者 UI 自动化的同学可能会联想到 [PhantomJS](https://phantomjs.org/)、[CasperJS](https://www.casperjs.org/) 或者 [Selenium](https://www.selenium.dev/)，而作为 Chrome DevTools 团队亲自出品和维护的 puppeteer 不管是在功能的完整性、稳定性、兼容性还是性能都将是碾压其他工具的存在。

## Puppeteer 的作用

理论上我们在 Chrome 里能做的事情，通过 puppeteer 都能够做到。比如：

- 对页面和元素截图
- 把页面保存为 PDF
- 爬取 SPA（Single-Page Application）网站的内容并为 SSR（Server-Side Rendering）网站生成 pre-render 的内容
- UI 自动化测试、自动填充/提交表单、模拟 UI 输入）
- 测试最新的 Javascript 功能或 Chrome 功能
- 性能测试，生成 [timeline trace](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/) 用于定位网站性能问题
- 测试 Chrome 的插件

当然，puppeteer 也不是全能的，比如在跨浏览器兼容方面就有所欠缺，目前只对 Firefox 做了实验性的支持，所以要测试浏览器兼容性还是得选择 Selenium 之类的工具。

# 安装 Puppeteer

```shell
npm i puppeteer
```

或

```shell
yarn add puppeteer
```

> 安装 puppeteer 的过程中会下载最新版本的 Chromiun (~170MB Mac, ~282MB Linux, ~280MB Win)，以确保最新版的 puppeteer 和 Chromium 完全兼容. 我们也可以跳过 Chromium 的下载，或者下载其他版本的 Chromium 到特定路径，这些都可以通过环境变量进行配置，具体参考 [Environment variables](https://github.com/puppeteer/puppeteer/blob/v10.4.0/docs/api.md#environment-variables).

## puppeteer-core

`puppeteer-core` 是另外一个轻量版本，不会默认下载 Chromium，而且可以选择使用本地或远程安装的 Chrome。

```shell
npm i puppeteer-core
```

或

```shell
yarn add puppeteer-core
```

> 使用 `puppeteer-core` 需要确保它的版本和连接的 Chrome 版本可以兼容。

> `puppeteer-core` 会忽略所有的 PUPPETEER\_\* 环境变量

关于 puppeteer 和 puppeteer-core 的详细对比请参考：[puppeteer vs puppeteer-core](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteer-vs-puppeteer-core)。

# 用法举例

**示例 1** - 访问 https://example.com 并对网页截图

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

**Example 2** - Save web pages as PDF.

Save file as **savePDF.js**

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
node savePDF.js
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

### 1. Turn off headless mode - sometimes it's useful to see what the browser is displaying. Instead of launching in headless mode, launch a full version of the browser using `headless: false`:

```js
const browser = await puppeteer.launch({ headless: false });
```

### 2. Slow it down - the `slowMo` option slows down Puppeteer operations by the specified amount of milliseconds. It's another way to help see what's going on.

```js
const browser = await puppeteer.launch({
  headless: false,
  slowMo: 250, // slow down by 250ms
});
```

### 3. Capture console output - You can listen for the `console` event. This is also handy when debugging code in `page.evaluate()`:

```js
page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

await page.evaluate(() => console.log(`url is ${location.href}`));
```

### 4. Use debugger in application code browser

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

### 5. Enable verbose logging - internal DevTools protocol traffic will be logged via the [debug](https://github.com/visionmedia/debug) module under the `puppeteer` namespace.

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

### 6. Debug your Puppeteer (node) code easily, using [ndb](https://github.com/GoogleChromeLabs/ndb)

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

1. [Home page](https://pptr.dev/)
1. [API documentation](https://github.com/puppeteer/puppeteer/blob/v11.0.0/docs/api.md)
1. [Examples](https://github.com/puppeteer/puppeteer/tree/main/examples/)
1. [Github - Awesome Puppeteer](https://github.com/transitive-bullshit/awesome-puppeteer)
1. [Troubleshooting](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md)
