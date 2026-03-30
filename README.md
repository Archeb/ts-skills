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
│   ├── index.ts
│   └── github.d.ts
├── tavily/                 # An npm-dependent SDK wrapper example
│   ├── index.ts
│   └── tavily.d.ts
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
