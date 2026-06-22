"use client";

import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, LayoutTemplate } from "lucide-react";

export default function NewCVPage() {
    const router = useRouter();

    const templates = [
        {
            id: "classic",
            name: "Klasik Kurumsal",
            description: "Tek sütunlu, geleneksel ve temiz tasarım. ATS'den geçerken hiçbir sorun yaşatmaz.",
            isPro: false,
            color: "bg-zinc-100",
        },
        {
            id: "modern",
            name: "Modern Profesyonel",
            description: "İki sütunlu, renk detayına sahip dinamik görünüm. Özgeçmişinizi fark edilir kılar.",
            isPro: false,
            color: "bg-blue-50",
        },
        {
            id: "minimal",
            name: "Minimalist",
            description: "Sadece içeriğe odaklanan, sade ve şık tasarım. Teknoloji rollerine çok uygun.",
            isPro: false,
            color: "bg-background",
        },
        {
            id: "executive",
            name: "Yönetici (Executive)",
            description: "Üst düzey yöneticiler için premium tasarım detayları barındırır.",
            isPro: true,
            color: "bg-slate-50 border-slate-200",
        },
        {
            id: "creative",
            name: "Yaratıcı (Creative)",
            description: "Portfolyo odaklı, modern ve dinamik tasarım. Tasarımcılar için mükemmel.",
            isPro: true,
            color: "bg-blue-900",
        },
        {
            id: "tech",
            name: "Teknoloji (Tech)",
            description: "Yazılımcılar için terminal estetiği. GitHub ve TechStack odaklı.",
            isPro: true,
            color: "bg-zinc-950 font-mono",
        }
    ];

    const handleSelectTemplate = (id: string, isPro: boolean) => {
        if (isPro) {
            // Show upgrade modal logic goes here eventually
            router.push("/pricing");
            return;
        }
        // Proceed to editor with selected template ID
        router.push(`/cv/new/edit?template=${id}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Yeni CV Oluştur</h1>
                <p className="text-muted-foreground">Kariyer hedeflerinize uygun, ATS uyumlu bir şablon seçerek başlayın.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
                {templates.map((template) => (
                    <Card
                        key={template.id}
                        className={`flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 ${template.isPro ? "border-blue-500 shadow-blue-500/10" : "border-transparent"
                            }`}
                    >
                        {/* Template preview placeholder */}
                        <div className={`h-48 rounded-t-xl border-b flex items-center justify-center p-6 ${template.color}`}>
                            {template.isPro && (
                                <div className="absolute top-4 right-4 bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    PRO ŞABLON
                                </div>
                            )}
                            <div className="flex flex-col gap-3 w-2/3 h-full bg-white rounded shadow-sm p-4 opacity-50 border">
                                <div className="h-4 w-1/2 bg-zinc-200 rounded"></div>
                                <div className="h-2 w-full bg-zinc-200 rounded"></div>
                                <div className="h-2 w-3/4 bg-zinc-200 rounded"></div>
                                <div className="mt-4 h-3 w-1/3 bg-zinc-200 rounded"></div>
                                <div className="h-10 w-full border border-dashed border-zinc-300 rounded"></div>
                            </div>
                        </div>

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LayoutTemplate className="h-5 w-5 text-blue-600" />
                                {template.name}
                            </CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-4">
                            <Button
                                onClick={() => handleSelectTemplate(template.id, template.isPro)}
                                variant={template.isPro ? "default" : "outline"}
                                className={`w-full ${template.isPro ? 'gradient-brand text-white border-0' : ''}`}
                            >
                                {template.isPro ? "Pro'ya Geçerek Kullan" : "Bu Şablonu Seç"}
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
