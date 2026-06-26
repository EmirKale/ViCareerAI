"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "@/i18n/routing";
import styles from "./pricing.module.css";
import { Link } from "@/i18n/routing";

export default function PricingPage() {
    const t = useTranslations("Index");
    const p = useTranslations("Pricing");
    const router = useRouter();
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    // LemonSqueezy Variant ID mapping
    const PRO_VARIANT_ID = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID || "1479578";

    const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

    const handleSubscribe = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { session } } = await supabase.auth.getSession();

        // If not logged in, redirect to login page
        if (!session) {
            toast.error(p("loginRequired"));
            router.push("/login");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/lemonsqueezy/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantId: PRO_VARIANT_ID, locale })
            });
            const data = await res.json();

            if (!res.ok) {
                // If unauthorized, redirect to login
                if (res.status === 401) {
                    toast.error(p("sessionExpired"));
                    router.push("/login");
                    return;
                }
                throw new Error(data.error || p("checkoutFailed"));
            }
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(p("checkoutLinkFailed"));
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : p("genericError");
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.blueprintWrapper}>
            <div className={styles.gridField}></div>
            <div className={styles.gridVignette}></div>

            <header className={`${styles.section} ${styles.pheader}`}>
                <div className={styles.eyebrow}>{p("eyebrow")}</div>
                <h1>{p("title")}</h1>
                <p>{p("subtitle")}</p>
            </header>

            <section className={`${styles.section} ${styles.pricingGrid}`}>
                {/* Free Plan */}
                <div className={styles.priceCard}>
                    <svg className={styles.corners} viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M2,20 L2,2 L20,2"/><path d="M80,2 L98,2 L98,20"/>
                        <path d="M98,80 L98,98 L80,98"/><path d="M20,98 L2,98 L2,80"/>
                    </svg>
                    <div className={styles.ptier}>{p("essential").toUpperCase()}</div>
                    <div className={styles.ptagLine}>{p("kickstart")}</div>
                    <div className={styles.pamount}>
                        <span className={styles.num}>{t("freePrice")}</span>
                        <span className={styles.per}>{t("perMonth")}</span>
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
                <div className={`${styles.priceCard} ${styles.popular}`}>
                    <svg className={styles.corners} viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M2,20 L2,2 L20,2"/><path d="M80,2 L98,2 L98,20"/>
                        <path d="M98,80 L98,98 L80,98"/><path d="M20,98 L2,98 L2,80"/>
                    </svg>
                    <span className={styles.popularTag}>{p("mostPopular")}</span>
                    <div className={styles.ptier}>{p("pro").toUpperCase()}</div>
                    <div className={styles.ptagLine}>{p("proSubtitle")}</div>
                    <div className={styles.pamount}>
                        <span className={styles.num}>{t("proPrice")}</span>
                        <span className={styles.per}>{t("perMonth")}</span>
                    </div>
                    <ul>
                        <li>{p("f_p_1")}</li>
                        <li>{p("f_p_2")}</li>
                        <li>{p("f_p_3")}</li>
                        <li>{p("f_p_4")}</li>
                        <li>{p("f_p_5")}</li>
                    </ul>
                    <button 
                        className={styles.pbtn} 
                        onClick={handleSubscribe} 
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {p("upgrade").toUpperCase()}
                    </button>
                </div>
            </section>

            <section className={`${styles.section} ${styles.compare}`}>
                <div className={styles.compareHead}>
                    <div className={styles.eyebrow}>{p("compareEyebrow")}</div>
                    <h2>{p("compareTitle")}</h2>
                    <p>{p("compareSubtitle")}</p>
                </div>
                <div className={styles.compareTable}>
                    <div className={`${styles.compareRow} ${styles.headerRow}`}>
                        <div className={styles.featName}>{p("featureHeader")}</div>
                        <div>{p("usHeader")}</div>
                        <div>{p("themHeader")}</div>
                    </div>
                    {[
                        p("c1"), p("c2"), p("c3"), p("c4"), p("c5"), p("c6")
                    ].map((feature, i) => (
                        <div key={i} className={styles.compareRow}>
                            <div className={styles.featName}>{feature}</div>
                            <div><span className={styles.yes}>✓</span></div>
                            <div><span className={styles.no}>–</span></div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={`${styles.section} ${styles.faq}`}>
                <div className={styles.faqHead}>
                    <div className={styles.eyebrow}>{p("faqEyebrow")}</div>
                    <h2>{p("faqTitle")}</h2>
                </div>
                <div className={styles.faqList}>
                    {[
                        { q: p("fq1"), a: p("fa1") },
                        { q: p("fq2"), a: p("fa2") },
                        { q: p("fq3"), a: p("fa3") },
                        { q: p("fq4"), a: p("fa4") },
                    ].map((item, i) => (
                        <div key={i} className={`${styles.faqItem} ${openFaqIndex === i ? styles.open : ''}`}>
                            <button 
                                className={styles.faqQ} 
                                aria-expanded={openFaqIndex === i}
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? -1 : i)}
                            >
                                {item.q} <span className={styles.sym}>+</span>
                            </button>
                            <div className={styles.faqA} style={{ maxHeight: openFaqIndex === i ? '200px' : '0px' }}>
                                <p>{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={`${styles.section} ${styles.footerCta}`}>
                <h2>{p("ctaTitle")}</h2>
                <Link className={styles.stampBtn} href="/register">{p("ctaBtn")}</Link>
            </section>
        </div>
    );
}
