"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LayoutDashboard, Map, Brain, Target } from "lucide-react";

export default function MobileBottomNav() {
  const t = useTranslations("Landing");

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 flex justify-around items-center px-4 py-2 z-50">
      <Link href="/" className="flex flex-col items-center justify-center text-blue-500 bg-blue-500/10 rounded-xl px-4 py-2 active:scale-90 transition-transform">
        <LayoutDashboard className="w-5 h-5 mb-1" />
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">{t("navHome")}</span>
      </Link>
      
      <Link href="/roadmap" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-2 hover:text-blue-400 transition-all active:scale-90">
        <Map className="w-5 h-5 mb-1" />
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">{t("navRoadmap")}</span>
      </Link>
      
      <Link href="/interview" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-2 hover:text-blue-400 transition-all active:scale-90">
        <Brain className="w-5 h-5 mb-1" />
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">{t("navInterview")}</span>
      </Link>
      
      <Link href="/skills" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-2 hover:text-blue-400 transition-all active:scale-90">
        <Target className="w-5 h-5 mb-1" />
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">{t("navSkills")}</span>
      </Link>
    </div>
  );
}
