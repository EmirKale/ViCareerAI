import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import BlueprintNavbar from "@/components/layout/BlueprintNavbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const metadata = {
    tr: {
      title: "ViCareerAI - Yapay Zeka ile CV Oluştur",
      description: "GPT-4o ile ATS uyumlu CV oluştur, motivasyon mektubu yaz, iş ilanlarını analiz et. Türkiye'nin en akıllı kariyer platformu.",
      keywords: "cv oluştur, yapay zeka cv, ats cv, motivasyon mektubu, iş başvurusu, kariyer, özgeçmiş oluştur, ai cv",
    },
    en: {
      title: "ViCareerAI - Build Your CV with AI",
      description: "Create ATS-friendly CVs with GPT-4o, write cover letters, analyze job postings. The smartest AI career platform.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200`}
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
