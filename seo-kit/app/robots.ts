import { MetadataRoute } from 'next'

// ⚠️ DOĞRULA: next-intl [locale] segment'i kullanıyorsanız, bu dosya
// app/robots.ts konumunda (locale segment'inin DIŞINDA) kalmalı — Next.js
// otomatik olarak /robots.txt'de servis eder, locale prefix'i almaz.

const BASE_URL = 'https://vi-career-ai.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // ⚠️ DOĞRULA: aşağıdaki path'ler tahminidir, gerçek route
          // isimlerinize göre güncelleyin. Amaç: girişli (authenticated)
          // tüm uygulama içi sayfaları crawl dışı bırakmak.
          '/dashboard',
          '/cv/*',
          '/letter/*',
          '/applications',
          '/discover',
          '/skills/*',
          '/roadmap/*',
          '/interview',
          '/account',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
