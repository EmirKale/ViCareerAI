"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { pdf } from '@react-pdf/renderer';
import { CoverLetterPDF } from "@/components/cover-letter/templates/CoverLetterPDF";
import { Sparkles, Loader2, Copy, Download, RotateCcw, Save } from "lucide-react";

export default function NewCoverLetterPage() {
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");
    const [form, setForm] = useState({
        position: "",
        company: "",
        industry: "",
        tone: "professional",
        language: "tr",
        userSummary: "",
    });

    const [letterId, setLetterId] = useState<string | null>(null);
    const [generatedLetter, setGeneratedLetter] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [quota, setQuota] = useState<{ cover_letter_count: number; plan: string } | null>(null);
    const [isLoadingQuota, setIsLoadingQuota] = useState<boolean>(true);

    useEffect(() => {
        fetchQuota();
        if (editId) {
            fetchLetter(editId);
        }
    }, [editId]);

    const fetchQuota = async () => {
        try {
            const res = await fetch("/api/quota");
            if (res.ok) {
                const data = await res.json();
                setQuota({ 
                    cover_letter_count: data.cover_letter_count || 0,
                    plan: "free" // TODO: Get actual plan from profile
                });
            }
        } catch {
            // Silently fail
        } finally {
            setIsLoadingQuota(false);
        }
    };

    const fetchLetter = async (id: string) => {
        try {
            const res = await fetch(`/api/cover-letter/${id}`);
            const data = await res.json();
            if (res.ok) {
                setForm({
                    position: data.position || "",
                    company: data.company || "",
                    industry: data.industry || "",
                    tone: data.tone || "professional",
                    language: data.language || "tr",
                    userSummary: data.user_summary || "",
                });
                setGeneratedLetter(data.content || "");
                setLetterId(data.id);
            }
        } catch {
            toast.error("Mektup yüklenemedi.");
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        if (!form.position || !form.company) {
            toast.error("Lütfen en azından pozisyon ve şirket adını girin.");
            return;
        }

        setIsLoading(true);
        setGeneratedLetter("");

        try {
            const res = await fetch("/api/cover-letter/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429 && data.code === "QUOTA_EXCEEDED") {
                    toast.error(data.error || "Cover letter limitinize ulaştınız.");
                } else {
                    toast.error(data.error || "Bir hata oluştu.");
                }
                return;
            }

            setGeneratedLetter(data.letter);
            toast.success("Mektup başarıyla oluşturuldu!");
            
            // Refresh quota after successful generation
            fetchQuota();
        } catch {
            // Error logged if needed
        } finally {
            // Loading handled
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        toast.success("Mektup panoya kopyalandı!");
    };

    const handleReset = () => {
        setGeneratedLetter("");
    };

    const handleDownloadPDF = async () => {
        try {
            toast.info("PDF hazırlanıyor, lütfen bekleyin...");
            const blob = await pdf(
                <CoverLetterPDF
                    fullName="Başvuru Sahibi"
                    company={form.company || "Şirket"}
                    position={form.position || "Pozisyon"}
                    content={generatedLetter}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${form.company || 'Sirket'}_Motivasyon_Mektubu.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF başarıyla indirildi!");
        } catch {
            toast.error("PDF oluşturulurken hata oluştu.");
        }
    };

    const handleSave = async () => {
        if (!generatedLetter) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: letterId,
                    position: form.position,
                    company: form.company,
                    language: form.language,
                    tone: form.tone,
                    content: generatedLetter
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 503 || res.status === 401) {
                    toast.info("Giriş yapmadığınız için çalışmalarınız tarayıcıda geçici tutulmaktadır.");
                } else {
                    toast.error(data.error || "Mektup kaydedilemedi.");
                }
            } else {
                toast.success("Mektup başarıyla kaydedildi!");
            }
        } catch {
            toast.error("Kaydetme işlemi sırasında hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Motivasyon Mektubu</h1>
                    <p className="text-muted-foreground mt-1">
                        GPT-4o yapay zekası ile dakikalar içinde kişiselleştirilmiş ve ATS uyumlu mektup oluşturun.
                    </p>
                </div>
                {!isLoadingQuota && quota && quota.plan === "free" && (
                    <Card className="shadow-sm border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                                        Cover Letter Kotası
                                    </p>
                                    <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                        {quota.cover_letter_count}/3
                                    </p>
                                </div>
                                {quota.cover_letter_count >= 3 && (
                                    <Button 
                                        size="sm" 
                                        className="gradient-brand text-white text-xs h-8"
                                        onClick={() => window.location.href = "/tr/pricing"}
                                    >
                                        Pro'ya Geç
                                    </Button>
                                )}
                            </div>
                            {quota.cover_letter_count >= 3 && (
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                                    ⚠ Limitinize ulaştınız. Pro plan ile sınırsız mektup oluşturun.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left: Form */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Mektup Bilgileri</CardTitle>
                        <CardDescription>Başvurmak istediğiniz pozisyon bilgilerini girin.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="position">Hedef Pozisyon *</Label>
                            <Input
                                id="position"
                                placeholder="Örn: Senior Frontend Developer"
                                value={form.position}
                                onChange={(e) => handleChange("position", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company">Şirket Adı *</Label>
                            <Input
                                id="company"
                                placeholder="Örn: Google Türkiye"
                                value={form.company}
                                onChange={(e) => handleChange("company", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industry">Sektör (isteğe bağlı)</Label>
                            <Input
                                id="industry"
                                placeholder="Örn: Teknoloji, Finans, E-ticaret"
                                value={form.industry}
                                onChange={(e) => handleChange("industry", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Dil</Label>
                                <Select value={form.language} onValueChange={(v) => handleChange("language", v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                                        <SelectItem value="en">🇬🇧 English</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Ton / Üslup</Label>
                                <Select value={form.tone} onValueChange={(v) => handleChange("tone", v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Profesyonel</SelectItem>
                                        <SelectItem value="friendly">Samimi</SelectItem>
                                        <SelectItem value="confident">Özgüvenli</SelectItem>
                                        <SelectItem value="creative">Yaratıcı</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="userSummary">
                                Hakkınızda Notlar{" "}
                                <span className="text-xs text-muted-foreground">(AI bu bilgileri kullanır)</span>
                            </Label>
                            <Textarea
                                id="userSummary"
                                rows={4}
                                className="resize-none"
                                placeholder="Örn: 5 yıl React deneyimi, startup çıkışlı, Agile ekiplerde çalıştım, TypeScript ve Node.js kullanıyorum..."
                                value={form.userSummary}
                                onChange={(e) => handleChange("userSummary", e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full gradient-brand text-white shadow-md shadow-blue-500/20 h-12"
                            onClick={handleGenerate}
                            disabled={isLoading || (quota?.plan === "free" && quota.cover_letter_count >= 3)}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mektup Oluşturuluyor...
                                </>
                            ) : quota?.plan === "free" && quota.cover_letter_count >= 3 ? (
                                <>
                                    Limit Doldu - Pro'ya Geçin
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Yapay Zeka ile Oluştur
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Right: Generated Letter */}
                <div className="flex flex-col gap-4">
                    <Card className={`flex-1 flex flex-col shadow-sm transition-all ${generatedLetter ? "border-blue-200 dark:border-blue-900" : ""}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-lg">Oluşturulan Mektup</CardTitle>
                                {generatedLetter && (
                                    <CardDescription className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        ✓ GPT-4o tarafından oluşturuldu
                                    </CardDescription>
                                )}
                            </div>
                            {generatedLetter && (
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={handleCopy}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={handleReset} className="text-muted-foreground">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1">
                            {!generatedLetter && !isLoading && (
                                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 text-center">
                                    <Sparkles className="mb-3 h-10 w-10 text-blue-400 opacity-60" />
                                    <p className="font-medium text-muted-foreground">Mektubunuz burada görünecek</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Bilgileri doldurup yapay zekayı çalıştırın.
                                    </p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex h-64 flex-col items-center justify-center gap-4">
                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-full gradient-brand opacity-20 animate-ping absolute inset-0" />
                                        <div className="h-14 w-14 rounded-full gradient-brand flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">AI mektubunuzu yazıyor...</p>
                                        <p className="text-sm text-muted-foreground mt-1">Bu işlem 5-15 saniye sürebilir</p>
                                    </div>
                                </div>
                            )}

                            {generatedLetter && !isLoading && (
                                <div className="space-y-3">
                                    <Textarea
                                        rows={18}
                                        className="resize-none font-serif text-sm leading-relaxed border-0 shadow-none focus-visible:ring-0 p-0"
                                        value={generatedLetter}
                                        onChange={(e) => setGeneratedLetter(e.target.value)}
                                    />
                                    <div className="flex gap-2 pt-2 border-t">
                                        <Button size="sm" variant="outline" onClick={handleCopy} className="flex-1">
                                            <Copy className="mr-2 h-3.5 w-3.5" />
                                            Kopyala
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving} className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950">
                                            {isSaving ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
                                            Kaydet
                                        </Button>
                                        <Button size="sm" className="flex-1 gradient-brand text-white border-0" onClick={handleDownloadPDF}>
                                            <Download className="mr-2 h-3.5 w-3.5" />
                                            PDF İndir
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
