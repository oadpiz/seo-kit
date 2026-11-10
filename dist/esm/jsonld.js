/**
 * JSON-LD（schema.org @graph）產生器。
 *
 * @graph 結構取自 shennong index.html（Organization + WebSite + ItemList(Product)）
 * 與 lecake index.html（自訂型別 Bakery + sameAs）。
 */
import { absoluteUrl, bcp47Locale, normalizeBaseUrl } from './utils.js';
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
export function generateJsonLd(config, feed, type = 'Organization') {
    const base = normalizeBaseUrl(config.siteUrl);
    const orgId = `${base}/#${type.toLowerCase()}`;
    const org = {
        '@type': type,
        '@id': orgId,
        name: config.siteName,
        url: `${base}/`,
        description: config.description,
    };
    const logo = absoluteUrl(base, config.logo);
    if (logo)
        org.logo = logo;
    const o = config.organization;
    if (o?.legalName)
        org.legalName = o.legalName;
    if (o?.phone)
        org.telephone = o.phone;
    if (o?.email)
        org.email = o.email;
    if (o?.address)
        org.address = { '@type': 'PostalAddress', streetAddress: o.address };
    if (o?.sameAs?.length)
        org.sameAs = [...o.sameAs];
    const website = {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: config.siteName,
        description: config.description,
        inLanguage: bcp47Locale(config.locale ?? 'zh_TW'),
        publisher: { '@id': orgId },
    };
    const graph = [org, website];
    if (feed?.items?.length) {
        const currency = feed.currency ?? 'TWD';
        graph.push({
            '@type': 'ItemList',
            '@id': `${base}/#products`,
            name: `${config.siteName} 服務與商品`,
            numberOfItems: feed.items.length,
            itemListElement: feed.items.map((item, index) => {
                const url = absoluteUrl(base, item.url);
                const product = {
                    '@type': 'Product',
                    name: item.name,
                    description: item.description,
                };
                if (url)
                    product.url = url;
                if (item.price !== undefined) {
                    const offers = {
                        '@type': 'Offer',
                        price: item.price,
                        priceCurrency: currency,
                    };
                    if (url)
                        offers.url = url;
                    product.offers = offers;
                }
                return { '@type': 'ListItem', position: index + 1, item: product };
            }),
        });
    }
    // `<` 跳脫為 \u003c：內嵌 <script> 時不會被 </script> 提早關 tag（JSON 仍可 parse）
    return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replace(/</g, '\\u003c');
}
