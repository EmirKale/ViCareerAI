"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function ComparisonTable() {
  const t = useTranslations("Comparison");
  
  const comparisonFeatures = [
    { feature: t("f1"), us: true, them: false },
    { feature: t("f2"), us: true, them: false },
    { feature: t("f3"), us: true, them: true }, // Generic AI can analyze text
    { feature: t("f4"), us: true, them: false },
    { feature: t("f5"), us: true, them: false },
    { feature: t("f6"), us: true, them: false },
    { feature: t("f7"), us: true, them: false }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-[40px] glass-panel shadow-2xl overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] grid grid-cols-[1.5fr,1fr,1fr] gap-px bg-white/[0.06]">
        {/* Header Row */}
        <div className="bg-[#131315] p-6 font-bold text-sm tracking-tight text-[#A1A1AA] uppercase">{t("headerFocus")}</div>
        <div className="bg-[#2563EB] p-6 flex flex-col items-center justify-center gap-2 group">
           <Sparkles className="h-5 w-5 text-white animate-pulse" />
           <span className="text-white font-black text-sm uppercase tracking-widest">{t("headerUs")}</span>
        </div>
        <div className="bg-[#131315] p-6 flex flex-col items-center justify-center font-bold text-sm text-[#A1A1AA] uppercase">{t("headerThem")}</div>

        {/* Feature Rows */}
        {comparisonFeatures.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="contents group/row"
          >
            {/* Feature Label */}
            <div className="bg-gray-100 dark:bg-[#1c1b1d] p-6 text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/[0.06] group-hover/row:bg-gray-200 dark:group-hover/row:bg-white/5 transition-colors">
              {item.feature}
            </div>
            
            {/* Our Status */}
            <div className="bg-[#2563EB]/10 p-6 flex items-center justify-center border-b border-white/[0.06]">
               <motion.div
                 initial={{ scale: 0 }}
                 whileInView={{ scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 + 0.3 }}
                 className="h-8 w-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-inner"
               >
                 <Check className="h-4 w-4 text-green-500 stroke-[4px]" />
               </motion.div>
            </div>

            {/* Their Status */}
            <div className="bg-[#1c1b1d] p-6 flex items-center justify-center border-b border-white/[0.06] group-hover/row:bg-white/5 transition-colors">
               {item.them ? (
                 <Check className="h-4 w-4 text-[#A1A1AA] stroke-[2px]" />
               ) : (
                 <X className="h-4 w-4 text-red-500/30 stroke-[2px]" />
               )}
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </div>
  );
}
