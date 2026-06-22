"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNavBar() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const navItems = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("cvHistory"), href: "/cv/history", icon: FileText },
    { name: "New", href: "/cv/new", icon: PlusCircle, isAction: true },
    { name: t("jobs"), href: "/jobs/discover", icon: Briefcase },
    { name: t("settings"), href: "/profile", icon: Settings },
  ];

  return (
    <div className="bottom-nav lg:hidden safe-area-bottom">
      <div className="mx-3 mb-3">
        <div className="flex items-center justify-around bg-[#1c1b1d]/90 backdrop-blur-2xl border border-white/[0.06] rounded-2xl px-2 py-2 shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (item.isAction) {
              return (
                <Link
                  key={item.href}
                  href={item.href as "/cv/new"}
                  className="relative -mt-6"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-lg shadow-blue-500/30 border-4 border-[#131315]"
                  >
                    <item.icon className="h-6 w-6 text-white" />
                  </motion.div>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href as "/dashboard" | "/cv/history" | "/jobs/discover" | "/profile"}
                className="flex flex-col items-center gap-1 min-w-[56px] py-1"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-[#2563EB]/10"
                      : "bg-transparent"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-[#2563EB]" : "text-[#A1A1AA]/60"
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    isActive ? "text-[#2563EB]" : "text-[#A1A1AA]/40"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
