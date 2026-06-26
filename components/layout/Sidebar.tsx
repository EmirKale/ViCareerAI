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
      <header className="topbar flex items-center justify-between px-6 h-16 sticky top-0 z-50 bg-[#0A1628]/90 backdrop-blur-md border-b border-[#6FD6E8]/10 text-[#EAF3F7]">
        <div className="logo flex items-center gap-2.5 font-['Space_Grotesk'] font-semibold text-base">
          <span className="logo-mark w-7 h-7 border-[1.5px] border-[#6FD6E8] rounded-full flex items-center justify-center font-['JetBrains_Mono'] text-[11px] text-[#6FD6E8] shrink-0">
            Vi
          </span>
          ViCareerAI
          <span className="pro-badge font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#E8543C] border border-[#E8543C]/20 px-1.5 py-0.5 rounded-[2px] ml-1">
            PRO
          </span>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#8FB9CC] hover:text-[#6FD6E8]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="topbar-right hidden md:flex items-center gap-3.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link className="panel-btn flex items-center gap-2 font-['JetBrains_Mono'] text-xs tracking-wider bg-[#6FD6E8] text-[#0A1628] px-4 py-2 rounded-[2px] hover:opacity-90 transition-opacity" href="/dashboard">
            <LayoutDashboard className="w-4 h-4" />
            Panelim
          </Link>
        </div>
      </header>

      {/* ---------- SHELL ---------- */}
      <div className="shell-body flex relative z-[1] min-h-[calc(100vh-64px)]">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#0A1628]/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`sidebar fixed inset-y-0 left-0 z-50 w-[248px] shrink-0 bg-[#0E2038] border-r border-[#6FD6E8]/10 p-6 pt-6 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:flex`}
        >
          {isMobileMenuOpen && (
            <div className="flex justify-end mb-4 md:hidden">
              <button className="text-[#8FB9CC]" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          <div className="sidebar-eyebrow font-['JetBrains_Mono'] text-[11px] tracking-[0.14em] text-[#8FB9CC] px-3 mb-3.5">
            MENÜ
          </div>
          
          <nav className="nav-list flex flex-col gap-0.5 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm relative border-l-2 transition-colors ${
                    isActive
                      ? "text-[#EAF3F7] bg-[#6FD6E8]/5 border-[#E8543C] font-medium"
                      : "text-[#EAF3F7]/60 border-transparent hover:text-[#EAF3F7] hover:bg-white/5"
                  } ${item.isSoon ? "opacity-45 cursor-default pointer-events-none" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.6} />
                  {item.name}
                  {item.isSoon && (
                    <span className="nav-badge soon font-['JetBrains_Mono'] text-[9.5px] tracking-wider py-0.5 px-1.5 rounded-[2px] ml-auto text-[#E8543C] border border-[#E8543C]/20">
                      YAKINDA
                    </span>
                  )}
                  {item.isNew && (
                    <span className="nav-badge new font-['JetBrains_Mono'] text-[9.5px] tracking-wider py-0.5 px-1.5 rounded-[2px] ml-auto text-[#6FD6E8] border border-[#6FD6E8]/50">
                      YENİ
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-foot border-t border-[#6FD6E8]/10 pt-3.5 mt-2.5">
            <Link
              href="/profile"
              className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm relative border-l-2 transition-colors ${
                pathname.startsWith('/profile')
                  ? "text-[#EAF3F7] bg-[#6FD6E8]/5 border-[#E8543C] font-medium"
                  : "text-[#EAF3F7]/60 border-transparent hover:text-[#EAF3F7] hover:bg-white/5"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-[18px] h-[18px] shrink-0" strokeWidth={1.6} />
              {t("settings")}
            </Link>
            <button
              onClick={handleLogout}
              className="logout flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#E8543C] transition-colors hover:bg-white/5 rounded-[2px]"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.6} />
              {t("logout")}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`main flex-1 w-full ${isEditorPage ? 'p-0 max-w-none' : 'py-9 px-5 md:px-11 pb-16 max-w-[1320px]'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
