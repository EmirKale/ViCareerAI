"use client";

import { ElectricCard } from "@/components/ui/electric-card";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Sparkles, Moon, User } from "lucide-react";

export default function UIDemoPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-12 flex flex-col items-center justify-center gap-20">
      
      {/* Electric Border Demo */}
      <section className="space-y-8 text-center w-full max-w-4xl">
        <h2 className="text-4xl font-bold">Electric Border</h2>
        <p className="text-zinc-400">Dynamic SVG Borders • Cinematic Glow</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <ElectricCard color="orange" className="h-[400px] flex flex-col justify-end p-8">
            <span className="bg-zinc-900 border border-zinc-800 text-xs px-3 py-1 rounded-full w-fit mb-auto">PIXELFLOW</span>
            <h3 className="text-2xl font-bold mb-2">Electric Border</h3>
            <p className="text-zinc-400 text-sm">Copy-paste ready animation built for modern web interfaces...</p>
          </ElectricCard>
          
          <ElectricCard color="blue" className="h-[400px] flex flex-col justify-end p-8">
            <span className="bg-zinc-900 border border-zinc-800 text-xs px-3 py-1 rounded-full w-fit mb-auto">PIXELFLOW</span>
            <h3 className="text-2xl font-bold mb-2">Electric Border</h3>
            <p className="text-zinc-400 text-sm">Copy-paste ready animation built for modern web interfaces...</p>
          </ElectricCard>
        </div>
      </section>

      {/* Liquid Button Demo */}
      <section className="space-y-8 text-center w-full max-w-4xl py-20 bg-zinc-200 dark:bg-zinc-900 rounded-3xl">
        <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">Liquid Button</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10 p-10">
            <div className="bg-white/20 p-8 rounded-[40px] shadow-2xl backdrop-blur-xl border border-white/50 flex flex-col gap-4">
                <LiquidButton icon={<Moon className="w-5 h-5" />}>
                Sleep
                </LiquidButton>
                <LiquidButton icon={<Sparkles className="w-5 h-5" />}>
                Do Not Disturb
                </LiquidButton>
                <LiquidButton icon={<User className="w-5 h-5" />}>
                Personal
                </LiquidButton>
            </div>
        </div>
      </section>

    </div>
  );
}
