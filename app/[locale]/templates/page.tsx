"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { LayoutTemplate, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "@/i18n/routing";

export default function TemplatesPage() {
    const router = useRouter();
    const locale = useLocale();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            setIsLoggedIn(!!data.user);
        });
    }, []);

    const templates = [
        {
            id: "classic",
            name: locale === "tr" ? "Klasik Kurumsal" : "Classic Corporate",
            description: locale === "tr" 
                ? "Tek sütunlu, geleneksel ve temiz tasarım. ATS'den geçerken hiçbir sorun yaşatmaz." 
                : "Single column, traditional and clean design. Guaranteed to pass ATS scanning.",
            isPro: false,
            color: "bg-zinc-100 dark:bg-zinc-800",
            previewStyle: "w-2/3 h-full bg-white dark:bg-zinc-900 rounded shadow-sm p-4 opacity-70 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2",
        },
        {
            id: "modern",
            name: locale === "tr" ? "Modern Profesyonel" : "Modern Professional",
            description: locale === "tr" 
                ? "İki sütunlu, renk detayına sahip dinamik görünüm. Özgeçmişinizi fark edilir kılar." 
                : "Two columns with elegant color details. Makes your profile stand out.",
            isPro: false,
            color: "bg-blue-50 dark:bg-blue-950/20",
            previewStyle: "w-2/3 h-full bg-white dark:bg-zinc-900 rounded shadow-sm p-4 opacity-70 border border-blue-200 dark:border-blue-900/50 flex flex-col gap-2",
        },
        {
            id: "minimal",
            name: locale === "tr" ? "Minimalist" : "Minimalist",
            description: locale === "tr" 
                ? "Sadece içeriğe odaklanan, sade ve şık tasarım. Teknoloji rollerine çok uygun." 
                : "A simple and sleek design focusing solely on content. Perfect for tech roles.",
            isPro: false,
            color: "bg-zinc-50 dark:bg-zinc-900/20",
            previewStyle: "w-2/3 h-full bg-white dark:bg-zinc-900 rounded shadow-sm p-4 opacity-70 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2",
        },
        {
            id: "executive",
            name: locale === "tr" ? "Yönetici (Executive)" : "Executive",
            description: locale === "tr" 
                ? "Üst düzey yöneticiler için premium tasarım detayları barındırır." 
                : "Contains premium design details tailored for top-level managers and executives.",
            isPro: true,
            color: "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800",
            previewStyle: "w-2/3 h-full bg-white dark:bg-zinc-900 rounded shadow-sm p-4 opacity-70 border border-slate-200 dark:border-slate-800 flex flex-col gap-2",
        },
        {
            id: "creative",
            name: locale === "tr" ? "Yaratıcı (Creative)" : "Creative",
            description: locale === "tr" 
                ? "Portfolyo odaklı, modern ve dinamik tasarım. Tasarımcılar için mükemmel." 
                : "Portfolio-focused, modern and dynamic layout. Perfect for creative professionals.",
            isPro: true,
            color: "bg-blue-900/10 dark:bg-blue-900/20",
            previewStyle: "w-2/3 h-full bg-white dark:bg-zinc-900 rounded shadow-sm p-4 opacity-70 border border-blue-800/30 flex flex-col gap-2",
        },
        {
            id: "tech",
            name: locale === "tr" ? "Teknoloji (Tech)" : "Tech",
            description: locale === "tr" 
                ? "Yazılımcılar için terminal estetiği. GitHub ve TechStack odaklı." 
                : "Terminal aesthetic for software developers. Emphasizes GitHub and Tech Stack.",
            isPro: true,
            color: "bg-zinc-950/40 dark:bg-zinc-950 font-mono",
            previewStyle: "w-2/3 h-full bg-white dark:bg-zinc-900 rounded shadow-sm p-4 opacity-70 border border-zinc-800 flex flex-col gap-2",
        }
    ];

    const handleSelectTemplate = (id: string, isPro: boolean) => {
        if (isPro) {
            router.push("/pricing");
            return;
        }
        if (isLoggedIn) {
            router.push(`/cv/new/edit?template=${id}`);
        } else {
            router.push(`/register?redirect=/cv/new/edit?template=${id}`);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col font-sans overflow-x-hidden selection:bg-blue-500/10">
            {/* Background layers */}
            <div className="absolute inset-0 gradient-hero-bg z-0 pointer-events-none" />
            <div className="absolute inset-0 grid-pattern z-0 opacity-40 pointer-events-none" />
            
            <div className="relative z-10 py-32 px-6 md:px-8 max-w-7xl mx-auto w-full flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-1.5 text-xs font-bold text-blue-600 backdrop-blur-xl dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{locale === "tr" ? "ATS Uyumlu Şablonlar" : "ATS-Friendly Templates"}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                        {locale === "tr" ? "Profesyonel Özgeçmiş Şablonları" : "Professional Resume Templates"}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {locale === "tr" 
                            ? "Kariyer hedeflerinize en uygun, işe alım uzmanları tarafından onaylanmış profesyonel tasarımları keşfedin." 
                            : "Discover recruiter-approved professional templates tailored specifically for your career goals."}
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className={`flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border-2 bg-white/5 backdrop-blur-xl relative group overflow-hidden ${
                                template.isPro ? "border-blue-500/30 shadow-blue-500/5" : "border-zinc-200/50 dark:border-zinc-800/80"
                            }`}
                        >
                            {/* Template Preview Area */}
                            <div className={`h-52 border-b flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden ${template.color}`}>
                                {template.isPro && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wider">
                                        PRO
                                    </div>
                                )}
                                
                                <div className={template.previewStyle}>
                                    <div className="h-3.5 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                                    <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                                    <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                                    <div className="mt-4 h-2.5 w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                                    <div className="h-8 w-full border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg flex items-center justify-center">
                                        <div className="h-1.5 w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <CardHeader className="flex-1">
                                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                    <LayoutTemplate className="h-5 w-5 text-blue-500" />
                                    {template.name}
                                </CardTitle>
                                <CardDescription className="text-zinc-600 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
                                    {template.description}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
                                <Button
                                    onClick={() => handleSelectTemplate(template.id, template.isPro)}
                                    variant={template.isPro ? "default" : "outline"}
                                    className={`w-full h-12 rounded-xl text-sm font-bold transition-all ${
                                        template.isPro 
                                            ? 'gradient-brand text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35' 
                                            : 'border-zinc-200/50 hover:bg-zinc-100/50 dark:border-zinc-800/80 dark:hover:bg-zinc-800/50'
                                    }`}
                                >
                                    {template.isPro 
                                        ? (locale === "tr" ? "Pro Plana Geçin" : "Get Pro Plan")
                                        : (locale === "tr" ? "Bu Şablonu Kullan" : "Use This Template")
                                    }
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
