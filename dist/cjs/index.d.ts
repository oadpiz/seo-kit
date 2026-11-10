/**
 * @oadpiz/seo-kit — SEO/AIEO 統一產生器。
 *
 * 五個純函式、零 runtime 依賴、framework-agnostic：
 * llms.txt / robots.txt / sitemap.xml / JSON-LD / meta tags。
 */
export type { AICrawlerPolicy, JsonLdType, LlmsLink, LlmsTxtOptions, MetaPageInfo, OrganizationInfo, ProductFeed, ProductFeedItem, SitemapEntry, SiteConfig, } from './types.js';
export { generateLlmsTxt } from './llms.js';
export { generateRobots } from './robots.js';
export { generateSitemap } from './sitemap.js';
export { generateJsonLd } from './jsonld.js';
export { generateMetaTags } from './meta.js';
export { AI_CRAWLERS, TRAINING_CRAWLERS } from './utils.js';
