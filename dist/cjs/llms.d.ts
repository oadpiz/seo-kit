/**
 * llms.txt 產生器（https://llmstxt.org 格式）。
 *
 * 格式取自 shennong scripts/prerender.mjs 的 buildLlmsTxt()（最完整版本）：
 * `# 站名` + `> 一句話定位` + `## 服務與商品`（含價格、依 category 分 ### 子區塊）
 * + `## 資訊`（about / 地址 / 電話 / email / hours / areas）
 * + `## 備註` + `## 連結`。
 */
import type { LlmsTxtOptions, ProductFeed, SiteConfig } from './types.js';
/**
 * 產出 llms.txt 全文（AIEO：讓 AI 引擎讀到站點事實——賣什麼、多少錢、怎麼聯絡）。
 *
 * @param config 網站設定
 * @param feed 商品／服務清單（選填；無項目時不輸出商品區塊）
 * @param options 選填區塊（about / hours / areas / notes / links）與描述長度控制
 * @returns llms.txt 全文字串（尾端換行）
 *
 * @example
 * ```ts
 * generateLlmsTxt(config, { items: [{ name: '平安斗首', price: 3600, description: '…' }] });
 * ```
 */
export declare function generateLlmsTxt(config: SiteConfig, feed?: ProductFeed, options?: LlmsTxtOptions): string;
