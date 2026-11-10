"use strict";
/**
 * sitemap.xml 產生器。
 *
 * priority 分層與 lastmod 格式取自 shennong prerender.mjs（buildSitemap）
 * 與 Axis app/sitemap.ts 的慣例。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSitemap = generateSitemap;
const utils_js_1 = require("./utils.js");
/**
 * 將單一 entry 格式化為 `<url>` 區塊（兩格縮排，欄位全時含 lastmod/changefreq/priority）。
 *
 * @param entry sitemap 項目
 * @param base 網站根網址
 * @returns `<url>…</url>` XML 區塊字串
 */
function formatEntry(entry, base) {
    const lastmod = entry.lastmod instanceof Date ? entry.lastmod.toISOString().slice(0, 10) : entry.lastmod;
    const fields = [`    <loc>${(0, utils_js_1.escapeXml)((0, utils_js_1.joinUrl)(base, entry.path))}</loc>`];
    if (lastmod)
        fields.push(`    <lastmod>${(0, utils_js_1.escapeXml)(lastmod)}</lastmod>`);
    if (entry.changefreq)
        fields.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    if (entry.priority !== undefined) {
        fields.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }
    return `  <url>\n${fields.join('\n')}\n  </url>`;
}
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
function generateSitemap(config, entries) {
    const urls = entries.map((entry) => formatEntry(entry, config.siteUrl)).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
