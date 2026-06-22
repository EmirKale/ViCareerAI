"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Download, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const stepIcons = [
  { id: 1, icon: Upload, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-t-blue-500/50" },
  { id: 2, icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-t-purple-500/50" },
  { id: 3, icon: Download, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-t-cyan-500/50" }
];

export function ProcessSteps() {
  const t = useTranslations("ProcessSteps");
  
  return (
    <div className="grid gap-12 md:grid-cols-3 relative py-20">
      {stepIcons.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className={`relative group flex flex-col items-center text-center space-y-6 glass-panel p-8 md:p-10 rounded-[32px] border-t-2 ${step.border} hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500 overflow-hidden`}
        >
          {/* Subtle Background Number */}
          <div className="absolute -right-4 -bottom-4 text-9xl font-bold text-gray-100 dark:text-white/5 select-none pointer-events-none group-hover:text-blue-100 dark:group-hover:text-[#2563EB]/5 group-hover:-translate-y-2 transition-all duration-700">
             0{step.id}
          </div>

          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${step.bg} ${step.color} transform transition-transform group-hover:scale-110 duration-500 relative z-10`}>
            <step.icon className="h-10 w-10" />
          </div>

          <div className="space-y-3 relative z-10">
             <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t(`${step.id}_title`)}</h3>
             <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-[240px] mx-auto font-medium">
                {t(`${step.id}_desc`)}
             </p>
          </div>

          {/* Simple Arrow Indicator (Mobile only) */}
          <div className="md:hidden pt-4 opacity-20">
             <ArrowRight className="h-6 w-6 rotate-90" />
          </div>
        </motion.div>
      ))}
    </div>

  );
}
