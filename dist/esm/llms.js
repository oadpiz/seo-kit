/**
 * llms.txt 產生器（https://llmstxt.org 格式）。
 *
 * 格式取自 shennong scripts/prerender.mjs 的 buildLlmsTxt()（最完整版本）：
 * `# 站名` + `> 一句話定位` + `## 服務與商品`（含價格、依 category 分 ### 子區塊）
 * + `## 資訊`（about / 地址 / 電話 / email / hours / areas）
 * + `## 備註` + `## 連結`。
 */
import { absoluteUrl, firstSentence, normalizeBaseUrl, priceSegment } from './utils.js';
/**
 * 將單一商品格式化為 llms.txt 清單行。
 *
 * 格式：`- [名稱](url)：NT$1,200（價格註記）— 描述首句`
 * 無 url 時省略連結、無價格時省略價格區段。
 *
 * @param item 商品項目
 * @param base 網站根網址（相對 url 轉絕對用）
 * @param currency 幣別
 * @param fullDescription true 時描述取全文（預設只取第一句）
 * @returns 單行清單字串
 */
function formatItem(item, base, currency, fullDescription) {
    const name = item.url
        ? `[${item.name}](${absoluteUrl(base, item.url)})`
        : item.name;
    const description = fullDescription ? item.description : firstSentence(item.description);
    return `- ${name}${priceSegment(item, currency)} — ${description}`;
}
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
export function generateLlmsTxt(config, feed, options = {}) {
    const base = normalizeBaseUrl(config.siteUrl);
    const currency = feed?.currency ?? 'TWD';
    const full = options.fullItemDescriptions === true;
    const L = [];
    L.push(`# ${config.siteName}`, '');
    L.push(`> ${config.description}`, '');
    // 商品／服務區塊（有項目才輸出）；有 category 的項目分組為 ### 子區塊
    if (feed?.items?.length) {
        const currencyLabel = currency === 'TWD' ? '新台幣' : currency;
        const groups = new Map();
        const ungrouped = [];
        for (const item of feed.items) {
            if (item.category) {
                const list = groups.get(item.category) ?? [];
                list.push(item);
                groups.set(item.category, list);
            }
            else {
                ungrouped.push(item);
            }
        }
        const section = [];
        for (const item of ungrouped)
            section.push(formatItem(item, base, currency, full));
        for (const [category, items] of groups) {
            if (section.length > 0)
                section.push('');
            section.push(`### ${category}`, '');
            for (const item of items)
                section.push(formatItem(item, base, currency, full));
        }
        L.push(`## 服務與商品（價格為${currencyLabel}）`, '', ...section, '');
    }
    // 資訊區塊：options.sections 與 config.organization 的事實合併輸出
    const sections = options.sections;
    const info = [];
    if (sections?.about)
        info.push(`- 關於：${sections.about}`);
    if (config.organization?.address)
        info.push(`- 地址：${config.organization.address}`);
    if (config.organization?.phone)
        info.push(`- 電話：${config.organization.phone}`);
    if (config.organization?.email)
        info.push(`- 電子郵件：${config.organization.email}`);
    if (sections?.hours)
        info.push(`- 營業時間：${sections.hours}`);
    if (sections?.areas)
        info.push(`- 服務地區：${sections.areas}`);
    if (info.length)
        L.push('## 資訊', '', ...info, '');
    if (sections?.notes)
        L.push('## 備註', '', sections.notes, '');
    // 連結區塊：未提供時 fallback 官網 + sitemap
    const links = sections?.links?.length
        ? sections.links
        : [
            { label: `${config.siteName} 官網`, url: `${base}/` },
            { label: 'sitemap', url: `${base}/sitemap.xml` },
        ];
    L.push('## 連結', '');
    for (const link of links)
        L.push(`- [${link.label}](${link.url})`);
    L.push('');
    return L.join('\n');
}
