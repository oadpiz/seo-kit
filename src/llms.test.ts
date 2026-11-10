import { describe, expect, it } from 'vitest';
import { generateLlmsTxt } from './llms.js';
import { productFeed, siteConfig } from './test-utils.js';

describe('generateLlmsTxt', () => {
  it('happy path：站名 + 引言 + 商品價格行（NT$ 千分位 + 首句描述）', () => {
    const out = generateLlmsTxt(siteConfig, productFeed);
    expect(out).toContain('# 台中國農宮\n\n> 台中市東區的宮廟，主祀神農大帝。');
    expect(out).toContain('## 服務與商品（價格為新台幣）');
    // 價格千分位格式（沿用 shennong fmtNT）+ 相對 url 轉絕對 + 描述首句
    expect(out).toContain(
      '- [總斗首](https://temple.example.com/products/zong-dou-shou)：NT$12,000 — 全年祈福斗首，由廟方每日誦經加持。',
    );
    // price + priceNote 同時出現
    expect(out).toContain('：NT$3,600（依選項計價） — 闔家平安斗首，含斗器安奉與年終謝斗。');
  });

  it('依 category 分 ### 子區塊，跨分類項目不入同組', () => {
    const out = generateLlmsTxt(siteConfig, productFeed);
    expect(out).toContain('### 頂級安斗系列');
    expect(out).toContain('### 流年安燈系列');
    const douIdx = out.indexOf('總斗首');
    const dengIdx = out.indexOf('藥師燈');
    expect(douIdx).toBeGreaterThan(-1);
    expect(dengIdx).toBeGreaterThan(douIdx);
  });

  it('只有 priceNote 沒有 price 時輸出註記而非 NT$', () => {
    const out = generateLlmsTxt(siteConfig, productFeed);
    expect(out).toContain('- 藥師燈：依廟方定價 — 藥師佛前點燈，祈求身體安康。');
    expect(out).not.toContain('藥師燈：NT$');
  });

  it('無 feed 時不輸出商品區塊，但仍輸出資訊與連結', () => {
    const out = generateLlmsTxt(siteConfig);
    expect(out).not.toContain('## 服務與商品');
    expect(out).toContain('## 資訊');
    expect(out).toContain('- 地址：台中市東區十甲路26巷6號');
    expect(out).toContain('- 電話：(04) 2211-3539');
    // 預設連結 fallback：官網 + sitemap
    expect(out).toContain('- [台中國農宮 官網](https://temple.example.com/)');
    expect(out).toContain('- [sitemap](https://temple.example.com/sitemap.xml)');
  });

  it('sections（about/hours/areas/notes/links）與 fullItemDescriptions 皆生效', () => {
    const out = generateLlmsTxt(siteConfig, productFeed, {
      sections: {
        about: '主祀神農大帝的道教宮廟',
        hours: '每日 06:00–21:00',
        areas: '台中市',
        notes: '價格以官網線上資料為準。',
        links: [{ label: '參拜指南', url: 'https://temple.example.com/guide' }],
      },
      fullItemDescriptions: true,
    });
    expect(out).toContain('- 關於：主祀神農大帝的道教宮廟');
    expect(out).toContain('- 營業時間：每日 06:00–21:00');
    expect(out).toContain('- 服務地區：台中市');
    expect(out).toContain('## 備註\n\n價格以官網線上資料為準。');
    expect(out).toContain('- [參拜指南](https://temple.example.com/guide)');
    // fullItemDescriptions：完整描述（含第二句）
    expect(out).toContain('斗器安奉於正殿，闔家沾恩。');
  });
});
