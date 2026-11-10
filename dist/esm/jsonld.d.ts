/**
 * JSON-LD（schema.org @graph）產生器。
 *
 * @graph 結構取自 shennong index.html（Organization + WebSite + ItemList(Product)）
 * 與 lecake index.html（自訂型別 Bakery + sameAs）。
 */
import type { JsonLdType, ProductFeed, SiteConfig } from './types.js';
/**
 * 產出 JSON-LD @graph 字串：組織節點 + WebSite 節點 +（有 feed 時）ItemList(Product) 節點。
 *
 * - 組織節點 @type 由 `type` 參數決定（default "Organization"），@id 為
 *   `{siteUrl}/#{type小寫}`（如 #organization、#placeofworship，與 shennong/#bakery 慣例一致）。
 * - config.organization 的 phone/address/email/sameAs/legalName 會映射到
 *   telephone/PostalAddress.streetAddress/email/sameAs/legalName。
 * - WebSite 節點 inLanguage 會把 og:locale（zh_TW）轉成 BCP 47（zh-TW）。
 * - feed 每個項目輸出 Product（name/description/url + 有價格時的 Offer）。
 * - 輸出字串已將 `<` 跳脫為 `\u003c`：可直接內嵌 `<script type="application/ld+json">`
 *   而不會被 `</script>` 提早關 tag（JSON.parse 可正常還原）。
 *
 * @param config 網站設定
 * @param feed 商品／服務清單（選填；無項目時不輸出 ItemList）
 * @param type 組織節點 @type，如 "LocalBusiness"、"Store"、"PlaceOfWorship"、"Bakery"
 * @returns JSON-LD 字串（2 空格縮排）
 *
 * @example
 * ```ts
 * const ld = generateJsonLd(config, feed, 'PlaceOfWorship');
 * fs.writeFileSync('dist/ld.json', ld);
 * ```
 */
export declare function generateJsonLd(config: SiteConfig, feed?: ProductFeed, type?: JsonLdType): string;
