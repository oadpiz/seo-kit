/**
 * 共用工具函式（純字串處理，零依賴）。
 */
/** 主要 AI 檢索引擎爬蟲清單（GPT / Claude / Perplexity / Gemini / Common Crawl），三專案一致。 */
export const AI_CRAWLERS = [
    'GPTBot', // OpenAI 模型訓練
    'ChatGPT-User', // ChatGPT 即時瀏覽
    'OAI-SearchBot', // ChatGPT Search
    'ClaudeBot', // Anthropic 模型訓練
    'Claude-Web', // Claude 即時瀏覽
    'anthropic-ai', // Anthropic 舊名爬蟲
    'PerplexityBot', // Perplexity
    'Google-Extended', // Gemini 訓練（獨立於 Googlebot 的開關）
    'CCBot', // Common Crawl（多數 AI 搜尋的語料來源）
];
/** 「模型訓練用」爬蟲：policy.disallowTraining = true 時對這幾個設 Disallow: /。 */
export const TRAINING_CRAWLERS = [
    'CCBot',
    'Google-Extended',
    'Claude-Web',
    'anthropic-ai',
];
/**
 * 去除網址結尾斜線（https://example.com/ → https://example.com）。
 *
 * @param url 原始網址
 * @returns 結尾無斜線的網址
 */
export function normalizeBaseUrl(url) {
    return url.replace(/\/+$/, '');
}
/**
 * 以 siteUrl 為基底組出絕對 URL（'/' 或空路徑 → 根目錄含尾斜線）。
 *
 * @param base 網站根網址
 * @param path 路徑（'/products'、'products'、'/' 皆可）
 * @returns 絕對 URL，如 https://example.com/products
 */
export function joinUrl(base, path = '/') {
    const b = normalizeBaseUrl(base);
    if (!path || path === '/')
        return `${b}/`;
    return `${b}${path.startsWith('/') ? path : `/${path}`}`;
}
/**
 * 轉絕對 URL：value 已是 http(s) 絕對網址則原樣回傳，否則接在 base 之後。
 *
 * @param base 網站根網址
 * @param value 相對路徑（/logo.png）或絕對 URL
 * @returns 絕對 URL；value 為 undefined 時回傳 undefined
 */
export function absoluteUrl(base, value) {
    if (value === undefined)
        return undefined;
    if (/^https?:\/\//i.test(value))
        return value;
    return joinUrl(base, value);
}
/** XML / HTML attribute 跳脫字元表。 */
const ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
};
/**
 * XML / HTML attribute 跳脫（& < > " ' 五個字元）。
 * sitemap 的 loc、meta 的 content 屬性都用這個。
 *
 * @param s 原始字串
 * @returns 跳脫後的安全字串
 */
export function escapeXml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ESCAPES[ch] ?? ch);
}
/** 常用幣別符號（未列出的幣別以「{ISO代碼} 金額」呈現）。 */
const CURRENCY_SYMBOLS = {
    TWD: 'NT$',
    USD: 'US$',
    HKD: 'HK$',
    JPY: '¥',
    CNY: 'RMB¥',
};
/**
 * 價格格式化：TWD → NT$12,000（千分位），其他幣別 → "{符號}12,000"。
 * 沿用 shennong scripts/prerender.mjs 的 fmtNT 格式。
 *
 * @param price 價格數字
 * @param currency ISO 4217 幣別，default "TWD"
 * @returns 如 "NT$12,000" 的字串
 */
export function formatPrice(price, currency = 'TWD') {
    const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
    return `${symbol}${Number(price).toLocaleString('en-US')}`;
}
/**
 * 取描述第一句（以中文句號切分；第一句過短時補第二句）。
 * 沿用 shennong buildLlmsTxt 的 firstSentence：商品描述後面常接長篇說明，清單只要首句。
 *
 * @param s 原始描述
 * @returns 第一句（含句號）；無句號時回傳整段第一行
 */
export function firstSentence(s) {
    const text = String(s).split('\n')[0].trim();
    const sentences = text.match(/[^。]*。/g) ?? [text];
    let out = sentences[0].trim();
    if (out.replace(/。$/, '').length < 10 && sentences[1]) {
        out += sentences[1].trim();
    }
    return out;
}
/**
 * og:locale 格式（zh_TW）轉 BCP 47（zh-TW），供 JSON-LD inLanguage 使用。
 *
 * @param locale og:locale 格式字串
 * @returns 連字號分隔的 BCP 47 語言標籤
 */
export function bcp47Locale(locale) {
    return locale.replace(/_/g, '-');
}
/**
 * llms.txt 單一商品行的價格區段：
 * 有 price → "：NT$1,200（依選項計價）"；只有 priceNote → "：依廟方定價"；兩者皆無 → 空字串。
 *
 * @param item 商品項目
 * @param currency 幣別
 * @returns 價格區段字串（含前導全形冒號），或空字串
 */
export function priceSegment(item, currency = 'TWD') {
    if (item.price !== undefined) {
        const formatted = formatPrice(item.price, currency);
        return item.priceNote ? `：${formatted}（${item.priceNote}）` : `：${formatted}`;
    }
    if (item.priceNote)
        return `：${item.priceNote}`;
    return '';
}
