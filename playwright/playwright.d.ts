/**
 * playwright.d.ts — Playwright 浏览器自动化 Skill
 *
 * 通过环境变量配置（PLAYWRIGHT_MCP_* 系列），自动初始化 Playwright 浏览器实例。
 * 返回的 Browser / BrowserContext / Page 均为完整的 Playwright 原生对象，
 * 允许使用任何 Playwright 方法，包括但不限于：导航、点击、填写表单、截图、PDF 生成、
 * 网络拦截、文件上传下载、多标签页操作、iframe 处理、设备模拟等。
 *
 *
 * 如果执行出错，请自行参考完整的 Playwright API 文档: https://playwright.dev/docs/api/class-page
 */

declare const playwright: {
    /**
     * 获取已配置的 Browser 实例。
     * 首次调用时会自动根据环境变量启动浏览器。
     *
     * @example
     * const browser = await playwright.getBrowser();
     * const contexts = browser.contexts();
     */
    getBrowser(): Promise<import("playwright").Browser>;

    /**
     * 获取已配置的 BrowserContext 实例。
     * 自动应用 viewport、device 模拟、proxy、权限等环境变量配置。
     *
     * @example
     * const context = await playwright.getContext();
     * await context.addCookies([{ name: "token", value: "abc", url: "https://example.com" }]);
     */
    getContext(): Promise<import("playwright").BrowserContext>;

    /**
     * 获取可直接使用的 Page 实例。
     * 这是最常用的入口：获取一个页面后可以调用任何 Playwright Page 方法。
     *
     * @example 基础导航与截图
     * const page = await playwright.getPage();
     * await page.goto("https://example.com");
     * const title = await page.title();
     * const screenshot = await page.screenshot({ path: "screenshot.png" });
     *
     * @example 表单填写与提交
     * const page = await playwright.getPage();
     * await page.goto("https://example.com/login");
     * await page.fill("#username", "user");
     * await page.fill("#password", "pass");
     * await page.click("button[type=submit]");
     * await page.waitForURL("<star><star>/dashboard");
    *
     * @example 提取页面数据
    * const page = await playwright.getPage();
     * await page.goto("https://example.com/data");
     * const items = await page.$$eval(".item", els => els.map(el => ({
        *     title: el.querySelector("h2")?.textContent,
     * link: el.querySelector("a")?.href,
     * })));
     * console.log(items);
     */
    getPage(): Promise<import("playwright").Page>;

    /**
     * 在同一 Context 中创建新的 Page 标签页。
     *
     * @example
     * const page2 = await playwright.newPage();
     * await page2.goto("https://example.com/other");
     */
    newPage(): Promise<import("playwright").Page>;

    /**
     * 关闭浏览器并释放所有资源。
     *
     * @example
     * await playwright.close();
     */
    close(): Promise<void>;
};
