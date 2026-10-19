import type { Metadata } from "next";
import { Archivo_Narrow, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import BlueprintNavbar from "@/components/layout/BlueprintNavbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const archivoNarrow = Archivo_Narrow({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const metadata = {
    tr: {
      title: "ViCareerAI: Kariyerini Yeniden Çiz | AI Destekli CV ve Kariyer Platformu",
      description: "ViCareerAI, özgeçmişini saniyeler içinde ATS uyumlu bir belgeye dönüştürür. 6 şablon, motivasyon mektubu ve eksik beceri analizi ile başvurularını hazırla.",
      keywords: "ATS uyumlu CV, yapay zeka CV oluşturucu, AI özgeçmiş, kariyer platformu, motivasyon mektubu AI",
    },
    en: {
      title: "ViCareerAI: Build ATS-Ready Resumes with AI",
      description: "Build ATS-ready resumes in English and Turkish, generate role-specific cover letters, and analyze job postings for missing skills.",
      keywords: "ai cv builder, ats resume, cover letter, job application, career platform, resume builder, ai resume",
    },
  };

  const currentLocale = locale === "en" ? "en" : "tr";
  const meta = metadata[currentLocale];
  const siteUrl = "https://vi-career-ai.vercel.app";

  return {
    title: {
      default: meta.title,
      template: `%s | ViCareerAI`,
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "ViCareerAI Team" }],
    creator: "ViCareerAI",
    publisher: "ViCareerAI",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'tr': `${siteUrl}/tr`,
        'en': `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "tr_TR",
      url: `${siteUrl}/${locale}`,
      title: meta.title,
      description: meta.description,
      siteName: "ViCareerAI",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "ViCareerAI - AI-Powered Career Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${siteUrl}/og-image.png`],
      creator: "@vicareerai",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "36TeNeDlONosD85g_k-XWeedOeVLnINzz90G7f8zIQQ",
    },
  };
}

export default async function RootLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { children } = props;
  const params = await props.params;
  const { locale } = params;

  if (!routing.locales.includes(locale as "en" | "tr")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${archivoNarrow.variable} ${sourceSerif4.variable} ${jetbrainsMono.variable} antialiased bg-[#F4F1EA] text-[#111111] transition-colors duration-200`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BlueprintNavbar />
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
