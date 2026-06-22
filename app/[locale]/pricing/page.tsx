"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check, Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "@/i18n/routing";
import { ElectricCard } from "@/components/ui/electric-card";

export default function PricingPage() {
    const t = useTranslations("Index");
    const p = useTranslations("Pricing");
    const router = useRouter();
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    // LemonSqueezy Variant ID mapping
    const PRO_VARIANT_ID = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID || "1479578";

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
        <div className="relative flex min-h-screen flex-col font-sans overflow-x-hidden selection:bg-blue-500/10">
            <div className="absolute inset-0 gradient-hero-bg z-0 pointer-events-none" />
            <div className="absolute inset-0 grid-pattern z-0 opacity-40 pointer-events-none" />
            
            <div className="relative z-10 py-32 px-4 md:px-8 max-w-7xl mx-auto w-full flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                        {p("investment")}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {p("investmentDesc")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <Card className="flex flex-col border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden bg-white/5 backdrop-blur-xl">
                        <CardHeader className="text-center pb-8 pt-10">
                            <CardTitle className="text-2xl mb-2">{p("essential")}</CardTitle>
                            <CardDescription className="text-base">{p("kickstart")}</CardDescription>
                            <div className="mt-6 flex justify-center items-baseline gap-1">
                                <span className="text-5xl font-black">{t("freePrice")}</span>
                                <span className="text-muted-foreground font-medium">{t("lifetime")}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 px-8">
                            <ul className="space-y-4">
                                {[
                                    { text: p("f1"), included: true },
                                    { text: p("f2"), included: true },
                                    { text: p("f3"), included: true },
                                    { text: p("f4"), included: false }
                                ].map((item, i) => (
                                    <li key={i} className={`flex flex-row items-center gap-3 font-medium ${item.included ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                                        {item.included ? (
                                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500 shrink-0" />
                                        )}
                                        <span className={item.included ? "" : "line-through"}>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="px-8 pb-10">
                            <Button className="w-full h-12 text-base" variant="outline" onClick={() => router.push("/register")}>
                                {p("currentPlan")}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <ElectricCard color="blue" className="flex flex-col h-full shadow-xl shadow-blue-500/10 relative overflow-visible scale-100 md:scale-105 z-10 p-0 !bg-transparent border-0">
                        <div className="bg-white/5 backdrop-blur-xl h-full w-full rounded-2xl flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1.5 gradient-brand"></div>
                            <div className="absolute top-5 right-5">
                                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                    {p("recommended")}
                                </span>
                            </div>
                            <CardHeader className="text-center pb-8 pt-10">
                                <CardTitle className="text-2xl mb-2 flex items-center justify-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    {p("pro")}
                                </CardTitle>
                                <CardDescription className="text-base text-blue-900/70 dark:text-blue-100/70">{p("proSubtitle")}</CardDescription>
                                <div className="mt-6 flex justify-center items-baseline gap-1">
                                    <span className="text-5xl font-black text-zinc-900 dark:text-white">{t("proPrice")}</span>
                                    <span className="text-muted-foreground font-medium">{t("perMonth")}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 px-8">
                                <ul className="space-y-4">
                                    {[
                                        p("f_p_1"),
                                        p("f_p_2"),
                                        p("f_p_3"),
                                        p("f_p_4"),
                                        p("f_p_5")
                                    ].map((feature, i) => (
                                        <li key={i} className="flex flex-row items-center gap-3 text-zinc-800 dark:text-zinc-200 font-medium">
                                            <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="px-8 pb-10">
                                <Button
                                    className="w-full h-12 text-base gradient-brand text-white shadow-lg shadow-blue-500/25 border-0"
                                    onClick={handleSubscribe}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {p("checkoutLoading")}
                                        </>
                                    ) : (
                                        p("upgrade")
                                    )}
                                </Button>
                            </CardFooter>
                        </div>
                    </ElectricCard>
                </div>
            </div>
        </div>
    );
}
