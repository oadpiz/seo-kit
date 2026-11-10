/**
 * sitemap.xml 產生器。
 *
 * priority 分層與 lastmod 格式取自 shennong prerender.mjs（buildSitemap）
 * 與 Axis app/sitemap.ts 的慣例。
 */
import type { SitemapEntry, SiteConfig } from './types.js';
/**
 * 產出 sitemap.xml 全文（0.9 protocol）。
 *
 * @param config 網站設定（siteUrl 為 URL 前綴）
 * @param entries 路徑清單（path 如 '/'、'/products'；lastmod/changefreq/priority 選填）
 * @returns sitemap XML 字串（可通過 xmllint 驗證）
 *
 * @example
 * ```ts
 * generateSitemap(config, [
 *   { path: '/', priority: 1.0, changefreq: 'daily' },
 *   { path: '/products', priority: 0.9, lastmod: new Date() },
 * ]);
 * ```
 */
export declare function generateSitemap(config: SiteConfig, entries: SitemapEntry[]): string;
