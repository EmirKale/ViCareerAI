"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const switchLocale = (newLocale: "en" | "tr") => {
        router.replace(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                className="flex items-center justify-center rounded-xl p-2.5 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-90"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Switch Language"
            >
                <Globe className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                <span className="ml-2 text-xs font-bold uppercase text-muted-foreground">{locale}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-32 origin-top-right rounded-2xl bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden"
                    >
                        <div className="py-1">
                            <button
                                onClick={() => switchLocale("tr")}
                                className={`block w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${
                                    locale === "tr" 
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                }`}
                            >
                                Türkçe
                            </button>
                            <button
                                onClick={() => switchLocale("en")}
                                className={`block w-full text-left px-4 py-2.5 text-sm font-bold transition-colors border-t border-zinc-100 dark:border-zinc-800/50 ${
                                    locale === "en" 
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                }`}
                            >
                                English
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
