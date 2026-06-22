"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Briefcase,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Mic,
  Target,
  Route
} from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isEditorPage = pathname.includes('/cv/') && pathname.includes('/edit');
  const supabase = createClient();
  const t = useTranslations("Navigation");

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("cvHistory"), href: "/cv/history", icon: FileText },
    { name: t("letterHistory"), href: "/cover-letter/history", icon: FileText },
    { name: t("jobs"), href: "/jobs/discover", icon: Briefcase },
    { name: t("applications"), href: "/jobs/tracker", icon: Briefcase },
    { name: t("interview"), href: "/interview", icon: Mic, isSoon: true },
    { name: t("skills"), href: "/skills", icon: Target, isSoon: true },
    { name: t("roadmap"), href: "/roadmap", icon: Route, isSoon: true },
    { name: t("settings"), href: "/profile", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen w-full pt-16 bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 dark:border-slate-700 px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-brand-text">CareerAI</span>
            </Link>
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            <div className="text-xs font-semibold text-zinc-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-3 mt-4">
              {t("menuLabel")}
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href as "/dashboard" | "/cv/history" | "/cover-letter/history" | "/jobs/discover" | "/jobs/tracker" | "/profile" | "/interview" | "/skills" | "/roadmap"}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-white shadow-sm ring-1 ring-blue-500/10 dark:ring-white/5"
                      : "text-zinc-500 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800/50 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-blue-500 dark:text-blue-400" : ""}`} />
                  {item.name}
                  {item.isSoon && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 dark:text-yellow-400 px-1.5 py-0.5 rounded ml-2">
                      {t("soon")}
                    </span>
                  )}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout section */}
          <div className="border-t border-zinc-200 dark:border-slate-700 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" />
              {t("logout")}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center border-b border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 md:hidden">
          <button
            className="text-muted-foreground hover:text-foreground p-2 -ml-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 flex items-center gap-2 font-bold text-lg">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="gradient-brand-text">CareerAI</span>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto bg-zinc-50 dark:bg-[#09090B] ${isEditorPage ? 'p-2 md:p-4' : 'p-4 md:p-8'}`}>
          <div className={`mx-auto ${isEditorPage ? 'max-w-full' : 'max-w-6xl'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
