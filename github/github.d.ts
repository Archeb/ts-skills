/**
 * github.d.ts — GitHub NPM SDK Skill (Progressive Disclosure)
 * 
 * 这是一个极佳的通过 NPM 构建外挂能力的示例。
 * 底层直接导出了 `octokit.rest` 的完整能力。但为了防止一次性把几十 MB 的 
 * 全部 GitHub API 文档塞入大模型上下文导致崩溃，这里我们仅声明它最常用的子模块和方法。
 * 这就是 "Progressive Disclosure"（渐进式披露）的核心思想：
 * 运行时拥有全部能力，但认知域（Prompt）里只映射关键能力。
 */

declare const github: {
    /** 问题(Issue)管理子模块 */
    issues: {
        /**
         * 获取某个仓库的问题列表
         * @example
         * const res = await github.issues.listForRepo({ owner: "microsoft", repo: "vscode", state: "open", per_page: 5 });
         * console.log(res.data[0].title);
         */
        listForRepo(params: {
            owner: string;
            repo: string;
            state?: "open" | "closed" | "all";
            per_page?: number;
            page?: number;
        }): Promise<{ data: Array<{ number: number; title: string; state: string; user: { login: string } }> }>;

        /**
         * 创建一个新的 Issue (需要 GITHUB_TOKEN 具有写入权限)
         * @example
         * await github.issues.create({ owner: "my-org", repo: "my-repo", title: "Bug", body: "Details..." });
         */
        create(params: {
            owner: string;
            repo: string;
            title: string;
            body?: string;
            assignees?: string[];
            labels?: string[];
        }): Promise<{ data: { number: number; html_url: string } }>;
    };

    /** 仓库(Repository)管理子模块 */
    repos: {
        /**
         * 获取某个仓库的详细信息
         * @example
         * const res = await github.repos.get({ owner: "facebook", repo: "react" });
         * console.log(res.data.stargazers_count);
         */
        get(params: {
            owner: string;
            repo: string;
        }): Promise<{ data: { name: string; full_name: string; stargazers_count: number; description: string; html_url: string } }>;
        
        /**
         * 获取某个仓库的内容 (文件或目录)
         * 如果是文件，通常内容会被 base64 编码，需要自行解码。
         * @example
         * const res = await github.repos.getContent({ owner: "facebook", repo: "react", path: "README.md" });
         */
        getContent(params: {
            owner: string;
            repo: string;
            path: string;
            ref?: string;
        }): Promise<{ data: any }>;
    };

    /** 搜索(Search)子模块 */
    search: {
        /**
         * 搜索代码
         * @example
         * const res = await github.search.code({ q: "addClass in:file language:js repo:jquery/jquery" });
         */
        code(params: {
            q: string;
            sort?: string;
            order?: "asc" | "desc";
            per_page?: number;
            page?: number;
        }): Promise<{ data: { total_count: number; incomplete_results: boolean; items: any[] } }>;
    };
};
