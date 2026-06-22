"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Globe, Cpu, Sparkles, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const t = useTranslations("Landing");

  return (
    <section id="features" className="py-24 px-6 relative bg-surface-container-lowest z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="font-h1 text-4xl md:text-5xl text-gray-900 dark:text-white">{t("featuresTitle")}</h2>
          <p className="text-on-surface-variant font-body-lg">{t("featuresDesc")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-level-1 p-8 rounded-[32px] group hover:bg-white/5 transition-all glow-border-purple relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20">
              <Globe className="text-blue-500 w-8 h-8" />
            </div>
            <h3 className="font-h3 text-2xl text-gray-900 dark:text-white mb-4">{t("f1Title")}</h3>
            <p className="text-zinc-400 font-body-md mb-6 leading-relaxed">{t("f1Desc")}</p>
            <Link className="text-blue-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all" href="#">
              {t("f1Link")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Feature 2 */}
          <div className="glass-level-1 p-8 rounded-[32px] group hover:bg-white/5 transition-all glow-border-purple relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 border border-purple-500/20">
              <Cpu className="text-purple-500 w-8 h-8" />
            </div>
            <h3 className="font-h3 text-2xl text-gray-900 dark:text-white mb-4">{t("f2Title")}</h3>
            <p className="text-zinc-400 font-body-md mb-6 leading-relaxed">{t("f2Desc")}</p>
            <Link className="text-purple-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all" href="#">
              {t("f2Link")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Feature 3 */}
          <div className="glass-level-1 p-8 rounded-[32px] group hover:bg-white/5 transition-all glow-border-purple relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/20">
              <Sparkles className="text-cyan-500 w-8 h-8" />
            </div>
            <h3 className="font-h3 text-2xl text-gray-900 dark:text-white mb-4">{t("f3Title")}</h3>
            <p className="text-zinc-400 font-body-md mb-6 leading-relaxed">{t("f3Desc")}</p>
            <Link className="text-cyan-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all" href="#">
              {t("f3Link")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
