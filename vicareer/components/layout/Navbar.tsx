"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

import { useTranslations } from "next-intl";

export default function Navbar() {
    const t = useTranslations("Navigation");
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
            
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("plan")
                    .eq("id", user.id)
                    .single();
                
                setIsPro(profile?.plan === 'pro');
            }
        };

        fetchUserAndProfile();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
            if (session?.user) {
                fetchUserAndProfile();
            } else {
                setIsPro(false);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, [supabase]);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
                    ? "glass-card py-3 border-b border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo & Brand */}
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2.5 group transition-all hover:opacity-90">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105 group-active:scale-95">
                            <Sparkles className="h-4.5 w-4.5 text-white" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tight gradient-brand-text">CareerAI</span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50">Next-Gen Resume</span>
                        </div>
                        {isLoggedIn && isPro && (
                            <Badge variant="secondary" className="ml-2 bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px] font-black py-0 px-2 h-5 flex items-center gap-1 animate-in fade-in zoom-in duration-500">
                                <Sparkles className="h-2.5 w-2.5" /> PRO
                            </Badge>
                        )}
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {[
                          { name: t("features"), href: "/#features" },
                          { name: t("pricing"), href: "/pricing" }
                        ].map((link) => (
                          <Link 
                            key={link.name} 
                            href={link.href} 
                            className="text-sm font-semibold text-muted-foreground/80 transition-colors hover:text-foreground relative group/link"
                          >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover/link:w-full" />
                          </Link>
                        ))}
                    </nav>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button size="sm" className="h-10 px-5 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
                                <LayoutDashboard className="mr-2 h-4 w-4" /> {t("dashboard")}
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                             <Link href="/login">
                                <Button variant="ghost" size="sm" className="h-10 px-4 font-bold text-muted-foreground hover:text-foreground transition-colors">
                                  {t("login")}
                                </Button>
                             </Link>
                             <Link href="/register">
                                <Button
                                    size="sm"
                                    className="h-10 px-6 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    {t("register")}
                                </Button>
                             </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu & Theme Toggle */}
                <div className="flex md:hidden items-center gap-3">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <button
                        className="rounded-xl p-2.5 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-90"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="md:hidden glass-card border-t border-white/5 overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col gap-2 p-6">
                            {[
                              { name: t("features"), href: "/#features" },
                              { name: t("pricing"), href: "/pricing" }
                            ].map((link) => (
                                <Link 
                                  key={link.name}
                                  href={link.href} 
                                  className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 font-bold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                  onClick={() => setMenuOpen(false)}
                                >
                                    {link.name}
                                    <Sparkles className="h-4 w-4 text-zinc-300 dark:text-zinc-700" />
                                </Link>
                            ))}
                            
                            <div className="pt-4 mt-2 flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800">
                                {isLoggedIn ? (
                                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                                        <Button className="w-full h-14 rounded-2xl gradient-brand text-white font-bold text-lg">
                                            <LayoutDashboard className="mr-2 h-5 w-5" /> {t("dashboard")}
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link href="/login" onClick={() => setMenuOpen(false)}>
                                            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold text-lg border-2">{t("login")}</Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setMenuOpen(false)}>
                                            <Button className="w-full h-14 rounded-2xl gradient-brand text-white font-bold text-lg shadow-lg shadow-blue-500/20">{t("register")}</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

