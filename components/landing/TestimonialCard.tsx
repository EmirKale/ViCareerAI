"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

interface TestimonialProps {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  delay?: number;
}

export function TestimonialCard({ name, role, quote, avatar, delay = 0 }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="group relative h-full glass-panel p-6 md:p-8 rounded-[32px] shadow-xl hover:shadow-2xl hover:border-[#2563EB]/30 transition-all duration-300"
    >
      {/* Decorative Quote Icon */}
      <div className="absolute top-6 right-8 text-[#2563EB]/10 group-hover:text-[#2563EB]/20 transition-colors">
        <Quote className="h-16 w-16 fill-current" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-14 w-14 rounded-lg bg-[#131315] overflow-hidden ring-1 ring-white/10 shadow-md">
           <Image
             src={avatar}
             alt={name}
             fill
             className="object-cover transition-transform group-hover:scale-110 duration-500"
           />
        </div>
        <div className="space-y-0.5">
          <h3 className="font-bold text-base leading-tight text-gray-900 dark:text-white group-hover:text-[#2563EB] transition-colors">{name}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]/70 italic">{role}</p>
        </div>
      </div>

      <div className="flex gap-0.5 mb-4 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-current" />
        ))}
      </div>

      <p className="text-[#A1A1AA] text-sm leading-relaxed font-medium">
        &quot;{quote}&quot;
      </p>

      {/* Trust Badge Indicator */}
      <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
         <span className="text-[10px] font-bold text-[#A1A1AA]/60 flex items-center gap-1">
           <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
           VERIFIED SUCCESS
         </span>
      </div>
    </motion.div>
  );
}
