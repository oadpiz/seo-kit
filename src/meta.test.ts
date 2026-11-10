import { describe, expect, it } from 'vitest';
import { generateMetaTags } from './meta.js';
import { siteConfig } from './test-utils.js';

describe('generateMetaTags', () => {
  it('無 page 資訊：title 直接用站名、canonical 根目錄、logo 補絕對 URL', () => {
    const out = generateMetaTags(siteConfig);
    expect(out).toContain('<title>台中國農宮</title>');
    expect(out).toContain('<link rel="canonical" href="https://temple.example.com/" />');
    expect(out).toContain('<meta property="og:url" content="https://temple.example.com/" />');
    expect(out).toContain(
      '<meta property="og:image" content="https://temple.example.com/favicon.svg" />',
    );
    expect(out).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(out).toContain('<meta property="og:locale" content="zh_TW" />');
  });

  it('page 覆寫：title 加站名後綴、path 組 canonical、絕對 image 原樣使用', () => {
    const out = generateMetaTags(siteConfig, {
      title: '祈福服務',
      description: '安斗、安燈、制化祭改等祈福服務說明。',
      path: '/services',
      image: 'https://cdn.example.com/og-services.jpg',
    });
    expect(out).toContain('<title>祈福服務 | 台中國農宮</title>');
    expect(out).toContain('<meta name="description" content="安斗、安燈、制化祭改等祈福服務說明。" />');
    expect(out).toContain('<link rel="canonical" href="https://temple.example.com/services" />');
    expect(out).toContain('<meta name="twitter:image" content="https://cdn.example.com/og-services.jpg" />');
  });

  it('屬性值做 HTML 跳脫；無圖時不輸出 image 標籤且 twitter:card 降為 summary', () => {
    const out = generateMetaTags(
      { ...siteConfig, logo: undefined },
      { title: 'A "Quote" <Test>' },
    );
    expect(out).toContain('<title>A &quot;Quote&quot; &lt;Test&gt; | 台中國農宮</title>');
    expect(out).not.toContain('og:image');
    expect(out).not.toContain('twitter:image');
    expect(out).toContain('<meta name="twitter:card" content="summary" />');
  });
});
