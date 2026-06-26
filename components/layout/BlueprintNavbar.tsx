"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import styles from "./blueprint-navbar.module.css";

export default function BlueprintNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Blueprint");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on Dashboard and Auth pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/cv/") || pathname.startsWith("/cover-letter/") || pathname.startsWith("/jobs/") || pathname === "/profile" || pathname === "/login" || pathname === "/register" || pathname === "/interview" || pathname === "/skills" || pathname === "/roadmap") {
    return null;
  }

  // Determine if we are on the landing page
  const isLanding = pathname === "/";

  // Navigation target logic
  const getHref = (hash: string) => isLanding ? hash : `/${hash}`;

  return (
    <nav className={`${styles.topnav} ${scrolled ? styles.scrolled : ""}`}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoMark}>Vi</span>ViCareerAI
      </Link>
      <div className={styles.navLinks}>
        <Link href={getHref("#features")}>{t("navFeatures")}</Link>
        <Link href={getHref("#process")}>{t("navProcess")}</Link>
        <Link href={getHref("#pricing")}>{t("navPricing")}</Link>
        <Link href="/login">{t("navLogin")}</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <LanguageSwitcher />
        <Link className={styles.navCta} href="/register">{t("navCta")}</Link>
      </div>
    </nav>
  );
}
