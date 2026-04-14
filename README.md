# TS Skills

> **Vision: "Make the entire npm your skill library through progressive disclosure and JSDoc."**

This is the central repository for **TS Skills** — dynamic, pure worker modules designed to extend the capabilities of the AI Agent. 

Thanks to our Two-Pass Code Generation Architecture, you don't need complicated LLM tool declarations or heavy JSON Schemas. You just write normal TypeScript JSDoc, and the system dynamically feeds your documentation to the LLM exactly when it intends to use your skill.

## How It Works

1. **Write standard Node.js code:** Use the thousands of SDKs on `npm`.
2. **Export your Agent-facing API:** Define exactly what the agent is allowed to do.
3. **Write JSDoc `d.ts`:** Provide a comprehensive `@example` and description in a `.d.ts` file to teach the LLM how to use it.
4. **Zero-Config Hot Load:** The agent reads the documentation at runtime and automatically executes your skills inside the Sandbox environment.

---

## Directory Structure

Every TS Skill must have its own directory containing at least two files:
- `index.ts`: The runtime implementation (must default export your API object or named export your module name).
- `<skill_name>.d.ts`: The JSDoc declarations for the AI Agent.

```text
workspace/skills/
├── github/                 # A pure REST API skill example
├── tavily/                 # An npm-dependent SDK wrapper example
├── tracemoe/               # Anime screenshot search
├── weather/                # Global weather checking (No API Key)
├── qrcode/                 # QR code generator
├── saucenao/               # Anime illustrator sourcing
├── finance/                # Real-time stock & crypto tracker
├── playwright/             # Browser automation with Playwright
└── package.json            # Contains your node_modules
```

## Contributing and Adding Skills

1. Fork or clone this repository directly into `workspace/skills/`.
2. Do `npm install` to add any third-party SDKs required by your skill.
3. Write your `index.ts` and `d.ts`.

Your skill is now permanently integrated!

---
## Available Built-In Skills

### 🔍 Tavily Search
Agent interface for Tavily's AI-optimized search API. Perfect for web grounding.

### 🐙 GitHub
Direct REST API access for the agent to manage issues, read commits, and analyze repos.

### 📺 Trace.moe (以图搜图 - 番剧)
Given a screenshot from an anime, returns the anime name, episode, and exact timestamp. Completely free.

### 🌤️ Weather (天气查询)
Fetches real-time weather and forecast for any global city. Powered by `weather-js`. Completely free.

### 📱 QRCode (二维码生成)
Converts any given text or URL to a base64 QRCode image pure-programmatically.

### 🎨 SauceNAO (插画师溯源)
Reverse-image searches anime art against Pixiv, Twitter, and Booru to find original illustrators. Requires an API key.

### 📈 Finance (实时金融行情)
Queries real-time stock, crypto, and currency prices using the official Yahoo Finance engine. Completely free, no API key required.

### 🎭 Playwright (浏览器自动化)
Full Playwright browser automation — navigate, interact, scrape, screenshot, generate PDFs, and more. Supports Chromium, Firefox, and WebKit. Configurable via `PLAYWRIGHT_MCP_*` environment variables. No API key required.

---

## 🔧 环境变量与配置需要 (Environment Variables)

Most skills in this demonstration pack work entirely offline or do not require an API key, allowing any user who forks / clones the project to instantly enjoy a fully-armed agent.

- **No API Key Required**: `tracemoe`, `weather`, `qrcode`, `finance`
- **API Key Required**:
  - **SauceNAO** (`SAUCENAO_API_KEY`): 
    Register for a free account at [SauceNAO](https://saucenao.com/user.php?page=search-api). The free tier grants 200 high-accuracy searches per day, perfect for private scenarios. If not provided, this engine will be disabled.
  - **GitHub** (`GITHUB_TOKEN`): Optional, but highly recommended to bypass public rate limits.
  - **Tavily** (`TAVILY_API_KEY`): Required for general web search abilities.
