import type { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  
  const siteUrl = "https://vi-career-ai.vercel.app";
  const url = `${siteUrl}/${locale}/pricing`;

  const meta = {
    tr: {
      title: "Fiyatlandırma",
      description: "ViCareerAI ile kariyerinize yatırım yapın. Size en uygun planı seçin ve AI destekli araçlarımızla öne çıkın.",
    },
    en: {
      title: "Pricing",
      description: "Invest in your career with ViCareerAI. Choose the best plan for you and stand out with our AI-powered tools.",
    }
  };

  const currentMeta = meta[locale as "en" | "tr"] || meta.tr;

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

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
