/**
 * HTML <meta> 標籤產生器（title / description / OG / Twitter / canonical）。
 *
 * 欄位集合取自 shennong / lecake index.html 的 <head> 慣例。
 */
import type { MetaPageInfo, SiteConfig } from './types.js';
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
export declare function generateMetaTags(config: SiteConfig, page?: MetaPageInfo): string;
