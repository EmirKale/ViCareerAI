import type { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  
  const siteUrl = "https://vi-career-ai.vercel.app";
  const url = `${siteUrl}/${locale}/login`;

  const meta = {
    tr: {
      title: "Giriş Yap — ViCareerAI",
      description: "ViCareerAI hesabınıza giriş yapın; kayıtlı CV'lerinizi, mektuplarınızı ve başvuru takibinizi yönetin.",
    },
    en: {
      title: "Log In — ViCareerAI",
      description: "Log in to your ViCareerAI account to access your saved resumes, cover letters, and application tracker.",
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

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
