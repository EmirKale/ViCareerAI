"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("Landing");

  return (
    <section className="relative min-h-[max(884px,100dvh)] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 kinetic-gradient -z-10 opacity-50"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-20"></div>
      
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-level-1 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-label-caps text-blue-400 uppercase font-bold tracking-widest">
              {t("heroBadge")}
            </span>
          </div>
          
          <h1 className="font-display text-display leading-tight text-white glow-text">
            {t("heroTitle1")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("heroTitleHighlight")}
            </span>
          </h1>
          
          <p className="font-body-lg text-on-surface-variant max-w-xl">
            {t("heroDesc")}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/register">
              <button className="px-8 py-4 bg-primary-container text-on-primary-container rounded-xl font-bold font-h3 flex items-center gap-3 active:scale-95 transition-transform shadow-xl shadow-blue-500/20">
                {t("heroStart")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
            <Link href="#features">
              <button className="px-8 py-4 glass-level-1 text-white border border-white/10 rounded-xl font-bold font-h3 hover:bg-white/5 transition-all">
                {t("heroHowItWorks")}
              </button>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 pt-8 text-zinc-500">
            <div className="flex -space-x-3">
              <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-background object-cover" alt="user1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXCVj2nVdwSsp-HA24PeGSqKtBFoyT_SFbvQKp_KZmgdyhbdD38bLkGS0e11mMrBIRSPTr1iL5rJJdHMx_goOjz_TiiJInBbT9PeIKvTlyFBiRr5DaDBUtzQhmBI7WDFKWU4Qz8meL4SkqjIzzhHlp7zHpt6E1PYZxNip_xnm64CsWDxCSEEJkRHIHGw8eT7miUqPXLbpcHX1jqtSWXdtlp_hvOqgb4SZVP-5FW0332Jpl8oQLsESkjjDcCS2Vmyihq2MvSWHd6Pk5" />
              <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-background object-cover" alt="user2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS4QtDbS1pgejlIQb-SSPnUwrSPdkeiU6a6I7pEcsd8m5Kd8qjrIa5ac85-lFvg0QT-pIP-vvQgFV33G-iHcLnxRMuuuQnMDFLiQ1RWD7SQoU9zQeLg10rZTB-7pVyKtgXvtnGOaka_Bwl7qKGMmqRUfo3ypdyrhxiKB6Msg-Wzi8Phpk4tRJ30pOuIDddpwPhLR4hPOTq1ozZyZBFRuR0FTyJPgQTdjo8g18ALlEXB8aEvl2ZArFdjGktiGDFhXXN0jh3s36BvWeH" />
              <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-background object-cover" alt="user3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwNoViwMlBUdiJL2iOJTJro1ZxYcsmC3a0JqPRd1-26xwmClSbsuivyLe9vJMHfx9_TofqeJFLUmmYpD51XqEg3HUEtOMS1_AJnL89TSenNc-WSIBcJx457xM9nyPd8ccu94B-_gi3AODGpJnlS5LCCUnJsq8YSYYLsUass6olaMMii8DABI5JDL1zy2zmxuNma9ecWN1V-P6Yyj0JhsR3FbPs6qwd-50KY14WQYUYY8OPaKmWS_rsoLWkbh77QYbSP-Onf8bF-4U0" />
            </div>
            <span className="font-body-sm font-medium">{t("heroSocialProof")}</span>
          </div>
        </div>
        
        {/* Floating AI Brain Visual */}
        <div className="relative flex justify-center items-center">
          <div className="glass-level-2 w-full max-w-lg aspect-square rounded-[40px] relative overflow-hidden flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-30"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
              <Image priority width={500} height={500} className="w-full h-full object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]" alt="brain hologram" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwYocT5yDfRzW3qaficDXXtyMTt9M8ZrHNkwxSB03ob_ApNWafgEUsdjr_pgvsSLfGt8OUENFXzCLjB1mBq2C0oJ_8FskaRUXY6Y8m0LDyk7gFo1pllpblX6rKvmpk3DHKB4sH0EYT9esfm6GVHu2vUKK6wFLPcSDfP2bWymW0mzWc8vDtVastZWiMVtUmi0iv_eyv3FkaisoEQvOLbMiQqknln4m-NbEARDeI3BrQ08xgm_jEMv8vezVzg2S50q9zLer0TmGtdDns" />
              
              {/* Floating Glass Cards around the brain */}
              <div className="absolute top-10 left-10 glass-level-1 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 animate-pulse">
                <CheckCircle className="text-green-400 w-4 h-4" />
                <span className="text-xs font-mono text-zinc-300">{t("heroFloating1")}</span>
              </div>
              <div className="absolute bottom-12 right-6 glass-level-1 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="text-blue-400 w-4 h-4" />
                <span className="text-xs font-mono text-zinc-300">{t("heroFloating2")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
