import { chromium, firefox, webkit, devices, type Browser, type BrowserContext, type Page } from "playwright";

// ─── Environment Configuration ───────────────────────────────────────────────
// All options mirror the Playwright MCP server's environment variables.

const env = (key: string) => process.env[`PLAYWRIGHT_MCP_${key}`];
const envBool = (key: string) => {
    const v = env(key);
    return v === "true" || v === "1";
};
const envInt = (key: string) => {
    const v = env(key);
    return v ? parseInt(v, 10) : undefined;
};

// Browser selection
const browserType = (env("BROWSER") ?? "chromium") as "chrome" | "firefox" | "webkit" | "msedge" | "chromium";

// Browser launch options
const headless = envBool("HEADLESS") || false;
const executablePath = env("EXECUTABLE_PATH");
const noSandbox = envBool("NO_SANDBOX");
const sandbox = envBool("SANDBOX");
const userDataDir = env("USER_DATA_DIR");
const proxyServer = env("PROXY_SERVER");
const proxyBypass = env("PROXY_BYPASS");

// Context options
const deviceName = env("DEVICE");
const viewportSize = env("VIEWPORT_SIZE");
const userAgent = env("USER_AGENT");
const ignoreHttpsErrors = envBool("IGNORE_HTTPS_ERRORS");
const storageState = env("STORAGE_STATE");
const testIdAttribute = env("TEST_ID_ATTRIBUTE");
const isolated = envBool("ISOLATED");

// Timeouts
const timeoutAction = envInt("TIMEOUT_ACTION") ?? 5000;
const timeoutNavigation = envInt("TIMEOUT_NAVIGATION") ?? 60000;

// CDP connection
const cdpEndpoint = env("CDP_ENDPOINT");
const cdpTimeout = envInt("CDP_TIMEOUT") ?? 30000;
const cdpHeaders: Record<string, string> = {};
if (env("CDP_HEADER")) {
    // Format: "key=value,key2=value2" or multiple env entries
    for (const h of env("CDP_HEADER")!.split(",")) {
        const idx = h.indexOf("=");
        if (idx > 0) cdpHeaders[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
    }
}

// Permissions
const grantPermissions = env("GRANT_PERMISSIONS")?.split(",").map(s => s.trim()).filter(Boolean);

// Network filtering
const allowedOrigins = env("ALLOWED_ORIGINS")?.split(";").filter(Boolean);
const blockedOrigins = env("BLOCKED_ORIGINS")?.split(";").filter(Boolean);
const blockServiceWorkers = envBool("BLOCK_SERVICE_WORKERS");

// Init scripts
const initScripts = env("INIT_SCRIPT")?.split(",").map(s => s.trim()).filter(Boolean);

// ─── Browser Launch ──────────────────────────────────────────────────────────

function selectEngine() {
    switch (browserType) {
        case "firefox": return firefox;
        case "webkit": return webkit;
        case "chrome":
        case "msedge":
        case "chromium":
        default: return chromium;
    }
}

function buildLaunchArgs(): string[] {
    const args: string[] = [];
    if (noSandbox) args.push("--no-sandbox");
    if (sandbox) args.push("--enable-sandbox");
    return args;
}

function parseViewport() {
    if (!viewportSize) return undefined;
    const [w, h] = viewportSize.split("x").map(Number);
    if (w && h) return { width: w, height: h };
    return undefined;
}

let _browser: Browser | undefined;
let _context: BrowserContext | undefined;
let _page: Page | undefined;

async function getBrowser(): Promise<Browser> {
    if (_browser?.isConnected()) return _browser;

    const engine = selectEngine();

    if (cdpEndpoint) {
        _browser = await engine.connectOverCDP(cdpEndpoint, {
            timeout: cdpTimeout,
            headers: Object.keys(cdpHeaders).length ? cdpHeaders : undefined,
        });
        return _browser;
    }

    const channel = (browserType === "chrome" || browserType === "msedge") ? browserType : undefined;

    if (userDataDir) {
        // launchPersistentContext returns a context, handle differently
        const ctx = await engine.launchPersistentContext(userDataDir, {
            headless,
            executablePath: executablePath || undefined,
            args: buildLaunchArgs(),
            channel,
            viewport: parseViewport(),
            userAgent: userAgent || undefined,
            ignoreHTTPSErrors: ignoreHttpsErrors,
            permissions: grantPermissions,
            serviceWorkers: blockServiceWorkers ? "block" : undefined,
        });
        _context = ctx;
        _browser = ctx.browser()!;
        return _browser;
    }

    _browser = await engine.launch({
        headless,
        executablePath: executablePath || undefined,
        args: buildLaunchArgs(),
        channel,
    });

    return _browser;
}

async function getContext(): Promise<BrowserContext> {
    if (_context) return _context;

    const browser = await getBrowser();
    if (_context) return _context; // may have been set by launchPersistentContext

    const device = deviceName ? devices[deviceName] : undefined;

    _context = await browser.newContext({
        ...device,
        viewport: parseViewport() ?? device?.viewport,
        userAgent: userAgent || device?.userAgent,
        ignoreHTTPSErrors: ignoreHttpsErrors,
        storageState: storageState || undefined,
        permissions: grantPermissions,
        serviceWorkers: blockServiceWorkers ? "block" : undefined,
    });

    _context.setDefaultTimeout(timeoutAction);
    _context.setDefaultNavigationTimeout(timeoutNavigation);

    if (testIdAttribute) {
        // Playwright uses selectors.setTestIdAttribute which is a global setting
        const { selectors } = await import("playwright");
        selectors.setTestIdAttribute(testIdAttribute);
    }

    if (initScripts) {
        for (const script of initScripts) {
            await _context.addInitScript({ path: script });
        }
    }

    return _context;
}

async function getPage(): Promise<Page> {
    if (_page && !_page.isClosed()) return _page;
    const context = await getContext();
    _page = context.pages()[0] ?? await context.newPage();
    return _page;
}

// ─── Exported API ────────────────────────────────────────────────────────────
// We export factory functions so the agent can get a ready-to-use browser,
// context, and page. The agent has full access to all Playwright methods.

export default {
    /** 获取当前 Browser 实例（自动根据环境变量配置启动） */
    getBrowser,
    /** 获取当前 BrowserContext 实例（自动配置 viewport、device、proxy 等） */
    getContext,
    /** 获取当前 Page 实例（如果没有则自动创建） */
    getPage,

    /**
     * 快速创建一个新的 Page（在同一个 Context 中）。
     * 适合需要多标签页操作时使用。
     */
    newPage: async (): Promise<Page> => {
        const context = await getContext();
        return context.newPage();
    },

    /**
     * 关闭浏览器并释放所有资源。
     */
    close: async () => {
        if (_browser?.isConnected()) {
            await _browser.close();
        }
        _browser = undefined;
        _context = undefined;
        _page = undefined;
    },
};
