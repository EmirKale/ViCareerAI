"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Clock, Pencil, Download, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { CoverLetterPDF } from "@/components/cover-letter/templates/CoverLetterPDF";

interface CoverLetter {
    id: string;
    title: string;
    position: string;
    company: string;
    content: string;
    updated_at: string;
}

export default function LetterHistoryClient({ initialLetters }: { initialLetters: CoverLetter[] }) {
    const t = useTranslations("History");
    const [letters, setLetters] = useState<CoverLetter[]>(initialLetters || []);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Bu mektubu silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/cover-letter/${id}`, { method: "DELETE" });
            if (res.ok) {
                setLetters(prev => prev.filter(l => l.id !== id));
                toast.success("Mektup silindi");
            } else {
                throw new Error();
            }
        } catch {
            toast.error("Silme işlemi başarısız");
        }
    };

    const handleDownloadPDF = async (letter: CoverLetter) => {
        setDownloadingId(letter.id);
        try {
            toast.info("PDF hazırlanıyor...");
            const blob = await pdf(<CoverLetterPDF content={letter.content} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Motivasyon_Mektubu_${letter.company || "CareerAI"}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF indirildi!");
        } catch {
            toast.error("PDF oluşturulamadı.");
        } finally {
            setDownloadingId(null);
        }
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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("letterTitle")}</h1>
                    <p className="text-muted-foreground mt-1">{t("letterDesc")}</p>
                </div>
                <Link href="/cover-letter/new">
                    <Button className="gradient-brand text-white shadow-md shadow-blue-500/20">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Mektup Yaz
                    </Button>
                </Link>
            </div>

            {letters.length === 0 ? (
                <Card className="py-20 border-dashed bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">{t("empty")}</h3>
                    <Link href="/cover-letter/new" className="mt-6 inline-block">
                        <Button className="gradient-brand text-white"><Plus className="mr-2 h-4 w-4" />Hemen Yaz</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {letters.map((letter) => (
                        <Card key={letter.id} className="group hover:shadow-lg transition-all hover:border-blue-200 dark:hover:border-blue-800">
                            <CardContent className="p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex gap-1">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-8 w-8 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                                                onClick={() => handleDelete(letter.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-8 w-8 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                                                disabled={downloadingId === letter.id}
                                                onClick={() => handleDownloadPDF(letter)}
                                            >
                                                {downloadingId === letter.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-4">
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {letter.title || "İsimsiz Mektup"}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{relativeTime(letter.updated_at)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-2">
                                        <Link href={`/cover-letter/new?id=${letter.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full text-xs h-9 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 group-hover:border-blue-300 transition-all font-semibold">
                                                <Pencil className="h-3 w-3 mr-2" /> {t("actions.edit")}
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
