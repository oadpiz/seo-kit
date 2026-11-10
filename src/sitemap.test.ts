import { describe, expect, it } from 'vitest';
import { generateSitemap } from './sitemap.js';
import { siteConfig } from './test-utils.js';

describe('generateSitemap', () => {
  it('happy path：完整欄位（loc/lastmod/changefreq/priority），Date 轉 YYYY-MM-DD', () => {
    const out = generateSitemap(siteConfig, [
      { path: '/', priority: 1, changefreq: 'daily', lastmod: new Date('2026-11-01T08:00:00Z') },
      { path: 'products', priority: 0.9, changefreq: 'weekly', lastmod: '2026-10-15' },
    ]);
    expect(out).toContain(
      '<loc>https://temple.example.com/</loc>\n    <lastmod>2026-11-01</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>',
    );
    // 無前導斜線的路徑自動補 /，priority 固定一位小數
    expect(out).toContain('<loc>https://temple.example.com/products</loc>');
    expect(out).toContain('<priority>0.9</priority>');
    expect(out).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
    expect(out.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('URL 中的 & 與中文會被 XML 跳脫', () => {
    const out = generateSitemap(siteConfig, [
      { path: '/products?category=斗首&sort=new' },
    ]);
    expect(out).toContain(
      '<loc>https://temple.example.com/products?category=斗首&amp;sort=new</loc>',
    );
    expect(out).not.toContain('&sort');
  });

  it('最小項目（只有 path）輸出合法 XML，省略選填欄位', () => {
    const out = generateSitemap(siteConfig, [{ path: '/about' }]);
    expect(out).toContain(
      '  <url>\n    <loc>https://temple.example.com/about</loc>\n  </url>',
    );
    expect(out).not.toContain('<lastmod>');
    expect(out).not.toContain('<changefreq>');
    expect(out).not.toContain('<priority>');
  });
});
