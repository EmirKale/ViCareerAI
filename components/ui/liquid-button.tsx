import React from "react";
import { cn } from "@/lib/utils";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function LiquidButton({ className, children, icon, ...props }: LiquidButtonProps) {
  return (
    <button
      className={cn(
        "group relative flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all duration-300",
        "bg-gradient-to-b from-white/80 to-white/30 dark:from-white/20 dark:to-white/5",
        "backdrop-blur-xl border border-white/40 dark:border-white/10",
        "text-zinc-800 dark:text-zinc-100",
        "shadow-[inset_0px_4px_8px_rgba(255,255,255,0.8),inset_0px_-4px_8px_rgba(0,0,0,0.05),0px_10px_20px_rgba(0,0,0,0.1)]",
        "dark:shadow-[inset_0px_4px_8px_rgba(255,255,255,0.2),inset_0px_-4px_8px_rgba(0,0,0,0.5),0px_10px_20px_rgba(0,0,0,0.5)]",
        "hover:shadow-[inset_0px_4px_8px_rgba(255,255,255,1),inset_0px_-4px_8px_rgba(0,0,0,0.05),0px_15px_25px_rgba(0,0,0,0.15)]",
        "hover:-translate-y-1 active:translate-y-0 active:scale-95",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
      
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
