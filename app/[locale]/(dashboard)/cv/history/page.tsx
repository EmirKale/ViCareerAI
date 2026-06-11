"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Clock, Pencil, Download, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { ClassicTemplate, CVData } from "@/components/cv/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/cv/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/cv/templates/MinimalTemplate";
import { ExecutiveTemplate } from "@/components/cv/templates/ExecutiveTemplate";
import { CreativeTemplate } from "@/components/cv/templates/CreativeTemplate";
import { ProfessionalTemplate } from "@/components/cv/templates/ProfessionalTemplate";

interface CVItem {
    id: string;
    title: string;
    template: string;
    updated_at: string;
    data?: CVData;
}

const templateLabel: Record<string, string> = {
    classic: "Klasik",
    modern: "Modern",
    minimal: "Minimal",
    executive: "Executive",
    creative: "Creative",
    professional: "Professional",
};

const templateBadgeClass: Record<string, string> = {
    classic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    modern: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    minimal: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    executive: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    creative: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    professional: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

function relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dakika önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
}

export default function CVHistoryPage() {
    const t = useTranslations("History");
    const nav = useTranslations("Navigation");
    const [cvs, setCvs] = useState<CVItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/cv")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setCvs(data);
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bu CV'yi silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCvs(prev => prev.filter(c => c.id !== id));
                toast.success("CV silindi");
            } else {
                throw new Error();
            }
        } catch {
            toast.error("Silme işlemi başarısız");
        }
    };

    const handleDownloadPDF = async (cv: CVItem) => {
        if (!cv.data) {
            toast.error("CV verisi bulunamadı.");
            return;
        }
        setDownloadingId(cv.id);
        try {
            toast.info("PDF hazırlanıyor...");
            const TemplateComponent = 
                cv.template === "modern" ? ModernTemplate : 
                cv.template === "minimal" ? MinimalTemplate : 
                cv.template === "executive" ? ExecutiveTemplate : 
                cv.template === "creative" ? CreativeTemplate : 
                cv.template === "professional" ? ProfessionalTemplate : 
                ClassicTemplate;
            const blob = await pdf(<TemplateComponent data={cv.data} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${cv.title}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF indirildi!");
        } catch {
            toast.error("PDF oluşturulamadı.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("cvTitle")}</h1>
                    <p className="text-muted-foreground mt-1">{t("cvDesc")}</p>
                </div>
                <Link href="/cv/new">
                    <Button className="gradient-brand text-white shadow-md shadow-blue-500/20">
                        <Plus className="mr-2 h-4 w-4" /> {nav("register")}
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                    ))}
                </div>
            ) : cvs.length === 0 ? (
                <Card className="py-16 border-dashed bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">{t("empty")}</h3>
                    <Link href="/cv/new" className="mt-6 inline-block">
                        <Button className="gradient-brand text-white"><Plus className="mr-2 h-4 w-4" />Yeni CV</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {cvs.map((cv) => (
                        <Card key={cv.id} className="group hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <h3 className="font-semibold text-[15px] truncate">{cv.title}</h3>
                                            <Badge variant="secondary" className={`text-[10px] shrink-0 ${templateBadgeClass[cv.template] || ""}`}>
                                                {templateLabel[cv.template] || cv.template}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" />
                                            {relativeTime(cv.updated_at)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                                            onClick={() => handleDelete(cv.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                                            disabled={downloadingId === cv.id}
                                            onClick={() => handleDownloadPDF(cv)}
                                        >
                                            {downloadingId === cv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                        </Button>
                                        <Link href={`/cv/${cv.id}/edit`}>
                                            <Button size="icon" variant="outline" className="h-8 w-8 group-hover:border-blue-300">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
