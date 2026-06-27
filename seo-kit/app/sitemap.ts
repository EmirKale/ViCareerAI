import { MetadataRoute } from 'next'

// Bu dosyada SADECE gerçekten var olduğunu doğruladığım public route'lar var:
// /, /pricing, /register, /login (hepsini canlı sitede fetch ederek teyit ettim).
// Başka public sayfan varsa (örn. /privacy, /terms, /templates) ekle.
//
// ⚠️ DOĞRULA: next-intl kullanıyorsan ve TR/EN için farklı URL'lerin varsa
// (örn. /tr/pricing, /en/pricing), her locale için ayrı <url> girişi gerekir —
// next-intl'in sitemap için resmi örneğine bak: next-intl-docs sitemap rehberi.

const BASE_URL = 'https://vi-career-ai.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
