"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import styles from "../auth.module.css";

export default function RegisterPage() {
    const supabase = createClient();
    const router = useRouter();
    const tAuth = useTranslations("Auth");
    const t = useTranslations("AuthBlueprint");
    const locale = useLocale();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleEmailRegister(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
            return;
        }

        toast.success(tAuth("successRegister"));
        if (data.session) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
        setIsLoading(false);
    }

    async function handleGoogleLogin() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/${locale}/callback`,
            },
        });
    }

    return (
        <div className={styles.authWrapper}>
            <div className={styles.gridField}></div>
            <div className={styles.shell}>
                <div className={styles.brandPanel}>
                    <div className={styles.logo}>
                        <span className={styles.logoMark}>Vi</span>ViCareerAI
                    </div>

                    <div className={styles.brandMid}>
                        <div className={styles.eyebrow}>{t("regEyebrow")}</div>
                        <h1>{t("regTitle")}</h1>
                        <p>{t("regDesc")}</p>

                        <div className={styles.miniSteps}>
                            <div className={`${styles.mstep} ${styles.active}`}>
                                <span className={styles.mnum}>{t("step1Num")}</span>
                                <div>
                                    <h3>{t("step1Title")}</h3>
                                    <p>{t("step1Desc")}</p>
                                </div>
                            </div>
                            <div className={styles.mstep}>
                                <span className={styles.mnum}>{t("step2Num")}</span>
                                <div>
                                    <h3>{t("step2Title")}</h3>
                                    <p>{t("step2Desc")}</p>
                                </div>
                            </div>
                            <div className={styles.mstep}>
                                <span className={styles.mnum}>{t("step3Num")}</span>
                                <div>
                                    <h3>{t("step3Title")}</h3>
                                    <p>{t("step3Desc")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.brandFooter}>{t("brandFooter")}</div>
                </div>

                <div className={styles.formPanel}>
                    <div className={styles.formCard}>
                        <svg className={styles.corners} viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M6,22 L6,6 L22,6" />
                            <path d="M78,6 L94,6 L94,22" />
                            <path d="M94,78 L94,94 L78,94" />
                            <path d="M22,94 L6,94 L6,78" />
                        </svg>

                        <div className={styles.formHead}>
                            <h2>{t("regCardTitle")}</h2>
                            <p>{t("regCardDesc")}</p>
                        </div>

                        <form onSubmit={handleEmailRegister} noValidate>
                            <div className={styles.field}>
                                <label htmlFor="name">{tAuth("fullName")}</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="fullname"
                                    placeholder={tAuth("fullNamePlaceholder")}
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="email">{tAuth("email")}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="password">{tAuth("password")}</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="********"
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("btnRegister")}
                            </button>
                        </form>

                        <div className={styles.divider}>{t("or")}</div>

                        <button type="button" className={styles.oauthBtn} onClick={handleGoogleLogin} disabled={isLoading}>
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z" opacity=".5" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.67-2.26 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" opacity=".75" />
                                <path fill="currentColor" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.06H2.18A10.99 10.99 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" opacity=".6" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
                            </svg>
                            {t("btnGoogle")}
                        </button>

                        <div className={styles.formFoot}>
                            {t("haveAccount")} <Link href="/login">{t("loginLink")}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
