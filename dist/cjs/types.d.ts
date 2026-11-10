/**
 * @oadpiz/seo-kit 型別定義。
 *
 * 所有介面皆為 framework-agnostic 的純資料，
 * React / Vue / Node build script 都可以直接使用。
 */
/** 組織（店家／廟方／公司）資訊，供 JSON-LD 與 llms.txt 使用。 */
export interface OrganizationInfo {
    /** 正式法人名稱（如「財團法人台中國農宮」），對應 schema.org legalName。 */
    legalName?: string;
    /** 聯絡 email。 */
    email?: string;
    /** 聯絡電話，如 "(04) 2211-3539"。 */
    phone?: string;
    /** 聯絡地址（單行字串即可，輸出為 PostalAddress.streetAddress）。 */
    address?: string;
    /** 社群連結（Instagram / LINE / FB 粉專等），對應 schema.org sameAs。 */
    sameAs?: string[];
}
/** 每個網站的唯一設定，五個產生器的共用輸入。 */
export interface SiteConfig {
    /** 網站根網址，如 https://example.com（結尾斜線可加可不加）。 */
    siteUrl: string;
    /** 站名 / 店名，如「台中國農宮」、「LE Cake」。 */
    siteName: string;
    /** 一句話定位描述（llms.txt 的 > 引言、meta description 預設值）。 */
    description: string;
    /** og:locale 格式，default "zh_TW"。 */
    locale?: string;
    /** logo 路徑（相對路徑如 /logo.png 或絕對 URL 皆可）。 */
    logo?: string;
    /** 組織資訊（選填，有填會進 JSON-LD 與 llms.txt 資訊區塊）。 */
    organization?: OrganizationInfo;
}
/** 商品／服務清單項目（llms.txt 與 JSON-LD ItemList 共用）。 */
export interface ProductFeedItem {
    /** 商品／服務名稱。 */
    name: string;
    /** 描述（llms.txt 預設只取第一句，見 LlmsTxtOptions.fullItemDescriptions）。 */
    description: string;
    /** 價格（NT$，無則不列）。 */
    price?: number;
    /** 非固定價的說明文字，如「依選項計價」、「依廟方定價」。 */
    priceNote?: string;
    /** 詳情頁連結（相對路徑或絕對 URL 皆可）。 */
    url?: string;
    /** 分類名稱；有分類的項目會在 llms.txt 形成 ### 子區塊。 */
    category?: string;
}
/** 商品／服務清單。 */
export interface ProductFeed {
    items: ProductFeedItem[];
    /** ISO 4217 幣別，default "TWD"。 */
    currency?: string;
}
/** sitemap 單一 URL 項目。 */
export interface SitemapEntry {
    /** 路徑，如 /products（會自動接在 siteUrl 後）。 */
    path: string;
    /** 最後修改時間；Date 會轉成 YYYY-MM-DD，字串則原樣輸出。 */
    lastmod?: Date | string;
    /** 更新頻率。 */
    changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    /** 優先度 0.0–1.0，輸出為一位小數。 */
    priority?: number;
}
/** AI 爬蟲政策（generateRobots 用）。 */
export interface AICrawlerPolicy {
    /** 是否允許 AI 爬蟲檢索公開內容，default true。 */
    allowAll?: boolean;
    /** 拒絕「模型訓練用」爬蟲（CCBot / Google-Extended / Claude-Web / anthropic-ai 設 Disallow: /）。 */
    disallowTraining?: boolean;
    /** 額外規則：key 為 User-agent（如 "*"、"BadBot"），value 為規則行（如 ["Disallow: /private"]）。 */
    customRules?: Record<string, string[]>;
}
/** llms.txt「連結」區塊的單一連結。 */
export interface LlmsLink {
    label: string;
    url: string;
}
/** llms.txt 選填區塊內容。 */
export interface LlmsTxtOptions {
    sections?: {
        /** 「關於」一段話（## 資訊 區塊）。 */
        about?: string;
        /** 營業／開放時間（## 資訊 區塊）。 */
        hours?: string;
        /** 服務地區（## 資訊 區塊）。 */
        areas?: string;
        /** 備註全文，獨立輸出為「## 備註」區塊。 */
        notes?: string;
        /** 自訂連結清單；未提供時預設輸出官網與 sitemap 兩條。 */
        links?: LlmsLink[];
    };
    /** true 時商品描述取全文；預設只取第一句（避免長篇說明淹沒清單）。 */
    fullItemDescriptions?: boolean;
}
/** 單頁 meta 資訊（generateMetaTags 用），全部選填、缺省值回落到 SiteConfig。 */
export interface MetaPageInfo {
    /** 頁面標題；輸出為「{title} | {siteName}」。未提供則直接用 siteName。 */
    title?: string;
    /** 頁面描述；未提供用 config.description。 */
    description?: string;
    /** 頁面路徑（canonical / og:url 用）；未提供為 "/"。 */
    path?: string;
    /** OG/Twitter 圖（相對路徑或絕對 URL）；未提供用 config.logo。 */
    image?: string;
}
/** JSON-LD 組織節點的 @type；可為 schema.org 上任意型別字串（如 "Bakery"）。 */
export type JsonLdType = 'LocalBusiness' | 'Organization' | 'Store' | 'PlaceOfWorship' | (string & {});
