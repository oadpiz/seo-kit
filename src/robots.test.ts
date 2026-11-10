import { describe, expect, it } from 'vitest';
import { generateRobots } from './robots.js';
import { AI_CRAWLERS } from './utils.js';
import { siteConfig } from './test-utils.js';

describe('generateRobots', () => {
  it('預設政策：* 允許 + 9 個 AI 爬蟲逐一明確 Allow + Sitemap 行', () => {
    const out = generateRobots(siteConfig);
    expect(out).toContain('User-agent: *\nAllow: /\n');
    for (const bot of AI_CRAWLERS) {
      expect(out).toContain(`User-agent: ${bot}`);
    }
    expect(out).toContain('Sitemap: https://temple.example.com/sitemap.xml');
    expect(out).toContain('# llms.txt: https://temple.example.com/llms.txt');
    expect(out).not.toContain('Disallow: /admin');
  });

  it('disallowTraining：訓練用爬蟲（CCBot/Google-Extended/Claude-Web/anthropic-ai）設 Disallow', () => {
    const out = generateRobots(siteConfig, { disallowTraining: true });
    const trainingBlock = out.slice(out.indexOf('# 拒絕模型訓練用爬蟲'));
    expect(trainingBlock).toContain('User-agent: CCBot');
    expect(trainingBlock).toContain('User-agent: Google-Extended');
    expect(trainingBlock).toContain('User-agent: Claude-Web');
    expect(trainingBlock).toContain('User-agent: anthropic-ai');
    expect(trainingBlock).toContain('Disallow: /');
    // 其餘 5 個瀏覽用爬蟲仍在允許區塊
    for (const bot of ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot']) {
      expect(out).toContain(`User-agent: ${bot}`);
    }
  });

  it('allowAll: false：全部 AI 爬蟲 Disallow，* 仍 Allow', () => {
    const out = generateRobots(siteConfig, { allowAll: false });
    expect(out).not.toContain('# AI 檢索引擎爬蟲');
    const block = out.slice(out.indexOf('# 拒絕模型訓練用爬蟲'), out.indexOf('Sitemap:'));
    for (const bot of AI_CRAWLERS) {
      expect(block).toContain(`User-agent: ${bot}`);
    }
    expect(out).toMatch(/User-agent: \*\nAllow: \//);
  });

  it('customRules：* 規則併入一般區塊、其他 agent 各自成區塊、sitemapPath 可自訂', () => {
    const out = generateRobots(
      siteConfig,
      { customRules: { '*': ['Disallow: /admin', 'Disallow: /checkout'], BadBot: ['Disallow: /'] } },
      'https://cdn.example.com/sitemap.xml',
    );
    expect(out).toContain('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout');
    expect(out).toContain('User-agent: BadBot\nDisallow: /');
    expect(out).toContain('Sitemap: https://cdn.example.com/sitemap.xml');
  });
});
