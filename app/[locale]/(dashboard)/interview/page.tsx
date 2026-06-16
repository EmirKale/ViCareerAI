"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Sparkles, Activity, ChevronLeft, Image as ImageIcon, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function AIInterviewPage() {
    const [isRecording, setIsRecording] = useState(false);
    const t = useTranslations("Interview");

    return (
        <div className="h-full flex flex-col items-center justify-center py-8">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6 flex items-center gap-2 w-full max-w-lg">
                <span>🚧</span>
                <span className="text-yellow-400 text-sm">
                    Bu özellik yakında aktif olacak. Şu an önizleme modunda.
                </span>
            </div>
            {/* Header */}
            <div className="w-full max-w-lg flex items-center justify-between mb-8">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    ViCareer AI
                </div>
                <div className="w-6 h-6"></div> {/* Spacer for center alignment */}
            </div>

            {/* Main Interview Container */}
            <div className="w-full max-w-lg space-y-6">
                
                {/* Avatar / Video area */}
                <Card className="overflow-hidden border-2 shadow-lg">
                    <div className="relative w-full aspect-video flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                        {/* Placeholder for 3D AI Avatar */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5"></div>
                        <Image 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwYocT5yDfRzW3qaficDXXtyMTt9M8ZrHNkwxSB03ob_ApNWafgEUsdjr_pgvsSLfGt8OUENFXzCLjB1mBq2C0oJ_8FskaRUXY6Y8m0LDyk7gFo1pllpblX6rKvmpk3DHKB4sH0EYT9esfm6GVHu2vUKK6wFLPcSDfP2bWymW0mzWc8vDtVastZWiMVtUmi0iv_eyv3FkaisoEQvOLbMiQqknln4m-NbEARDeI3BrQ08xgm_jEMv8vezVzg2S50q9zLer0TmGtdDns" 
                            alt="AI Avatar" 
                            width={300} 
                            height={300} 
                            className="object-contain w-3/4 h-3/4 opacity-90 mix-blend-multiply dark:mix-blend-screen"
                        />
                        
                        {/* Active Speaker Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/80 dark:bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-[bounce_1s_infinite]"></div>
                            <div className="w-1 h-4 bg-blue-600 rounded-full animate-[bounce_1.2s_infinite]"></div>
                            <div className="w-1 h-2 bg-blue-600 rounded-full animate-[bounce_0.8s_infinite]"></div>
                            <div className="w-1 h-5 bg-blue-600 rounded-full animate-[bounce_1.5s_infinite]"></div>
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-[bounce_1.1s_infinite]"></div>
                        </div>
                    </div>
                </Card>

                {/* Question Area */}
                <div className="text-center space-y-3 px-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{t("questionCount")}</p>
                    <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-zinc-900 dark:text-zinc-100">
                        {t("question")}
                    </h2>
                </div>

                {/* Live Analysis */}
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-600" />
                                {t("liveAnalysis")}
                            </h3>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Circular Score */}
                            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#2563EB" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.85)} strokeLinecap="round" />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-xl font-black">85</span>
                                    <span className="text-[10px] text-muted-foreground font-bold">%</span>
                                </div>
                            </div>
                            
                            {/* Live Feedback Points */}
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-medium">{t("strongStart")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-medium">{t("clearArtic")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-medium">{t("pacingFast")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Bars */}
                        <div className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-muted-foreground uppercase tracking-wider">{t("techAccuracy")}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">92%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-muted-foreground uppercase tracking-wider">{t("fluency")}</span>
                                    <span className="text-blue-600 dark:text-blue-400">88%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-muted-foreground uppercase tracking-wider">{t("confidence")}</span>
                                    <span className="text-purple-600 dark:text-purple-400">76%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '76%' }}></div>
                                </div>
                            </div>
                            <div className="pt-4 mt-2 flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t("tone")}</span>
                                <span className="text-xs font-bold bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 rounded-md">{t("toneValue")}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Controls Area */}
                <div className="pt-2 space-y-4">
                    {/* User text input (simulated) */}
                    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {t("userSim")}
                        </div>
                        <div className="w-1 h-4 bg-blue-600 animate-pulse rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <Button 
                            variant="outline" 
                            className="font-bold border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" /> {t("showResume")}
                        </Button>
                        <Button 
                            size="lg"
                            className={`flex-1 font-bold h-12 transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'}`}
                            onClick={() => setIsRecording(!isRecording)}
                        >
                            <Mic className="w-5 h-5 mr-2" />
                            {isRecording ? t("stopRecording") : t("answer")}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
