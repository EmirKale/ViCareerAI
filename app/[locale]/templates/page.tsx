"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { LayoutTemplate } from "lucide-react";
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
                ? "Tek sütunlu, geleneksel ve temiz sayfa yapısı. Standart ATS taramalarına uygundur." 
                : "Single column, traditional, and clean page structure. Fully readable by standard ATS parsers.",
            isPro: false,
            color: "bg-[#F7F5F0]",
            previewStyle: "w-2/3 h-full bg-white border border-[#D3CDC2] p-4 flex flex-col gap-2",
        },
        {
            id: "modern",
            name: locale === "tr" ? "Modern Profesyonel" : "Modern Professional",
            description: locale === "tr" 
                ? "İki sütunlu, dengeli yerleşime sahip dinamik görünüm. İçeriği net bölümlere ayırır." 
                : "Two-column dynamic layout with clear visual hierarchy. Separates content into readable sections.",
            isPro: false,
            color: "bg-[#F7F5F0]",
            previewStyle: "w-2/3 h-full bg-white border border-[#D3CDC2] p-4 flex flex-col gap-2",
        },
        {
            id: "minimal",
            name: locale === "tr" ? "Minimalist" : "Minimalist",
            description: locale === "tr" 
                ? "Sadece metne ve deneyime odaklanan, süssüz tasarım. Teknik roller için idealdir." 
                : "Content-focused, unadorned design emphasizing skills and experience. Best for tech roles.",
            isPro: false,
            color: "bg-[#F7F5F0]",
            previewStyle: "w-2/3 h-full bg-white border border-[#D3CDC2] p-4 flex flex-col gap-2",
        },
        {
            id: "executive",
            name: locale === "tr" ? "Yönetici (Executive)" : "Executive",
            description: locale === "tr" 
                ? "Üst düzey yöneticilik ve liderlik pozisyonları için yapılandırılmış başlık düzeni." 
                : "Structured hierarchy and executive summary sections designed for senior leadership roles.",
            isPro: true,
            color: "bg-[#F7F5F0]",
            previewStyle: "w-2/3 h-full bg-white border border-[#111111] p-4 flex flex-col gap-2",
        },
        {
            id: "creative",
            name: locale === "tr" ? "Yaratıcı (Creative)" : "Creative",
            description: locale === "tr" 
                ? "Portfolyo ve proje odaklı işler için tasarlanmış sütun yapısı." 
                : "Portfolio and project-oriented structure designed for creative specialists.",
            isPro: true,
            color: "bg-[#F7F5F0]",
            previewStyle: "w-2/3 h-full bg-white border border-[#111111] p-4 flex flex-col gap-2",
        },
        {
            id: "tech",
            name: locale === "tr" ? "Teknoloji (Tech)" : "Tech",
            description: locale === "tr" 
                ? "Teknoloji yığını, araçlar ve GitHub projelerini öne çıkaran kompakt format." 
                : "Highlights tech stacks, open-source projects, and technical skills in a compact format.",
            isPro: true,
            color: "bg-[#F7F5F0]",
            previewStyle: "w-2/3 h-full bg-white border border-[#111111] p-4 flex flex-col gap-2",
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
        <div className="min-h-screen bg-[#F4F1EA] text-[#111111] font-serif pt-28 pb-20 px-6 md:px-8">
            <div className="max-w-6xl mx-auto w-full">
                <header className="border-b-2 border-[#111111] pb-8 mb-12">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#1849A9] uppercase mb-2 block">
                        {locale === "tr" ? "ŞABLON KOLEKSİYONU · 6 SEÇENEK" : "TEMPLATE COLLECTION · 6 LAYOUTS"}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] font-sans mb-3">
                        {locale === "tr" ? "Özgeçmiş Şablonları" : "Resume Templates"}
                    </h1>
                    <p className="text-base text-[#4A4742] max-w-2xl font-serif">
                        {locale === "tr" 
                            ? "3 ücretsiz temel şablon ve 3 Pro şablon arasından başvurunuza en uygun formatı seçin." 
                            : "Choose from 3 free core templates and 3 Pro templates matching your target role."}
                    </p>
                </header>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className={`flex flex-col rounded-none bg-white border-2 border-[#111111] shadow-none relative overflow-hidden ${
                                template.isPro ? "border-[#1849A9]" : "border-[#111111]"
                            }`}
                        >
                            {/* Preview box */}
                            <div className={`h-48 border-b border-[#D3CDC2] flex items-center justify-center p-6 relative ${template.color}`}>
                                {template.isPro && (
                                    <div className="absolute top-3 right-3 bg-[#1849A9] text-white text-[11px] font-mono font-bold px-2 py-0.5 tracking-wider uppercase">
                                        PRO
                                    </div>
                                )}
                                
                                <div className={template.previewStyle}>
                                    <div className="h-3 w-1/2 bg-[#D3CDC2]"></div>
                                    <div className="h-2 w-full bg-[#EAE6DC]"></div>
                                    <div className="h-2 w-3/4 bg-[#EAE6DC]"></div>
                                    <div className="mt-3 h-2 w-1/3 bg-[#D3CDC2]"></div>
                                    <div className="h-6 w-full border border-dashed border-[#D3CDC2] flex items-center justify-center">
                                        <div className="h-1.5 w-1/3 bg-[#EAE6DC]"></div>
                                    </div>
                                </div>
                            </div>

                            <CardHeader className="flex-1 p-5">
                                <CardTitle className="flex items-center gap-2 text-lg font-sans font-bold uppercase text-[#111111]">
                                    <LayoutTemplate className="h-4 w-4 text-[#1849A9]" />
                                    {template.name}
                                </CardTitle>
                                <CardDescription className="text-[#4A4742] text-sm mt-2 font-serif leading-relaxed">
                                    {template.description}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardFooter className="p-5 pt-0 border-t border-[#EAE6DC]">
                                {template.isPro ? (
                                    <Button 
                                        onClick={() => handleSelectTemplate(template.id, true)}
                                        className="w-full rounded-none font-sans font-bold uppercase tracking-wider text-xs bg-[#1849A9] hover:bg-[#123782] text-white h-10 border border-[#123782]"
                                    >
                                        {locale === "tr" ? "Pro ile Aç" : "Unlock with Pro"}
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => handleSelectTemplate(template.id, false)}
                                        className="w-full rounded-none font-sans font-bold uppercase tracking-wider text-xs bg-[#EAE6DC] hover:bg-[#111111] hover:text-white text-[#111111] h-10 border border-[#111111]"
                                    >
                                        {locale === "tr" ? "Şablonu Seç" : "Select Template"}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
