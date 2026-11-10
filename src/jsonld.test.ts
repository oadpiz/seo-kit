import { describe, expect, it } from 'vitest';
import { generateJsonLd } from './jsonld.js';
import { productFeed, siteConfig } from './test-utils.js';

/** JSON.parse 還原後的 @graph 形狀。 */
type LdGraph = { '@context': string; '@graph': Array<Record<string, unknown>> };

describe('generateJsonLd', () => {
  it('預設 Organization @graph：組織節點 + WebSite 節點，可 JSON.parse', () => {
    const parsed = JSON.parse(generateJsonLd(siteConfig)) as LdGraph;
    expect(parsed['@context']).toBe('https://schema.org');
    const org = parsed['@graph'][0];
    const site = parsed['@graph'][1];
    expect(org['@type']).toBe('Organization');
    expect(org['@id']).toBe('https://temple.example.com/#organization');
    expect(org['telephone']).toBe('(04) 2211-3539');
    expect(org['logo']).toBe('https://temple.example.com/favicon.svg');
    expect((org['address'] as Record<string, unknown>)['streetAddress']).toBe(
      '台中市東區十甲路26巷6號',
    );
    expect(site['@type']).toBe('WebSite');
    expect(site['inLanguage']).toBe('zh-TW'); // zh_TW → zh-TW
    expect(site['publisher']).toEqual({ '@id': 'https://temple.example.com/#organization' });
  });

  it('自訂型別 PlaceOfWorship：@type 與 @id fragment 跟著換、WebSite publisher 指向同一節點', () => {
    const parsed = JSON.parse(generateJsonLd(siteConfig, undefined, 'PlaceOfWorship')) as LdGraph;
    expect(parsed['@graph'][0]['@type']).toBe('PlaceOfWorship');
    expect(parsed['@graph'][0]['@id']).toBe('https://temple.example.com/#placeofworship');
    expect(parsed['@graph'][1]['publisher']).toEqual({
      '@id': 'https://temple.example.com/#placeofworship',
    });
  });

  it('有 feed 時輸出 ItemList(Product)，相對 url 轉絕對、無價格項目不帶 offers', () => {
    const parsed = JSON.parse(generateJsonLd(siteConfig, productFeed)) as LdGraph;
    const list = parsed['@graph'][2];
    expect(list['@type']).toBe('ItemList');
    expect(list['numberOfItems']).toBe(3);
    const elements = list['itemListElement'] as Array<Record<string, unknown>>;
    const first = elements[0]['item'] as Record<string, unknown>;
    expect(first['@type']).toBe('Product');
    expect(first['url']).toBe('https://temple.example.com/products/zong-dou-shou');
    expect(first['offers']).toEqual({
      '@type': 'Offer',
      price: 12000,
      priceCurrency: 'TWD',
      url: 'https://temple.example.com/products/zong-dou-shou',
    });
    const third = (elements[2] as Record<string, unknown>)['item'] as Record<string, unknown>;
    expect(third['offers']).toBeUndefined();
  });

  it('< 已跳脫為 \\u003c（可安全內嵌 <script>，parse 後還原）', () => {
    const raw = generateJsonLd({
      ...siteConfig,
      description: 'A < B 的比較測試',
    });
    expect(raw).not.toContain('<');
    const parsed = JSON.parse(raw) as LdGraph;
    expect(parsed['@graph'][0]['description']).toBe('A < B 的比較測試');
  });
});
