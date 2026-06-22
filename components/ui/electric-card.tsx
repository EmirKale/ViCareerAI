"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface ElectricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "orange" | "blue" | "indigo" | "emerald";
  glowIntensity?: "low" | "medium" | "high";
}

export function ElectricCard({ 
  children, 
  className, 
  color = "orange", 
  glowIntensity = "medium",
  ...props 
}: ElectricCardProps) {
  const id = useId();
  const filterId = `electric-noise-${id}`;

  const colors = {
    orange: "border-orange-500 shadow-orange-500/50",
    blue: "border-blue-500 shadow-blue-500/50",
    indigo: "border-indigo-500 shadow-indigo-500/50",
    emerald: "border-emerald-500 shadow-emerald-500/50",
  };

  const glows = {
    orange: "shadow-[0_0_15px_rgba(249,115,22,0.6)]",
    blue: "shadow-[0_0_15px_rgba(59,130,246,0.6)]",
    indigo: "shadow-[0_0_15px_rgba(99,102,241,0.6)]",
    emerald: "shadow-[0_0_15px_rgba(16,185,129,0.6)]",
  };

  return (
    <div className={cn("relative group p-6 rounded-2xl bg-zinc-950 overflow-hidden", className)} {...props}>
      {/* SVG Filter Definition */}
      <svg className="w-0 h-0 absolute" aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="1" result="noise">
            <animate attributeName="baseFrequency" values="0.04 0.08; 0.06 0.12; 0.04 0.08" dur="1.5s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      {/* Electric Border Layer */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl border-[2px] pointer-events-none transition-all duration-700",
          colors[color],
          glows[color]
        )}
        style={{ filter: `url(#${filterId})` }}
      />
      
      {/* Inner Glow to make it look smooth and cinematic */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl border pointer-events-none opacity-50",
          colors[color].split(" ")[0]
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
