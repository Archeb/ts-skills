import { Octokit } from "octokit";

const token = process.env.GITHUB_TOKEN;

if (!token) {
    console.warn("[github skill] GITHUB_TOKEN 未配置，只能访问公开数据。");
}

const octokit = new Octokit({ auth: token });

// 我们直接把完整的 rest API 集合暴露给大模型
// 但为了防止上下文爆炸，我们在对应的 github.d.ts 中只声明它常用的方法 (Progressive Disclosure)
export default octokit.rest;
