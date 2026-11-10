"use strict";
/**
 * HTML <meta> 標籤產生器（title / description / OG / Twitter / canonical）。
 *
 * 欄位集合取自 shennong / lecake index.html 的 <head> 慣例。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetaTags = generateMetaTags;
const utils_js_1 = require("./utils.js");
/**
 * 產出單頁 HTML head 的 meta 標籤字串（多行、無前後綴，直接插入 <head> 即可）。
 *
 * - title：page.title 有值 → `{title} | {siteName}`；無值 → `{siteName}`。
 * - description：page.description ?? config.description。
 * - canonical / og:url / twitter:url：siteUrl + page.path（default "/"）。
 * - og:image / twitter:image：page.image ?? config.logo（相對路徑自動補絕對 URL）；
 *   都沒有圖時 twitter:card 降為 summary、不輸出 image 標籤。
 * - 所有屬性值皆經 HTML 跳脫。
 *
 * @param config 網站設定
 * @param page 單頁資訊（選填，缺省回落 config）
 * @returns 多行 meta 標籤字串（\n 分隔）
 *
 * @example
 * ```ts
 * const head = generateMetaTags(config, { title: '商品', path: '/products' });
 * // <title>商品 | 台中國農宮</title> …
 * ```
 */
function generateMetaTags(config, page = {}) {
    const title = page.title ? `${page.title} | ${config.siteName}` : config.siteName;
    const description = page.description ?? config.description;
    const url = (0, utils_js_1.joinUrl)(config.siteUrl, page.path ?? '/');
    const image = (0, utils_js_1.absoluteUrl)(config.siteUrl, page.image ?? config.logo);
    const lines = [
        `<title>${(0, utils_js_1.escapeXml)(title)}</title>`,
        `<meta name="description" content="${(0, utils_js_1.escapeXml)(description)}" />`,
        '<meta name="robots" content="index, follow" />',
        `<link rel="canonical" href="${(0, utils_js_1.escapeXml)(url)}" />`,
    ];
    lines.push('<meta property="og:type" content="website" />', `<meta property="og:site_name" content="${(0, utils_js_1.escapeXml)(config.siteName)}" />`, `<meta property="og:locale" content="${(0, utils_js_1.escapeXml)(config.locale ?? 'zh_TW')}" />`, `<meta property="og:url" content="${(0, utils_js_1.escapeXml)(url)}" />`, `<meta property="og:title" content="${(0, utils_js_1.escapeXml)(title)}" />`, `<meta property="og:description" content="${(0, utils_js_1.escapeXml)(description)}" />`);
    if (image)
        lines.push(`<meta property="og:image" content="${(0, utils_js_1.escapeXml)(image)}" />`);
    lines.push(`<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`, `<meta name="twitter:url" content="${(0, utils_js_1.escapeXml)(url)}" />`, `<meta name="twitter:title" content="${(0, utils_js_1.escapeXml)(title)}" />`, `<meta name="twitter:description" content="${(0, utils_js_1.escapeXml)(description)}" />`);
    if (image)
        lines.push(`<meta name="twitter:image" content="${(0, utils_js_1.escapeXml)(image)}" />`);
    return lines.join('\n');
}
