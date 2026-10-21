"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  FileText,
  Briefcase,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Mic,
  Target,
  Route,
  Search,
  CheckCircle,
  HelpCircle
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
    { name: t("jobs"), href: "/jobs/discover", icon: Search },
    { name: t("applications"), href: "/jobs/tracker", icon: CheckCircle },
    { name: t("interview"), href: "/interview", icon: Mic, isSoon: true },
    { name: t("skills"), href: "/skills", icon: Target, isNew: true },
    { name: t("roadmap"), href: "/roadmap", icon: Route, isNew: true },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="dashboard-theme">
      {/* ---------- TOPBAR ---------- */}
      <header className="topbar flex items-center justify-between px-6 h-16 sticky top-0 z-50 bg-[#F4F1EA] border-b-2 border-[#111111] text-[#111111]">
        <div className="logo flex items-center gap-2.5 font-['Archivo_Narrow'] font-bold text-lg uppercase tracking-tight">
          <span className="logo-mark w-7 h-7 border-2 border-[#111111] bg-white flex items-center justify-center font-['JetBrains_Mono'] text-[11px] font-bold text-[#111111] shrink-0">
            Vi
          </span>
          ViCareerAI
          <span className="pro-badge font-['JetBrains_Mono'] text-[10px] tracking-wider text-[#1849A9] border border-[#1849A9] bg-[#1849A9]/10 px-1.5 py-0.5 rounded-[0px] font-bold ml-1.5">
            PRO
          </span>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#4A4742] hover:text-[#111111]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="topbar-right hidden md:flex items-center gap-3.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link className="panel-btn flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-bold tracking-wider bg-[#1849A9] text-white px-4 py-2 rounded-[0px] border border-[#111111] hover:bg-[#123782] transition-colors" href="/dashboard">
            <LayoutDashboard className="w-4 h-4" />
            Panelim
          </Link>
        </div>
      </header>

      {/* ---------- SHELL ---------- */}
      <div className="shell-body flex relative z-[1] min-h-[calc(100vh-64px)] bg-[#F4F1EA]">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#111111]/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`sidebar fixed inset-y-0 left-0 z-50 w-[248px] shrink-0 bg-[#EAE6DC] border-r border-[#D3CDC2] p-4 pt-6 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:flex`}
        >
          {isMobileMenuOpen && (
            <div className="flex justify-end mb-4 md:hidden">
              <button className="text-[#4A4742]" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          <div className="sidebar-eyebrow font-['JetBrains_Mono'] text-[11px] font-bold tracking-[0.14em] text-[#757169] uppercase px-3 mb-3.5">
            MENÜ
          </div>
          
          <nav className="nav-list flex flex-col gap-0.5 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href as React.ComponentProps<typeof Link>["href"]}
                  className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-[0px] text-sm relative border-l-4 transition-colors ${
                    isActive
                      ? "text-[#111111] bg-white border-[#1849A9] font-bold shadow-sm"
                      : "text-[#4A4742] border-transparent hover:text-[#111111] hover:bg-white/60"
                  } ${item.isSoon ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                  {item.name}
                  {item.isSoon && (
                    <span className="nav-badge soon font-['JetBrains_Mono'] text-[9.5px] tracking-wider py-0.5 px-1.5 rounded-[0px] ml-auto text-[#757169] border border-[#D3CDC2] bg-white/70">
                      YAKINDA
                    </span>
                  )}
                  {item.isNew && (
                    <span className="nav-badge new font-['JetBrains_Mono'] text-[9.5px] tracking-wider py-0.5 px-1.5 rounded-[0px] ml-auto text-[#1849A9] border border-[#1849A9] bg-[#1849A9]/10 font-bold">
                      YENİ
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-foot border-t border-[#D3CDC2] pt-3.5 mt-2.5">
            <Link
              href="/profile"
              className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-[0px] text-sm relative border-l-4 transition-colors ${
                pathname.startsWith('/profile')
                  ? "text-[#111111] bg-white border-[#1849A9] font-bold shadow-sm"
                  : "text-[#4A4742] border-transparent hover:text-[#111111] hover:bg-white/60"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
              {t("settings")}
            </Link>
            <button
              onClick={handleLogout}
              className="logout flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#A32020] hover:bg-[#A32020]/10 rounded-[0px] font-medium transition-colors"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
              {t("logout")}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`main flex-1 w-full bg-[#F4F1EA] text-[#111111] ${isEditorPage ? 'p-0 max-w-none' : 'py-8 px-5 md:px-10 pb-16 max-w-[1320px]'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
