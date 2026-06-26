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
                className="icon-btn uppercase font-bold"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Switch Language"
            >
                {locale}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-32 origin-top-right rounded-[var(--dashboard-radius)] bg-[var(--dashboard-bg-2)] shadow-xl border border-[var(--dashboard-paper-border)] z-50 overflow-hidden"
                    >
                        <div className="py-1">
                            <button
                                onClick={() => switchLocale("tr")}
                                className={`block w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${
                                    locale === "tr" 
                                        ? "bg-[rgba(111,214,232,0.1)] text-[var(--dashboard-cyan)]" 
                                        : "text-[var(--dashboard-text-dim)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--dashboard-text)]"
                                }`}
                            >
                                Türkçe
                            </button>
                            <button
                                onClick={() => switchLocale("en")}
                                className={`block w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors border-t border-[var(--dashboard-paper-border)] ${
                                    locale === "en" 
                                        ? "bg-[rgba(111,214,232,0.1)] text-[var(--dashboard-cyan)]" 
                                        : "text-[var(--dashboard-text-dim)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--dashboard-text)]"
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
