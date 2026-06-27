/* ============================================================
   1) FONT DÜZELTMESİ — next/font/google
   ============================================================
   Şu anki yöntem (static reference dosyalarımda kullandığım):
     <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk..." rel="stylesheet">
   Bu, production Next.js sitesinde KULLANILMAMALI — her sayfa yüklemesinde
   Google'a ekstra bir DNS+bağlantı+indirme isteği açar, Speed Index'i yükseltir.

   Doğru yöntem: next/font/google. Next.js fontu BUILD TIME'da indirir,
   kendi sunucundan (Vercel) servis eder, otomatik font-display:swap uygular.
   Dış istek sıfıra iner.

   Yer: app/layout.tsx (ya da app/[locale]/layout.tsx, locale yapın neyse)
   ------------------------------------------------------------ */

import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['600', '700'], // CSS'de kullanılan gerçek ağırlıklar; 500 kullanılmıyorsa eklemeyin
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

// layout.tsx içinde <html> veya <body>'ye className olarak ekle:
// <html className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
//
// Sonra CSS'de:
//   h1,h2,h3 { font-family: var(--font-display), sans-serif; }
//   body { font-family: var(--font-body), sans-serif; }
//   .mono { font-family: var(--font-mono), monospace; }
//
// Ve <head>'deki eski Google Fonts <link> etiketlerini SİL — next/font
// onları gereksiz kılıyor, ikisini birden tutmak fontu iki kere yükletir.


/* ============================================================
   2) META TAGS — Landing page (app/page.tsx veya app/[locale]/page.tsx)
   ============================================================
   Lighthouse "SEO: 100" derken bunlara bakmıyor — ama LinkedIn/Product Hunt'ta
   paylaşırken link önizlemesinin (Open Graph) düzgün çıkması için gerekli.
   ------------------------------------------------------------ */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ViCareerAI — Kariyerini Yeniden Çiz | AI Destekli CV ve Kariyer Platformu',
  description:
    'ViCareerAI, özgeçmişini GPT-4o ile saniyeler içinde ATS onaylı bir belgeye dönüştürür. ' +
    'AI destekli CV oluşturma, motivasyon mektubu, skill gap analizi ve kariyer yol haritası — ücretsiz başla.',
  keywords: ['ATS uyumlu CV', 'yapay zeka CV oluşturucu', 'AI özgeçmiş', 'kariyer platformu', 'motivasyon mektubu AI'],
  alternates: {
    canonical: 'https://vi-career-ai.vercel.app',
  },
  openGraph: {
    title: 'ViCareerAI — Kariyerini Yeniden Çiz',
    description: 'GPT-4o destekli AI ile ATS onaylı CV, motivasyon mektubu ve kariyer yol haritası oluştur.',
    url: 'https://vi-career-ai.vercel.app',
    siteName: 'ViCareerAI',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        // ⚠️ Bu görsel henüz yok — 1200x630px bir OG image oluşturup
        // public/og-image.png olarak ekle. İçerik: logo + "Kariyerini
        // Yeniden Çiz" başlığı, blueprint temasıyla tutarlı.
        url: 'https://vi-career-ai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ViCareerAI - AI Destekli Kariyer Platformu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViCareerAI — Kariyerini Yeniden Çiz',
    description: 'GPT-4o destekli AI ile ATS onaylı CV, motivasyon mektubu ve kariyer yol haritası oluştur.',
    images: ['https://vi-career-ai.vercel.app/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}


/* ============================================================
   3) JSON-LD STRUCTURED DATA — Landing page
   ============================================================
   Google'a "bu bir SaaS ürünü, fiyatları şunlar" diye makine-okunabilir
   bilgi verir. Rich snippet (fiyat, puan vb. arama sonucunda görünmesi)
   ihtimalini açar. Gerçek fiyatlar (₺0 / ₺299) canlı siteden teyit edildi.

   Yer: app/page.tsx içinde, JSX'in içine <script type="application/ld+json">
   olarak veya app/layout.tsx'e ekleyebilirsin.
   ------------------------------------------------------------ */

export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ViCareerAI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'GPT-4o destekli AI ile ATS onaylı CV, motivasyon mektubu, skill gap analizi ve kariyer yol haritası oluşturan platform.',
    url: 'https://vi-career-ai.vercel.app',
    offers: [
      {
        '@type': 'Offer',
        name: 'Başlangıç',
        price: '0',
        priceCurrency: 'TRY',
      },
      {
        '@type': 'Offer',
        name: 'Sınırsız Pro',
        price: '299',
        priceCurrency: 'TRY',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          billingDuration: 'P1M',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}


/* ============================================================
   4) NOINDEX — tüm internal/auth sayfaları için
   ============================================================
   Dashboard, CV editörü, hesap ayarları gibi girişli sayfalar Google'da
   görünmemeli (hem SEO değeri yok hem crawl budget'ı boşa harcar, hem
   bazı durumlarda gizlilik açısından istenmeyen bir durum).

   Her internal sayfanın metadata export'una (veya layout'una, tek
   tek tekrarlamamak için) bunu ekle:
   ------------------------------------------------------------ */

export const internalPageMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

// Eğer tüm /dashboard, /cv, /applications vb. ortak bir layout.tsx
// paylaşıyorsa, bunu tek bir yere (o layout'un metadata export'una)
// koymak, her sayfada tekrarlamaktan daha güvenli — unutma riski azalır.
