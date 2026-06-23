"use client";

import { useTranslations, useLocale } from "next-intl";
import { ChevronRight, Check, Loader2, Lock, TrendingUp, BrainCircuit, Zap, RefreshCw, Upload, FileText, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RoadmapClient({ analysisData, cvs }: { analysisData: any, cvs: any[] }) {
    const t = useTranslations("Roadmap");
    const locale = useLocale();
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showUpload, setShowUpload] = useState(!analysisData);
    const [targetPosition, setTargetPosition] = useState(analysisData?.target_position || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalyzeFromCV = async (cvId: string) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/roadmap/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvId, targetPosition, locale })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success("Yol haritası oluşturuldu!");
            router.refresh();
            setShowUpload(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "raw");

            const parseRes = await fetch("/api/cv/parse-file", {
                method: "POST",
                body: formData
            });
            const parseData = await parseRes.json();
            
            if (!parseRes.ok) throw new Error(parseData.error || "Dosya okunamadı");

            const res = await fetch("/api/roadmap/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileContent: parseData.text, targetPosition, locale })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success("Yol haritası oluşturuldu!");
            router.refresh();
            setShowUpload(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (showUpload || !analysisData) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto mt-10">
                <Card className="border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">{t("title") || "Kariyer Yol Haritası"}</CardTitle>
                        <CardDescription>
                            Hedef pozisyonunuza ulaşmak için size özel bir adım adım yol haritası oluşturun.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center p-8">
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center gap-4 text-indigo-600">
                                <Loader2 className="w-12 h-12 animate-spin" />
                                <p className="font-medium animate-pulse">Yapay zeka yol haritanızı oluşturuyor...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                                <div className="w-full space-y-2 mb-2">
                                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2"><Target className="w-4 h-4"/> Hedef Pozisyon (Opsiyonel)</label>
                                    <Input 
                                        placeholder="Örn: Senior Frontend Developer" 
                                        value={targetPosition}
                                        onChange={(e) => setTargetPosition(e.target.value)}
                                        className="h-12 bg-zinc-50 dark:bg-zinc-900"
                                    />
                                    <p className="text-xs text-muted-foreground">Boş bırakırsanız CV&apos;nizdeki deneyimlere göre tahmin edilecektir.</p>
                                </div>

                                {cvs.length > 0 ? (
                                    <div className="w-full space-y-4">
                                        {cvs.map(cv => (
                                            <Button 
                                                key={cv.id} 
                                                variant="outline" 
                                                className="w-full justify-between h-14"
                                                onClick={() => handleAnalyzeFromCV(cv.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-indigo-500" />
                                                    <span className="font-semibold">{cv.title || "CV'm"} ile Oluştur</span>
                                                </div>
                                                <Zap className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-14 border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                                            onClick={() => router.push("/cv/new")}
                                        >
                                            <FileText className="w-5 h-5 mr-2" />
                                            Yeni CV Oluştur
                                        </Button>
                                    </div>
                                )}

                                <div className="flex items-center w-full gap-4 mt-2 mb-2">
                                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
                                    <span className="text-xs text-muted-foreground font-bold uppercase">VEYA</span>
                                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
                                </div>

                                <div className="w-full">
                                    <input 
                                        type="file" 
                                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <Button 
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-5 h-5 mr-2" />
                                        Dışarıdan CV Yükle (PDF / DOCX)
                                    </Button>
                                </div>
                                
                                {analysisData && (
                                    <Button variant="link" onClick={() => setShowUpload(false)} className="mt-4">
                                        İptal Et ve Haritaya Dön
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { overall_score, readiness, steps, insights, target_position } = analysisData;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{t("title") || "Kariyer Yol Haritası"}</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">{target_position} pozisyonu için özel hazırlanmış gelişim planınız.</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => setShowUpload(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md">
                        <RefreshCw className="w-4 h-4" />
                        Yeniden Analiz Et
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Metrics Bento Grid */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <TrendingUp className="w-16 h-16 text-white" />
                        </div>
                        <CardContent className="p-6">
                            <p className="text-xs uppercase mb-2 font-bold tracking-widest text-indigo-100">{t("skillsScore") || "Genel Yetenek Puanı"}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">{overall_score}</span>
                                <span className="text-xl text-indigo-200">/100</span>
                            </div>
                            <div className="mt-4 w-full bg-indigo-900/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full rounded-full" style={{ width: `${overall_score}%` }}></div>
                            </div>
                            <p className="mt-4 text-sm text-indigo-100">{t("sinceLastAssessment") || "Hedefe ulaşmak için harika bir temel"}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="text-xs uppercase font-bold tracking-widest text-muted-foreground">{t("readinessForecast") || "Hazırlık Durumu"}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {Object.entries(readiness || {}).map(([category, value]: [string, any], idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{category}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm font-bold">{value}%</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* AI Recommendations */}
                    <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-indigo-900 dark:text-indigo-100">
                                <BrainCircuit className="text-indigo-500 w-5 h-5" />
                                {t("aiInsights") || "AI İçgörüleri"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {Array.isArray(insights) && insights.map((insight: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm w-full max-w-full overflow-hidden break-words">
                                    <p className={`text-sm font-bold mb-1 ${insight.type === 'critical' ? 'text-red-500' : 'text-green-600 dark:text-green-500'}`}>
                                        {insight.title}
                                    </p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 break-words">{insight.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Interactive Roadmap */}
                <div className="lg:col-span-8">
                    <Card className="h-full relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <CardTitle className="text-2xl font-bold">{t("learningJourney") || "Öğrenme Yolculuğu"}</CardTitle>
                            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Plan</span>
                        </CardHeader>
                        
                        <CardContent className="relative pl-8 md:pl-12 space-y-12 pb-10">
                            {/* Roadmap Vertical Line */}
                            <div className="absolute left-[23px] md:left-[39px] top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-500 via-purple-400 to-zinc-200 dark:to-zinc-800 rounded-full"></div>
                            
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {Array.isArray(steps) && steps.map((step: any, idx: number) => {
                                const isCompleted = step.status === 'completed';
                                const isInProgress = step.status === 'in_progress';
                                const isLocked = step.status === 'locked';

                                return (
                                    <div key={idx} className={`relative ${isLocked ? 'opacity-60' : ''}`}>
                                        {isCompleted && (
                                            <div className="absolute -left-[35px] md:-left-[45px] top-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-600 flex items-center justify-center border-[3px] md:border-4 border-white dark:border-zinc-950 z-10 shadow-sm">
                                                <Check className="text-white w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                        )}
                                        {isInProgress && (
                                            <div className="absolute -left-[35px] md:-left-[45px] top-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border-[3px] md:border-4 border-indigo-600 z-10 shadow-sm ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950">
                                                <Loader2 className="text-indigo-600 w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                            </div>
                                        )}
                                        {isLocked && (
                                            <div className="absolute -left-[35px] md:-left-[45px] top-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-[3px] md:border-4 border-white dark:border-zinc-950 z-10">
                                                <Lock className="text-zinc-400 w-3 h-3 md:w-4 md:h-4" />
                                            </div>
                                        )}

                                        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl ${isCompleted ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30' : isInProgress ? 'bg-white dark:bg-zinc-900 border-2 border-indigo-500 shadow-sm' : 'bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800'}`}>
                                            <div className="w-full">
                                                <h4 className={`text-lg font-bold mb-1 ${isLocked ? 'text-muted-foreground' : 'text-zinc-900 dark:text-zinc-100'}`}>{step.title}</h4>
                                                <p className={isLocked ? 'text-muted-foreground/70 text-sm' : 'text-muted-foreground text-sm'}>{step.description}</p>
                                                
                                                {isInProgress && step.progress !== undefined && (
                                                    <div className="mt-4 flex items-center gap-4 w-full max-w-sm">
                                                        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                                            <div className="bg-indigo-600 h-full" style={{ width: `${step.progress}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-mono font-bold text-muted-foreground">{step.progress}%</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 shrink-0 mt-4 md:mt-0 w-full md:w-auto">
                                                {isCompleted && (
                                                    <>
                                                        <span className="text-xs font-mono text-green-600 dark:text-green-400 uppercase font-bold text-center md:text-left">{t("completed") || "Tamamlandı"}</span>
                                                        <Button variant="ghost" size="icon" className="h-10 w-full md:h-8 md:w-8 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50">
                                                            <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto" />
                                                        </Button>
                                                    </>
                                                )}
                                                {isInProgress && (
                                                    <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold min-h-[44px]">{t("continue") || "Devam Et"}</Button>
                                                )}
                                                {isLocked && (
                                                    <span className="text-xs font-mono text-zinc-400 uppercase font-bold text-center md:text-left">{t("locked") || "Kilitli"}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
