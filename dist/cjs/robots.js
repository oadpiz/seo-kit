"use strict";
/**
 * robots.txt 產生器（含 AI 爬蟲政策區塊）。
 *
 * AI 爬蟲清單（9 個 bot）取自三個專案一致的清單：
 * GPTBot / ChatGPT-User / OAI-SearchBot / ClaudeBot / Claude-Web /
 * anthropic-ai / PerplexityBot / Google-Extended / CCBot。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRobots = generateRobots;
const utils_js_1 = require("./utils.js");
/**
 * 產出 robots.txt：一般 `User-agent: *` 區塊 + AI 爬蟲區塊 + 自訂規則 + Sitemap 行。
 *
 * 政策邏輯（policy 預設 { allowAll: true }）：
 * - `User-agent: *` 永遠 `Allow: /`（一般搜尋引擎不受 AI 政策影響）；
 *   policy.customRules['*'] 的行會附在這個區塊（如 ["Disallow: /admin"]）。
 * - allowAll（default true）：9 個 AI 爬蟲明確 `Allow: /`。
 * - disallowTraining：訓練用爬蟲（CCBot / Google-Extended / Claude-Web / anthropic-ai）
 *   改為 `Disallow: /`。
 * - allowAll: false：全部 AI 爬蟲 `Disallow: /`。
 * - customRules 其他 key 各自成獨立區塊（key = User-agent）。
 *
 * @param config 網站設定
 * @param policy AI 爬蟲政策（選填）
 * @param sitemapPath sitemap 路徑（default "/sitemap.xml"；傳絕對 URL 會原樣使用）
 * @returns robots.txt 全文字串（尾端換行）
 *
 * @example
 * ```ts
 * generateRobots(config, { customRules: { '*': ['Disallow: /admin', 'Disallow: /checkout'] } });
 * ```
 */
function generateRobots(config, policy = {}, sitemapPath = '/sitemap.xml') {
    const allowAll = policy.allowAll !== false;
    const disallowTraining = policy.disallowTraining === true;
    const lines = [`# ${config.siteName} robots.txt`, ''];
    // 一般區塊：* 永遠 Allow（customRules['*'] 併入此處）
    lines.push('User-agent: *');
    lines.push('Allow: /');
    for (const rule of policy.customRules?.['*'] ?? [])
        lines.push(rule);
    lines.push('');
    // AI 爬蟲區塊
    if (allowAll) {
        const allowed = utils_js_1.AI_CRAWLERS.filter((bot) => !(disallowTraining && utils_js_1.TRAINING_CRAWLERS.includes(bot)));
        if (allowed.length > 0) {
            lines.push('# AI 檢索引擎爬蟲（AIEO）：明確允許讀取公開內容（含 /llms.txt）');
            for (const bot of allowed)
                lines.push(`User-agent: ${bot}`);
            lines.push('Allow: /', '');
        }
    }
    if (!allowAll || disallowTraining) {
        const blocked = allowAll ? utils_js_1.TRAINING_CRAWLERS : [...utils_js_1.AI_CRAWLERS];
        lines.push('# 拒絕模型訓練用爬蟲');
        for (const bot of blocked)
            lines.push(`User-agent: ${bot}`);
        lines.push('Disallow: /', '');
    }
    // 自訂 User-agent 區塊（'*' 已併入一般區塊，此處跳過）
    for (const [agent, rules] of Object.entries(policy.customRules ?? {})) {
        if (agent === '*')
            continue;
        lines.push(`User-agent: ${agent}`);
        for (const rule of rules)
            lines.push(rule);
        lines.push('');
    }
    lines.push(`Sitemap: ${(0, utils_js_1.absoluteUrl)(config.siteUrl, sitemapPath)}`);
    lines.push(`# llms.txt: ${(0, utils_js_1.absoluteUrl)(config.siteUrl, '/llms.txt')}`);
    return `${lines.join('\n')}\n`;
}
