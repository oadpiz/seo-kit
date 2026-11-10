/**
 * 測試共用 fixtures（build 時排除，不進 dist）。
 */

import type { ProductFeed, SiteConfig } from './types.js';

export const siteConfig: SiteConfig = {
  siteUrl: 'https://temple.example.com/',
  siteName: '台中國農宮',
  description:
    '台中市東區的宮廟，主祀神農大帝。線上結緣所提供總斗首、平安斗首、安斗、流年安燈、制化祭改等祈福服務，可線上選購，滿額贈送加持結緣品。',
  locale: 'zh_TW',
  logo: '/favicon.svg',
  organization: {
    legalName: '財團法人台中國農宮',
    email: 'temple@example.com',
    phone: '(04) 2211-3539',
    address: '台中市東區十甲路26巷6號',
    sameAs: ['https://www.instagram.com/guononggong/'],
  },
};

export const productFeed: ProductFeed = {
  items: [
    {
      name: '總斗首',
      description: '全年祈福斗首，由廟方每日誦經加持。斗器安奉於正殿，闔家沾恩。',
      price: 12000,
      url: '/products/zong-dou-shou',
      category: '頂級安斗系列',
    },
    {
      name: '平安斗首',
      description: '闔家平安斗首，含斗器安奉與年終謝斗。',
      price: 3600,
      priceNote: '依選項計價',
      url: '/products/ping-an-dou-shou',
      category: '頂級安斗系列',
    },
    {
      name: '藥師燈',
      description: '藥師佛前點燈，祈求身體安康。',
      priceNote: '依廟方定價',
      category: '流年安燈系列',
    },
  ],
};
