"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./landing.module.css";
import { useReducedMotion } from "framer-motion";

export default function Home() {
  const t = useTranslations("Blueprint");
  const p = useTranslations("Pricing");
  const tIndex = useTranslations("Index");
  const reduceMotion = useReducedMotion();

  const gridFieldRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const revealRefs = useRef<(HTMLElement | SVGElement | null)[]>([]);
  const counterRefs = useRef<(HTMLElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Scroll logic
  const handleScroll = useCallback(() => {
    const h = document.documentElement;
    const scrollPercent = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${scrollPercent}%`;
    }

    if (!reduceMotion && gridFieldRef.current) {
      gridFieldRef.current.style.transform = `translateY(${h.scrollTop * -0.06}px)`;
    }

    setScrolled(h.scrollTop > 40);
  }, [reduceMotion]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Intersection Observers for Reveals, Counters, and Ruler Nav
  useEffect(() => {
    // Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

    revealRefs.current.forEach((el) => {
      if (el) revealObserver.observe(el);
    });

    // Counter Observer
    const counted = new WeakSet();
    const animateCounter = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.target || "0");
      const suffix = el.dataset.suffix || "";
      const dur = reduceMotion ? 0 : 1200;
      let start: number | null = null;
      
      const step = (ts: number) => {
        if (start === null) start = ts;
        const progress = dur === 0 ? 1 : Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(target * eased);
        el.textContent = val + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          counted.add(entry.target);
          animateCounter(entry.target as HTMLElement);
        }
      });
    }, { threshold: 0.5 });

    counterRefs.current.forEach((el) => {
      if (el) counterObserver.observe(el);
    });

    // Section Observer for Ruler Nav
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    sectionRefs.current.forEach((el) => {
      if (el) sectionObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [reduceMotion]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const setRevealRef = (el: HTMLElement | SVGElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };
  const setCounterRef = (el: HTMLElement | null) => {
    if (el && !counterRefs.current.includes(el)) counterRefs.current.push(el);
  };
  const setSectionRef = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  // Split hero title into chars for animation
  const heroTitleText = t("heroTitle");
  const heroChars = heroTitleText.split("").map((ch, i) => (
    <span
      key={i}
      className={styles.char}
      style={{
        transitionDelay: `${i * 28}ms`,
        transition: 'opacity .55s ease, transform .55s cubic-bezier(.2,.8,.2,1)',
      }}
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));

  // Trigger char animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const chars = document.querySelectorAll(`.${styles.hero} h1 .${styles.char}`);
      chars.forEach((c) => {
        (c as HTMLElement).style.opacity = "1";
        (c as HTMLElement).style.transform = "translateY(0)";
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ViCareerAI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'GPT-4o destekli AI ile ATS onaylı CV, motivasyon mektubu, skill gap analizi ve kariyer yol haritası oluşturan platform.',
    url: 'https://vi-career-ai.vercel.app',
    offers: [
      {
        '@type': 'Offer',
        name: 'Başlangıç',
        price: '0',
        priceCurrency: 'TRY',
      },
      {
        '@type': 'Offer',
        name: 'Sınırsız Pro',
        price: '299',
        priceCurrency: 'TRY',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          billingDuration: 'P1M',
        },
      },
    ],
  };

  return (
    <div className={styles.blueprintWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.gridField} ref={gridFieldRef}></div>
      <div className={styles.gridVignette}></div>
      <div className={styles.progressBar} ref={progressBarRef}></div>

      <div className={styles.rulerNav}>
        {[
          { id: "hero", label: t("rulerHero") },
          { id: "features", label: t("rulerFeatures") },
          { id: "stats", label: t("rulerStats") },
          { id: "process", label: t("rulerProcess") },
          { id: "revision", label: t("rulerRevision") },
          { id: "pricing", label: t("rulerPricing") },
          { id: "cta", label: t("rulerCta") },
        ].map((item) => (
          <div
            key={item.id}
            className={`${styles.rulerTick} ${activeSection === item.id ? styles.active : ""}`}
            onClick={() => scrollToSection(item.id)}
          >
            <span className={styles.tickLabel}>{item.label}</span>
            <span className={styles.tickMark}></span>
          </div>
        ))}
      </div>

      <section className={`${styles.section} ${styles.hero}`} id="hero" ref={setSectionRef}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>{t("heroEyebrow")}</div>
          <h1>{heroChars}</h1>
          <p className={styles.lede}>{t("heroLede")}</p>
          <div className={styles.heroActions}>
            <Link className={styles.stampBtn} href="/register">{t("heroCta")}</Link>
            <span className={styles.heroNote}>{t("heroNote")}</span>
          </div>
          <div className={styles.scrollCue}><span className={styles.line}></span>{t("scrollCue")}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.features}`} id="features" ref={setSectionRef}>
        <div className={`${styles.featuresHead} ${styles.fadeUp}`} ref={setRevealRef}>
          <div className={styles.eyebrow}>{t("featuresEyebrow")}</div>
          <h2>{t("featuresTitle")}</h2>
        </div>
        <div className={styles.featuresGrid}>
          {[
            { title: t("f1Title"), desc: t("f1Desc"), path: "M3 4h18l-7 9v6l-4 2v-8L3 4z" },
            { title: t("f2Title"), desc: t("f2Desc"), path: "M13 2L4 14h7l-1 8 9-12h-7l1-8z" },
            { title: t("f3Title"), desc: t("f3Desc"), path: "M14.5 14.5L20 20", extra: <><circle cx="10" cy="10" r="6"/><path d="M10 7v6M7 10h6" strokeDasharray="2 2"/></> },
            { title: t("f4Title"), desc: t("f4Desc"), path: "M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" },
          ].map((feature, i) => (
            <div key={i} className={`${styles.featureCell} ${styles.bpCard} ${styles.fadeUp}`} ref={setRevealRef}>
              <svg className={styles.corners} viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M2,20 L2,2 L20,2"/><path d="M80,2 L98,2 L98,20"/>
                <path d="M98,80 L98,98 L80,98"/><path d="M20,98 L2,98 L2,80"/>
              </svg>
              <div className={styles.featureTitleWrapper}>
                <h3>{feature.title}</h3>
                <svg className={styles.ficon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d={feature.path}/>
                  {feature.extra}
                </svg>
              </div>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.stats}`} id="stats" ref={setSectionRef}>
        <div className={`${styles.statsHead} ${styles.fadeUp}`} ref={setRevealRef}>
          <div className={styles.eyebrow}>{t("statsEyebrow")}</div>
          <h2>{t("statsTitle")}</h2>
        </div>
        <div className={styles.statsGrid}>
          {[
            { target: "85", suffix: "%", label: t("s1Label") },
            { target: "2", suffix: " dk", label: t("s2Label") },
            { target: "6", suffix: "", label: t("s3Label") },
            { target: "100", suffix: "%", label: t("s4Label") },
          ].map((stat, i) => (
            <div key={i} className={`${styles.statBlock} ${styles.fadeUp}`} ref={setRevealRef}>
              <div className={styles.dimLine}><span className={styles.cap}></span><span className={styles.bar}></span></div>
              <div className={styles.statNum}><span className={styles.counter} data-target={stat.target} data-suffix={stat.suffix} ref={setCounterRef}>0{stat.suffix}</span></div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.process}`} id="process" ref={setSectionRef}>
        <div className={`${styles.processHead} ${styles.fadeUp}`} ref={setRevealRef}>
          <div className={styles.eyebrow}>{t("processEyebrow")}</div>
          <h2>{t("processTitle")}</h2>
        </div>
        <div className={styles.processSteps}>
          {[
            { num: t("p1Num"), title: t("p1Title"), desc: t("p1Desc") },
            { num: t("p2Num"), title: t("p2Title"), desc: t("p2Desc") },
            { num: t("p3Num"), title: t("p3Title"), desc: t("p3Desc") },
          ].map((step, i) => (
            <div key={i} className={`${styles.pstep} ${styles.fadeUp}`} ref={setRevealRef}>
              <span className={styles.pnum}>{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.revision}`} id="revision" ref={setSectionRef}>
        <div className={`${styles.revisionHead} ${styles.fadeUp}`} ref={setRevealRef}>
          <div className={styles.eyebrow}>{t("revEyebrow")}</div>
          <h2>{t("revTitle")}</h2>
        </div>
        <div className={`${styles.revGrid} ${styles.fadeUp}`} ref={setRevealRef}>
          <div className={`${styles.revPanel} ${styles.before}`}>
            <span className={styles.ptag}>{t("revBeforeTag")}</span>
            <p>
              {t("revBeforeP1")}<span className={styles.wavy}>{t("revBeforeW1")}</span>
              {t("revBeforeP2")}<span className={styles.wavy}>{t("revBeforeW2")}</span>{t("revBeforeP3")}
            </p>
          </div>
          <div className={`${styles.revPanel} ${styles.after}`}>
            <span className={styles.ptag}>{t("revAfterTag")}</span>
            <p>
              {t("revAfterP1")}<span className={styles.mark}>{t("revAfterM1")}<sup>①</sup></span>
              {t("revAfterP2")}<span className={styles.mark}>{t("revAfterM2")}<sup>②</sup></span>
              {t("revAfterP3")}<span className={styles.mark}>{t("revAfterM3")}<sup>③</sup></span>{t("revAfterP4")}
            </p>
          </div>
        </div>
        <div className={`${styles.revLegend} ${styles.fadeUp}`} ref={setRevealRef}>
          <div><span className={styles.n}>①</span>{t("revL1")}</div>
          <div><span className={styles.n}>②</span>{t("revL2")}</div>
          <div><span className={styles.n}>③</span>{t("revL3")}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.pricingSection}`} id="pricing" ref={setSectionRef}>
        <div className={`${styles.pricingHead} ${styles.fadeUp}`} ref={setRevealRef}>
          <div className={styles.eyebrow}>{p("eyebrow")}</div>
          <h2>{p("miniTitle")}</h2>
        </div>
        <div className={styles.pricingGrid}>
          {/* Free Plan */}
          <div className={`${styles.priceCard} ${styles.fadeUp}`} ref={setRevealRef}>
            <svg className={styles.corners} viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M2,20 L2,2 L20,2"/><path d="M80,2 L98,2 L98,20"/>
                <path d="M98,80 L98,98 L80,98"/><path d="M20,98 L2,98 L2,80"/>
            </svg>
            <div className={styles.ptier}>{p("essential").toUpperCase()}</div>
            <div className={styles.ptagLine}>{p("kickstart")}</div>
            <div className={styles.pamount}>
                <span className={styles.num}>{tIndex("freePrice")}</span>
                <span className={styles.per}>{tIndex("perMonth")}</span>
            </div>
            <ul>
                <li>{p("f1")}</li>
                <li>{p("f2")}</li>
                <li>{p("f3")}</li>
                <li>{p("f4")}</li>
            </ul>
            <Link href="/register" className={styles.pbtn}>{p("getStarted").toUpperCase()}</Link>
          </div>

          {/* Pro Plan */}
          <div className={`${styles.priceCard} ${styles.popular} ${styles.fadeUp}`} ref={setRevealRef}>
            <span className={styles.popularTag}>{p("mostPopular")}</span>
            <svg className={styles.corners} viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M2,20 L2,2 L20,2"/><path d="M80,2 L98,2 L98,20"/>
                <path d="M98,80 L98,98 L80,98"/><path d="M20,98 L2,98 L2,80"/>
            </svg>
            <div className={styles.ptier}>{p("pro").toUpperCase()}</div>
            <div className={styles.ptagLine}>{p("proSubtitle")}</div>
            <div className={styles.pamount}>
                <span className={styles.num}>{tIndex("proPrice")}</span>
                <span className={styles.per}>{tIndex("perMonth")}</span>
            </div>
            <ul>
                <li>{p("f_p_1")}</li>
                <li>{p("f_p_2")}</li>
                <li>{p("f_p_3")}</li>
                <li>{p("f_p_4")}</li>
            </ul>
            <Link href="/pricing" className={styles.pbtn}>{p("upgrade").toUpperCase()}</Link>
          </div>
        </div>
        <div className={`${styles.pricingLink} ${styles.fadeUp}`} ref={setRevealRef}>
          <Link href="/pricing">{p("compareAll")}</Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.ctaSection}`} id="cta" ref={setSectionRef}>
        <svg className={`${styles.stampGraphic} ${styles.fadeUp}`} viewBox="0 0 200 200" ref={setRevealRef}>
          <defs>
            <path id="stampCircle" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"/>
          </defs>
          <circle cx="100" cy="100" r="92" fill="none" stroke="var(--stamp)" strokeWidth="2"/>
          <circle cx="100" cy="100" r="78" fill="none" stroke="var(--stamp)" strokeWidth="1" strokeDasharray="3 4"/>
          <text fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fill="var(--stamp)" letterSpacing="2">
            <textPath href="#stampCircle" startOffset="0%">{t("ctaStamp")}</textPath>
          </text>
          <path d="M70,102 L92,124 L132,78" fill="none" stroke="var(--stamp)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className={styles.fadeUp} ref={setRevealRef}>{t("ctaTitle")}</h2>
        <p className={styles.fadeUp} ref={setRevealRef}>{t("ctaDesc")}</p>
        <Link className={`${styles.stampBtn} ${styles.fadeUp}`} href="/register" ref={setRevealRef}>{t("ctaBtn")}</Link>
        <div className={styles.trustRow}>
          <span>{t("trust1")}</span><span>{t("trust2")}</span><span>{t("trust3")}</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}><span className={styles.logoMark}>Vi</span>ViCareerAI</div>
          <p>{t("footerDesc")}</p>
        </div>
        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <h4>{t("footerPlatform")}</h4>
            <Link href="#features">{t("navFeatures")}</Link>
            <Link href="#pricing">{t("navPricing")}</Link>
            <Link href="/templates">{t("footerTemplates")}</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>{t("footerLegal")}</h4>
            <Link href="/privacy">{t("footerPrivacy")}</Link>
            <Link href="/terms">{t("footerTerms")}</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>{t("footerRights")}</div>
      </footer>
    </div>
  );
}
