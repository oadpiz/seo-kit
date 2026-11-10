# @oadpiz/seo-kit

SEO/AIEO 統一產生器 ——工作室多個客戶網站（React+Vite / Vue3+Vite / Next）共用的
`llms.txt`、`robots.txt`、`sitemap.xml`、JSON-LD、meta tags 一次產出，改一處全部受益。

- **Framework-agnostic**：純字串函式，build script（Node）、React、Vue 都能用
- **零 runtime 依賴**：`npm ls --production` 是空的
- **TypeScript strict mode**，ESM + CJS dual exports
- 來源：濃縮 shennong（llms.txt / JSON-LD / sitemap priority 分層）、lecake（Bakery 型別、
  robots AI 爬蟲區塊）、Axis（sitemap/robots 慣例）三個專案各自 copy-paste 的實作

## 安裝

私有 package，直接從 GitHub 安裝：

```bash
npm install github:oadpiz/seo-kit
# 或鎖版本
npm install github:oadpiz/seo-kit#v0.1.0
```

## 快速上手

```ts
import {
  generateLlmsTxt,
  generateRobots,
  generateSitemap,
  generateJsonLd,
  generateMetaTags,
  type SiteConfig,
} from '@oadpiz/seo-kit';

const config: SiteConfig = {
  siteUrl: 'https://example.com',
  siteName: '我的店',
  description: '一句話說明這個網站賣什麼、給誰用。',
  locale: 'zh_TW',                       // 選填，default "zh_TW"
  logo: '/logo.png',                     // 選填
  organization: {                        // 選填，會進 JSON-LD 與 llms.txt
    phone: '(04) 2211-3539',
    address: '台中市東區十甲路26巷6號',
    sameAs: ['https://www.instagram.com/myshop/'],
  },
};

const feed = {
  items: [
    { name: '招牌商品', description: '說明第一句。後續細節。', price: 1200,
      url: '/products/signature', category: '熱銷' },
    { name: '客製商品', description: '依需求報價。', priceNote: '依選項計價' },
  ],
  currency: 'TWD',                       // 選填，default "TWD"
};

// Vite build 後寫進 dist/（vite.config 的 closeBundle hook 或獨立 script）
fs.writeFileSync('dist/llms.txt', generateLlmsTxt(config, feed));
fs.writeFileSync('dist/robots.txt', generateRobots(config, { customRules: { '*': ['Disallow: /admin'] } }));
fs.writeFileSync('dist/sitemap.xml', generateSitemap(config, [
  { path: '/', priority: 1, changefreq: 'daily' },
  { path: '/products', priority: 0.9, lastmod: new Date() },
]));
fs.writeFileSync('dist/json-ld.json', generateJsonLd(config, feed, 'LocalBusiness'));

// 或 runtime 组 <head>（React/Vue 皆同）
const head = generateMetaTags(config, { title: '商品', path: '/products' });
```

## API

### 型別

| 型別 | 說明 |
|---|---|
| `SiteConfig` | 每個網站的唯一設定（`siteUrl` / `siteName` / `description` 必填；`locale` default `"zh_TW"`、`logo`、`organization` 選填） |
| `OrganizationInfo` | `legalName?` / `email?` / `phone?` / `address?` / `sameAs?` |
| `ProductFeedItem` | `name` / `description` 必填；`price?`（NT$）、`priceNote?`（「依選項計價」）、`url?`、`category?` |
| `ProductFeed` | `items` + `currency?`（default `"TWD"`） |
| `SitemapEntry` | `path` 必填；`lastmod?`（Date → YYYY-MM-DD）、`changefreq?`、`priority?`（0.0–1.0） |
| `AICrawlerPolicy` | `allowAll?`（default `true`）、`disallowTraining?`、`customRules?`（`Record<User-agent, 規則行[]>`） |
| `LlmsTxtOptions` | `sections?`（`about` / `hours` / `areas` / `notes` / `links`）＋ `fullItemDescriptions?` |
| `MetaPageInfo` | `title?` / `description?` / `path?` / `image?`（缺省回落 `SiteConfig`） |
| `JsonLdType` | `"LocalBusiness" | "Organization" | "Store" | "PlaceOfWorship"` 或任意 schema.org 型別字串（如 `"Bakery"`） |

### 函式

#### `generateLlmsTxt(config, feed?, options?) → string`

llms.txt 全文：`# 站名` → `> 一句話定位` → `## 服務與商品（價格為新台幣）`（有 `category`
的項目分 `###` 子區塊；行格式 `- [名稱](url)：NT$12,000（註記）— 描述首句`，預設只取第一句，
`fullItemDescriptions: true` 取全文）→ `## 資訊`（about / 組織地址電話 email / hours / areas）
→ `## 備註` → `## 連結`（未提供時 fallback 官網 + sitemap）。

#### `generateRobots(config, policy?, sitemapPath?) → string`

robots.txt：`User-agent: *` 永遠 `Allow: /`（`customRules['*']` 的行併入此區塊）；
`allowAll`（default true）時 9 個 AI 爬蟲（GPTBot / ChatGPT-User / OAI-SearchBot /
ClaudeBot / Claude-Web / anthropic-ai / PerplexityBot / Google-Extended / CCBot）
逐一明確 `Allow: /`；`disallowTraining: true` 時訓練用爬蟲（CCBot / Google-Extended /
Claude-Web / anthropic-ai）改 `Disallow: /`；`allowAll: false` 全部 AI 爬蟲 `Disallow`。
尾端 `Sitemap:` 行（`sitemapPath` default `/sitemap.xml`）＋ `# llms.txt:` 註解行。

#### `generateSitemap(config, entries) → string`

sitemap.xml（0.9 protocol）：每個 entry 輸出 `<loc>`（siteUrl + path）＋選填
`<lastmod>` / `<changefreq>` / `<priority>`（固定一位小數）；loc 會做 XML 跳脫，
輸出可通過 `xmllint --noout` 驗證。

#### `generateJsonLd(config, feed?, type?) → string`

JSON-LD `@graph`：組織節點（`type` default `"Organization"`，`@id` 為
`{siteUrl}/#{type小寫}`；organization 資訊映射 `telephone` / `PostalAddress` / `sameAs` /
`legalName`）＋ `WebSite` 節點（`inLanguage` 自動 zh_TW → zh-TW，`publisher` 指回組織）
＋（有 feed 時）`ItemList` of `Product`（有 `price` 的項目帶 `Offer`）。
輸出已將 `<` 跳脫為 `\u003c`，可直接內嵌 `<script type="application/ld+json">`。

#### `generateMetaTags(config, page?) → string`

單頁 `<head>` meta 標籤（多行字串）：`<title>`（`{title} | {siteName}`）、
description、robots、canonical、OG（type/site_name/locale/url/title/description/image）、
Twitter（card/url/title/description/image）。`page.image` 缺省回落 `config.logo`
（相對路徑自動補絕對 URL）；完全沒圖時 `twitter:card` 降為 `summary`。

### 常數

- `AI_CRAWLERS`：9 個 AI 爬蟲 user-agent 清單
- `TRAINING_CRAWLERS`：`disallowTraining` 會擋的 4 個訓練用爬蟲

## 整合方式參考

| 場景 | 做法 |
|---|---|
| Vite（React/Vue） | `vite build` 後跑一支 Node script 呼叫各產生器寫入 `dist/`（同 shennong `scripts/prerender.mjs`） |
| Next.js（Axis） | `app/robots.ts` / `app/sitemap.ts` 的 route handler 內直接 `return generateRobots(...)` 等 |
| 動態商品 | 商品資料來源（DB / CMS / 前端 data 檔）轉成 `ProductFeed` 後共用同一份餵 `generateLlmsTxt` 與 `generateJsonLd` |

## 開發

```bash
npm install        # 僅 typescript + vitest 兩個 devDependencies
npm test           # vitest run（19 條單元測試）
npm run typecheck  # tsc --noEmit（strict）
npm run build      # dist/esm + dist/cjs + .d.ts
```

## 授權

oadpiz 內部使用（UNLICENSED / private）。
