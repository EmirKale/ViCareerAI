import type { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  
  const siteUrl = "https://vi-career-ai.vercel.app";
  const url = `${siteUrl}/${locale}/templates`;

  const meta = {
    tr: {
      title: "CV Şablonları — Klasik, Modern ve Minimal",
      description: "İş başvurusu türünüze ve sektöre göre seçebileceğiniz 6 farklı CV şablonu. Klasik kurumsal, modern profesyonel ve teknik pozisyonlar için düzenler.",
    },
    en: {
      title: "Resume Templates — Classic, Modern, and Minimal",
      description: "6 distinct resume templates tailored for corporate, modern, and technical applications. Select the structure that matches your career path.",
    }
  };

  const currentMeta = meta[locale as "en" | "tr"] || meta.en;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${currentMeta.title} | ViCareerAI`,
      description: currentMeta.description,
      url: url,
    },
    twitter: {
      title: `${currentMeta.title} | ViCareerAI`,
      description: currentMeta.description,
    }
  };
}

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
