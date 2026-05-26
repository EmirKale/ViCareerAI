"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, GraduationCap, Briefcase, Cpu, MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LiveCVPreview() {
  const t = useTranslations("Preview");
  return (
    <div className="relative w-full max-w-4xl mx-auto group">
      {/* Container with a "sheet of paper" look */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full glass-panel shadow-2xl rounded-[40px] overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Sidebar (Narrow) or Top Header (Mobile) */}
        <div className="w-full md:w-64 bg-black/20 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/[0.06]">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            {/* Minimalist Profile Picture */}
            <div className="h-24 w-24 rounded-lg bg-[#2563EB]/20 animate-pulse" />
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Johnathan Doe</h2>
              <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-wider">{t("role")}</p>
            </div>

            <div className="space-y-3 w-full pt-4 border-t border-white/[0.06]">
               {[
                 { icon: Mail, text: "hello@jdoe.design" },
                 { icon: Phone, text: "+1 (555) 123-4567" },
                 { icon: MapPin, text: "San Francisco, CA" },
                 { icon: Globe, text: "jdoe.design" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground group/info cursor-default">
                    <item.icon className="h-3.5 w-3.5 text-zinc-400 group-hover/info:text-blue-500 transition-colors" />
                    <span className="truncate">{item.text}</span>
                 </div>
               ))}
            </div>

            <div className="w-full pt-6 space-y-4 text-left">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]/60">{t("tech")}</h3>
               <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "Docker", "AWS", "TypeScript", "Python", "GraphQL"].map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[#1c1b1d] text-[#A1A1AA] text-[10px] font-medium border border-white/[0.06]">
                      {skill}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Main Content (Wide) */}
        <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto custom-scrollbar">
           {/* Professional Summary */}
           <section className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquarePlus className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#A1A1AA]">{t("exec")}</h3>
              </div>
              <p className="text-sm leading-relaxed text-[#A1A1AA]/90">
                {t("summary")}
              </p>
           </section>

           {/* Professional Experience */}
           <section className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#A1A1AA]">{t("work")}</h3>
              </div>

              {[
                {
                  role: t("r1"),
                  company: "FinTech Global",
                  date: "2021 — PRESENT",
                  desc: t("d1")
                },
                {
                  role: t("r2"),
                  company: "Streamly Inc",
                  date: "2018 — 2021",
                  desc: t("d2")
                }
              ].map((job, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-white/[0.06] group/job">
                   <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#131315] border-4 border-[#1c1b1d] group-hover/job:border-[#2563EB] transition-colors" />
                   <div className="flex flex-col md:flex-row md:justify-between items-start mb-2 group-hover/job:-translate-y-0.5 transition-transform">
                      <h4 className="font-bold text-base leading-tight text-gray-900 dark:text-white">{job.role}</h4>
                      <span className="text-[10px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-2 py-1 rounded-md">{job.date}</span>
                   </div>
                   <p className="text-xs font-medium text-[#A1A1AA] mb-2">{job.company}</p>
                   <p className="text-sm text-[#A1A1AA]/90 leading-normal">{job.desc}</p>
                </div>
              ))}
           </section>

           {/* Education */}
           <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#A1A1AA]">{t("edu")}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 rounded-lg border border-white/[0.06] bg-[#131315] hover:border-[#2563EB]/30 transition-all">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("cs")}</h4>
                    <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold">Stanford University · 2018</p>
                 </div>
                 <div className="p-4 rounded-lg border border-white/[0.06] bg-[#131315] hover:border-[#2563EB]/30 transition-all">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("ds")}</h4>
                    <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold">RISD · 2014</p>
                 </div>
              </div>
           </section>
        </div>
      </motion.div>

      {/* Trust Signal / "AI Generated" Tag */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="absolute -top-4 -right-4 z-20"
      >
        <div className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-bold text-xs shadow-xl flex items-center gap-2 border border-[#2563EB]/20">
           <Cpu className="h-3.5 w-3.5" />
           <span>{t("ai")}</span>
        </div>
      </motion.div>

      {/* Background Decorative Element */}
      <div className="absolute -inset-4 bg-blue-500/10 dark:bg-blue-500/5 blur-[60px] rounded-[3rem] -z-10 group-hover:bg-blue-500/20 transition-all duration-700" />
    </div>
  );
}
