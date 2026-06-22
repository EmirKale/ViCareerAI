"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Share2, Box, Users, Terminal, ArrowRight, Verified, Upload, FileText, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SkillsClient({ profile, analysisData, cvs }: { profile: any, analysisData: any, cvs: any[] }) {
    const t = useTranslations("Skills");
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showUpload, setShowUpload] = useState(!analysisData);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalyzeFromCV = async (cvId: string) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/skills/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success("Analiz tamamlandı!");
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
            // First extract text
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "raw");

            const parseRes = await fetch("/api/cv/parse-file", {
                method: "POST",
                body: formData
            });
            const parseData = await parseRes.json();
            
            if (!parseRes.ok) throw new Error(parseData.error || "Dosya okunamadı");

            // Then analyze
            const res = await fetch("/api/skills/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileContent: parseData.text })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success("Analiz tamamlandı!");
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
                        <CardTitle className="text-2xl">{t("title") || "Beceri Analizi"}</CardTitle>
                        <CardDescription>
                            Yeteneklerinizi AI ile analiz edin ve size özel içgörüler alın.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center p-8">
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center gap-4 text-blue-600">
                                <Loader2 className="w-12 h-12 animate-spin" />
                                <p className="font-medium animate-pulse">Yapay zeka CV&apos;nizi analiz ediyor...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                                {cvs.length > 0 ? (
                                    <div className="w-full space-y-4">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase text-center">Mevcut CV&apos;niz ile analiz edin</h3>
                                        {cvs.map(cv => (
                                            <Button 
                                                key={cv.id} 
                                                variant="outline" 
                                                className="w-full justify-between h-14"
                                                onClick={() => handleAnalyzeFromCV(cv.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-blue-500" />
                                                    <span className="font-semibold">{cv.title || "CV'm"}</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-14 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                            onClick={() => router.push("/cv/new")}
                                        >
                                            <FileText className="w-5 h-5 mr-2" />
                                            Yeni CV Oluştur
                                        </Button>
                                    </div>
                                )}

                                <div className="flex items-center w-full gap-4">
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
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-5 h-5 mr-2" />
                                        Dışarıdan CV Yükle (PDF / DOCX)
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-2">Maksimum 5MB dosya boyutu</p>
                                </div>
                                
                                {analysisData && (
                                    <Button variant="link" onClick={() => setShowUpload(false)} className="mt-4">
                                        İptal Et ve Analize Dön
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { scores, overall_score, insight, recommendations } = analysisData;
    const name = profile?.full_name || "Kullanıcı";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{t("title") || "Beceri Analizi"}</h1>
                <Button variant="outline" size="sm" onClick={() => setShowUpload(true)} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Yeniden Analiz Et
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Profile Info & AI Score */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <Card className="overflow-hidden">
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white dark:border-zinc-900 shadow-xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                                    {name.charAt(0)}
                                </div>
                                <div className="absolute bottom-4 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm">
                                    <Verified className="w-4 h-4" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{name}</h2>
                            <p className="text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-widest text-xs font-bold">{t("role") || "Kullanıcı"}</p>
                            
                            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mb-6"></div>
                            
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{t("aiResumeScore") || "AI Genel Puanı"}</span>
                                    <span className="text-blue-600 dark:text-blue-400 text-xl font-black">{overall_score}<span className="text-sm font-medium text-muted-foreground">/100</span></span>
                                </div>
                                <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]" style={{ width: `${overall_score}%` }}></div>
                                </div>
                                <p className="text-muted-foreground mt-3 text-left text-sm">{t("scoreDesc") || "CV verinize dayalı genel değerlendirme."}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                                <Sparkles className="text-blue-500 w-5 h-5" />
                                {t("aiInsights") || "AI İçgörüleri"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <p className="text-zinc-700 dark:text-zinc-300 italic text-sm">{insight}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Radar Chart Visualization */}
                <div className="md:col-span-8">
                    <Card className="h-full min-h-[500px] flex flex-col overflow-hidden relative">
                        <div className="absolute inset-0 bg-grid-zinc-100 dark:bg-grid-zinc-900/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.5))] pointer-events-none"></div>
                        <CardHeader className="flex flex-row items-start justify-between relative z-10 pb-0">
                            <div>
                                <CardTitle className="text-2xl font-bold">{t("competencyMatrix") || "Yetkinlik Matrisi"}</CardTitle>
                                <CardDescription className="text-base mt-1">{t("competencyDesc") || "Farklı beceri alanlarındaki dağılımınız"}</CardDescription>
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl shadow-sm">
                                <Share2 className="w-4 h-4 text-zinc-500" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center relative z-10 p-10">
                            <div className="relative w-full max-w-md aspect-square flex items-center justify-center mt-6 mb-6">
                                {/* Background Circles */}
                                <div className="absolute inset-0 border border-zinc-200 dark:border-zinc-800 rounded-full"></div>
                                <div className="absolute inset-[15%] border border-zinc-200 dark:border-zinc-800 rounded-full"></div>
                                <div className="absolute inset-[30%] border border-zinc-200 dark:border-zinc-800 rounded-full"></div>
                                <div className="absolute inset-[45%] border border-zinc-200 dark:border-zinc-800 rounded-full"></div>
                                
                                {/* Axes */}
                                <div className="absolute w-full h-px bg-zinc-200 dark:bg-zinc-800 rotate-0"></div>
                                <div className="absolute w-full h-px bg-zinc-200 dark:bg-zinc-800 rotate-[60deg]"></div>
                                <div className="absolute w-full h-px bg-zinc-200 dark:bg-zinc-800 rotate-[120deg]"></div>
                                
                                {/* Skill Labels */}
                                <span className="absolute -top-8 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">Teknik Beceriler ({scores?.teknik || 0})</span>
                                <span className="absolute -bottom-8 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">Problem Çözme ({scores?.problemCozme || 0})</span>
                                <span className="absolute -left-20 top-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">Liderlik ({scores?.liderlik || 0})</span>
                                <span className="absolute -right-24 top-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">İletişim ({scores?.iletisim || 0})</span>
                                <span className="absolute -left-24 bottom-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">İşbirliği ({scores?.isbirligi || 0})</span>
                                <span className="absolute -right-16 bottom-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">Uyumluluk ({scores?.uyumluluk || 0})</span>
                                
                                {/* Calculating SVG Polygon Points (0-100 scale -> 0-50 radius) */}
                                {/* Angles: Top=270(Teknik), Right-Top=330(Iletisim), Right-Bottom=30(Uyumluluk), Bottom=90(Problem), Left-Bottom=150(Isbirligi), Left-Top=210(Liderlik) */}
                                {(() => {
                                    const getPoint = (score: number, angleDeg: number) => {
                                        const r = (score || 0) / 100 * 50; 
                                        const a = (angleDeg - 90) * Math.PI / 180;
                                        return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
                                    };
                                    
                                    const p1 = getPoint(scores?.teknik, 0);
                                    const p2 = getPoint(scores?.iletisim, 60);
                                    const p3 = getPoint(scores?.uyumluluk, 120);
                                    const p4 = getPoint(scores?.problemCozme, 180);
                                    const p5 = getPoint(scores?.isbirligi, 240);
                                    const p6 = getPoint(scores?.liderlik, 300);
                                    
                                    const points = `${p1} ${p2} ${p3} ${p4} ${p5} ${p6}`;
                                    
                                    return (
                                        <svg className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible" viewBox="0 0 100 100">
                                            <polygon fill="rgba(37, 99, 235, 0.25)" points={points} stroke="#2563eb" strokeWidth="1.5"></polygon>
                                            {[p1, p2, p3, p4, p5, p6].map((p, i) => {
                                                const [cx, cy] = p.split(',');
                                                return <circle key={i} cx={cx} cy={cy} fill="#2563eb" r="2" className="shadow-lg"></circle>
                                            })}
                                        </svg>
                                    );
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Recommendations */}
                {recommendations && recommendations.length > 0 && (
                    <div className="md:col-span-12 mt-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("recommendedGrowth") || "Gelişim Önerileri"}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {recommendations.slice(0, 3).map((rec: any, idx: number) => {
                                const colors = ["blue", "purple", "emerald"];
                                const icons = [<Box key={1} className="w-6 h-6"/>, <Users key={2} className="w-6 h-6"/>, <Terminal key={3} className="w-6 h-6"/>];
                                const c = colors[idx % 3];
                                const Icon = icons[idx % 3];
                                
                                return (
                                    <Card key={idx} className={`hover:border-${c}-300 dark:hover:border-${c}-700 transition-all cursor-pointer group shadow-sm hover:shadow-md`}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-12 h-12 rounded-xl bg-${c}-100 dark:bg-${c}-900/30 flex items-center justify-center text-${c}-600 dark:text-${c}-400`}>
                                                    {Icon}
                                                </div>
                                                <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{rec.category || "Gelişim"}</span>
                                            </div>
                                            <h4 className={`text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-${c}-600 dark:group-hover:text-${c}-400 transition-colors`}>{rec.title}</h4>
                                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{rec.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
