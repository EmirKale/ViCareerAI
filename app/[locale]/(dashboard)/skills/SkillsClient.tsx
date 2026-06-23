"use client";

import { useTranslations, useLocale } from "next-intl";
import { Sparkles, Box, Users, Terminal, ArrowRight, Upload, FileText, Loader2, RefreshCw, AlertTriangle, Target, CheckCircle2, Zap, ArrowRightCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SkillsClient({ analysisData, cvs }: { analysisData: any, cvs: any[] }) {
    const t = useTranslations("Skills");
    const locale = useLocale();
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showUpload, setShowUpload] = useState(!analysisData);
    const [targetRole, setTargetRole] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalyzeFromCV = async (cvId: string) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/skills/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvId, targetRole, locale })
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
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "raw");

            const parseRes = await fetch("/api/cv/parse-file", {
                method: "POST",
                body: formData
            });
            const parseData = await parseRes.json();
            
            if (!parseRes.ok) throw new Error(parseData.error || "Dosya okunamadı");

            const res = await fetch("/api/skills/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileContent: parseData.text, targetRole, locale })
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
                            Hedef pozisyonunuzu belirleyin ve yeteneklerinizi AI ile analiz edin.
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
                                <div className="w-full space-y-2 mb-2">
                                    <Label htmlFor="role" className="font-bold">Hedef Pozisyon (Opsiyonel)</Label>
                                    <Input 
                                        id="role"
                                        placeholder="Örn: Frontend Developer, Product Manager..." 
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        className="h-12 border-zinc-300 dark:border-zinc-700 w-full text-base sm:text-sm"
                                    />
                                    <p className="text-[11px] text-muted-foreground">Belirtirseniz analiz tamamen bu role uygunluğunuz üzerinden yapılır.</p>
                                </div>

                                {cvs.length > 0 ? (
                                    <div className="w-full space-y-4">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase text-center">Mevcut CV&apos;niz ile analiz edin</h3>
                                        {cvs.map(cv => (
                                            <LiquidButton 
                                                key={cv.id} 
                                                className="w-full justify-between h-16 bg-white/60 dark:bg-zinc-900/40"
                                                onClick={() => handleAnalyzeFromCV(cv.id)}
                                                icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{cv.title || "CV'm"}</span>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-zinc-400" />
                                            </LiquidButton>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <LiquidButton 
                                            className="w-full h-16 justify-center"
                                            onClick={() => router.push("/cv/new")}
                                            icon={<FileText className="w-5 h-5" />}
                                        >
                                            Yeni CV Oluştur
                                        </LiquidButton>
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
                                        className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
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
    
    // New Advanced fields parsed from the JSONB scores object
    const targetRoleText = scores?.target_role;
    const atsScore = scores?.ats_score || overall_score;
    const superpower = scores?.superpower;
    const redFlags = scores?.red_flags || [];
    const actionPlan = scores?.action_plan || [];
    const cvCorrections = scores?.cv_corrections || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("title") || "Beceri Analizi"}</h1>
                    {targetRoleText && <p className="text-muted-foreground mt-2 flex items-center gap-1.5 font-medium"><Target className="w-4 h-4 text-blue-500"/> Hedef: <span className="text-zinc-900 dark:text-zinc-100 font-bold">{targetRoleText}</span></p>}
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowUpload(true)} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Yeniden Analiz Et</span>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* AI Insight & Superpower */}
                <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-100 dark:border-blue-900/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                                <Sparkles className="text-blue-500 w-5 h-5" />
                                {t("aiInsights") || "Yapay Zeka Değerlendirmesi"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">{insight}</p>
                        </CardContent>
                    </Card>

                    {superpower && (
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-100 dark:border-amber-900/50 relative overflow-hidden shadow-sm">
                        <div className="hidden md:block absolute -right-6 -top-6 opacity-10">
                            <Zap className="w-32 h-32 text-amber-500" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="flex items-center gap-2 text-lg text-amber-900 dark:text-amber-100">
                                <Zap className="text-amber-500 w-5 h-5 fill-amber-500/20" />
                                Süper Gücün
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-amber-800 dark:text-amber-200 font-bold text-lg leading-relaxed">{superpower}</p>
                        </CardContent>
                    </Card>
                    )}
                </div>

                {/* Left Column: Scores & Radar */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    {/* Overall & ATS Score */}
                    <Card className="shadow-sm">
                        <CardContent className="p-6 space-y-8">
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Activity className="w-4 h-4 text-blue-500"/>Genel Uygunluk</span>
                                    <span className="text-blue-600 dark:text-blue-400 text-xl font-black">{overall_score}<span className="text-sm font-medium text-muted-foreground">/100</span></span>
                                </div>
                                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${overall_score}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Terminal className="w-4 h-4 text-emerald-500"/>ATS Skoru</span>
                                    <span className={`text-xl font-black ${atsScore >= 80 ? 'text-emerald-600' : atsScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                        {atsScore}<span className="text-sm font-medium text-muted-foreground">/100</span>
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${atsScore >= 80 ? 'bg-emerald-500' : atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${atsScore}%` }}></div>
                                </div>
                                {scores?.ats_feedback && scores.ats_feedback.length > 0 && (
                                    <div className="mt-4 space-y-2 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/50">
                                        {scores.ats_feedback.map((fb: string, i: number) => (
                                            <p key={i} className="text-xs text-amber-800 dark:text-amber-300 font-medium flex items-start gap-1.5">
                                                <span className="text-amber-500 mt-0.5">•</span> {fb}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Red Flags */}
                    {redFlags.length > 0 && (
                        <Card className="border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-base">
                                    <AlertTriangle className="w-5 h-5" />
                                    Kırmızı Bayraklar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {redFlags.map((flag: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-red-800 dark:text-red-300">
                                            <div className="min-w-2 h-2 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Radar Chart */}
                <div className="md:col-span-8">
                    <Card className="h-full min-h-[400px] flex flex-col overflow-hidden relative shadow-sm">
                        <div className="absolute inset-0 bg-grid-zinc-100 dark:bg-grid-zinc-900/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.5))] pointer-events-none"></div>
                        <CardHeader className="flex flex-row items-start justify-between relative z-10 pb-0">
                            <div>
                                <CardTitle className="text-xl font-bold">{t("competencyMatrix") || "Yetkinlik Matrisi"}</CardTitle>
                                <CardDescription className="text-sm mt-1">{t("competencyDesc") || "Farklı beceri alanlarındaki dağılımınız"}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center relative z-10 p-6">
                            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center mt-6 mb-6">
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
                                <span className="absolute -top-6 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-1">Teknik ({scores?.teknik || 0})</span>
                                <span className="absolute -bottom-6 text-zinc-500 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-1">Problem Çözme ({scores?.problemCozme || 0})</span>
                                <span className="absolute -left-16 top-1/4 text-zinc-500 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-1">Liderlik ({scores?.liderlik || 0})</span>
                                <span className="absolute -right-16 top-1/4 text-zinc-500 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-1">İletişim ({scores?.iletisim || 0})</span>
                                <span className="absolute -left-16 bottom-1/4 text-zinc-500 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-1">İşbirliği ({scores?.isbirligi || 0})</span>
                                <span className="absolute -right-16 bottom-1/4 text-zinc-500 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-1">Uyumluluk ({scores?.uyumluluk || 0})</span>
                                
                                {/* Calculating SVG Polygon Points */}
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

                {/* CV Corrections Before / After */}
                {cvCorrections.length > 0 && (
                    <div className="md:col-span-12 mt-4">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 px-2 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            CV Cümle Düzeltme Önerileri
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {cvCorrections.map((corr: any, idx: number) => (
                                <Card key={idx} className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col max-w-full">
                                    <div className="flex flex-col md:flex-row flex-grow">
                                        <div className="p-5 bg-red-50/40 dark:bg-red-950/20 md:border-r border-b md:border-b-0 border-zinc-200 dark:border-zinc-800 md:w-1/2 relative flex flex-col">
                                            <div className="self-start text-[10px] font-bold text-red-500 uppercase mb-3 tracking-wider bg-red-100 dark:bg-red-900/30 inline-block px-2 py-0.5 rounded">Senin Yazdığın</div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-through decoration-red-300 dark:decoration-red-800/60 break-words whitespace-pre-wrap">{corr.original}</p>
                                            
                                            {/* Mobile Arrow Divider */}
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 md:hidden z-10 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 p-1">
                                                <ArrowRight className="w-3 h-3 text-zinc-400 rotate-90" />
                                            </div>
                                        </div>
                                        <div className="p-5 bg-emerald-50/40 dark:bg-emerald-950/20 md:w-1/2 pt-8 md:pt-5">
                                            <div className="self-start text-[10px] font-bold text-emerald-600 uppercase mb-3 tracking-wider bg-emerald-100 dark:bg-emerald-900/30 inline-flex items-center gap-1 px-2 py-0.5 rounded">
                                                <span>AI Önerisi</span>
                                                <Sparkles className="w-3 h-3"/>
                                            </div>
                                            <p className="text-sm text-zinc-900 dark:text-zinc-100 font-semibold break-words whitespace-pre-wrap">{corr.improved}</p>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3.5 text-xs text-muted-foreground border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-2">
                                        <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span><strong className="text-zinc-700 dark:text-zinc-300">Neden Değiştirilmeli?</strong> {corr.reason}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Plan */}
                {actionPlan.length > 0 && (
                    <div className="md:col-span-12 mt-6">
                        <Card className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md border-0">
                            <CardHeader className="pb-5">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400 dark:text-emerald-600" />
                                    Aksiyon Planı (Hemen Başla)
                                </CardTitle>
                                <CardDescription className="text-zinc-400 dark:text-zinc-600">CV&apos;ni ve kariyerini güçlendirmek için bugün atman gereken 3 adım.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {actionPlan.map((plan: string, i: number) => (
                                        <div key={i} className="flex items-start gap-4 bg-white/10 dark:bg-black/5 p-5 rounded-xl transition-all hover:bg-white/15 dark:hover:bg-black/10 w-full max-w-full overflow-hidden">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-blue-500/30">{i+1}</div>
                                            <p className="font-semibold text-zinc-100 dark:text-zinc-800 text-base leading-relaxed pt-1 break-words w-full">{plan}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* AI Recommendations */}
                {recommendations && recommendations.length > 0 && (
                    <div className="md:col-span-12 mt-6">
                        <div className="flex items-center justify-between mb-5 px-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <ArrowRightCircle className="w-5 h-5 text-blue-500" />
                                {t("recommendedGrowth") || "Gelişim Önerileri"}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {recommendations.slice(0, 3).map((rec: any, idx: number) => {
                                const colors = ["blue", "purple", "emerald"];
                                const icons = [<Box key={1} className="w-6 h-6"/>, <Users key={2} className="w-6 h-6"/>, <Terminal key={3} className="w-6 h-6"/>];
                                const c = colors[idx % 3];
                                const Icon = icons[idx % 3];
                                
                                return (
                                    <Card key={idx} className={`hover:border-${c}-300 dark:hover:border-${c}-700 transition-all flex flex-col shadow-sm hover:shadow-md h-full`}>
                                        <CardContent className="p-6 flex-grow">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-12 h-12 rounded-xl bg-${c}-100 dark:bg-${c}-900/30 flex items-center justify-center text-${c}-600 dark:text-${c}-400`}>
                                                    {Icon}
                                                </div>
                                                <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{rec.category || "Gelişim"}</span>
                                            </div>
                                            <h4 className={`text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3`}>{rec.title}</h4>
                                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">{rec.description}</p>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                                            <Button 
                                                variant="ghost" 
                                                className={`w-full min-h-[44px] justify-between text-${c}-600 dark:text-${c}-400 hover:text-${c}-700 hover:bg-${c}-50 dark:hover:bg-${c}-900/20 font-semibold`}
                                                onClick={() => router.push("/roadmap")}
                                            >
                                                Yol Haritasına Git
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </CardFooter>
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
