import type { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  
  const siteUrl = "https://vi-career-ai.vercel.app";
  const url = `${siteUrl}/${locale}/register`;

  const meta = {
    tr: {
      title: "Hesap Oluştur — ViCareerAI",
      description: "Ücretsiz ViCareerAI hesabı açın. 2 CV, 3 motivasyon mektubu ve 5 AI önerisiyle başvurularınızı hazırlayın.",
    },
    en: {
      title: "Create Account — ViCareerAI",
      description: "Create a free ViCareerAI account. Get started with 2 resumes, 3 cover letters, and 5 AI content recommendations.",
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
      title: `${currentMeta.title}`,
      description: currentMeta.description,
      url: url,
    },
    twitter: {
      title: `${currentMeta.title}`,
      description: currentMeta.description,
    }
  };
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
