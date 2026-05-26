"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface ATSScoreProps {
  score?: number;
  className?: string;
}

export function ATSScore({ score = 85, className = "" }: ATSScoreProps) {
  const t = useTranslations("ATS");
  
  // Calculate stroke-dashoffset for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-6 md:p-8 rounded-[32px] glass-panel shadow-2xl bg-white dark:bg-transparent ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Circular Progress */}
        <div className="relative flex items-center justify-center">
          <svg className="h-40 w-40 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-white/5"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#blue-gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: offset }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <motion.span 
               initial={{ opacity: 0, scale: 0.5 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.8 }}
               className="text-3xl font-black gradient-brand-text leading-none mb-0.5"
             >
               {score}%
             </motion.span>
             <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-[#A1A1AA] text-center px-2 leading-tight">{t("match")}</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                <Sparkles className="h-5 w-5" />
             </div>
             <div>
                <h4 className="font-bold text-lg leading-none mb-1 text-gray-900 dark:text-white">{t("aiSuggest")}</h4>
                <p className="text-xs text-gray-600 dark:text-[#A1A1AA]">{t("aiDesc")}</p>
             </div>
          </div>

          <div className="space-y-3">
             {[
               { icon: CheckCircle2, text: t("s1"), positive: true },
               { icon: TrendingUp, text: t("s2"), positive: true },
               { icon: AlertCircle, text: t("s3"), positive: false },
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ x: 20, opacity: 0 }}
                 whileInView={{ x: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 1 + i * 0.15 }}
                 className={`flex items-start gap-3 p-4 rounded-lg border transition-all hover:translate-x-1 ${
                   item.positive 
                   ? "bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20" 
                   : "bg-blue-50 dark:bg-[#2563EB]/5 border-blue-200 dark:border-[#2563EB]/20"
                 }`}
               >
                 <item.icon className={`h-5 w-5 shrink-0 ${item.positive ? "text-green-500" : "text-[#2563EB]"}`} />
                 <span className="text-sm font-medium text-gray-700 dark:text-white">{item.text}</span>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
