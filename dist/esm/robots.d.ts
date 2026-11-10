/**
 * robots.txt 產生器（含 AI 爬蟲政策區塊）。
 *
 * AI 爬蟲清單（9 個 bot）取自三個專案一致的清單：
 * GPTBot / ChatGPT-User / OAI-SearchBot / ClaudeBot / Claude-Web /
 * anthropic-ai / PerplexityBot / Google-Extended / CCBot。
 */
import type { AICrawlerPolicy, SiteConfig } from './types.js';
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
export declare function generateRobots(config: SiteConfig, policy?: AICrawlerPolicy, sitemapPath?: string): string;
