"use client";

import { useTranslations } from "next-intl";
import { ChevronRight, Check, Loader2, Lock, TrendingUp, BrainCircuit, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RoadmapPage() {
    const t = useTranslations("Roadmap");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6 flex items-center gap-2">
                <span>🚧</span>
                <span className="text-yellow-400 text-sm">
                    Bu özellik yakında aktif olacak. Şu an önizleme modunda.
                </span>
            </div>
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{t("title")}</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">{t("desc")}</p>
                </div>
                <div className="flex gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md">
                        <Zap className="w-5 h-5" />
                        {t("resumeAnalysis")}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Metrics Bento Grid */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <TrendingUp className="w-16 h-16 text-white" />
                        </div>
                        <CardContent className="p-6">
                            <p className="text-xs uppercase mb-2 font-bold tracking-widest text-blue-100">{t("skillsScore")}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">84</span>
                                <span className="text-xl text-blue-200">/100</span>
                            </div>
                            <div className="mt-4 w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-[84%] rounded-full"></div>
                            </div>
                            <p className="mt-4 text-sm text-blue-100">{t("sinceLastAssessment")}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="text-xs uppercase font-bold tracking-widest text-muted-foreground">{t("readinessForecast")}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t("architecture")}</span>
                                <span className="text-blue-600 dark:text-blue-400 font-mono text-sm font-bold">92%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t("optimization")}</span>
                                <span className="text-muted-foreground font-mono text-sm">68%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t("leadership")}</span>
                                <span className="text-muted-foreground font-mono text-sm">45%</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Recommendations */}
                    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                                <BrainCircuit className="text-blue-500 w-5 h-5" />
                                {t("aiInsights")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <p className="text-sm font-bold text-red-500 mb-1">{t("criticalPriority")}</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("criticalPriorityDesc")}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <p className="text-sm font-bold text-green-600 dark:text-green-500 mb-1">{t("growthOpportunity")}</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("growthOpportunityDesc")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Interactive Roadmap */}
                <div className="lg:col-span-8">
                    <Card className="h-full relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <CardTitle className="text-2xl font-bold">{t("learningJourney")}</CardTitle>
                            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{t("level")}</span>
                        </CardHeader>
                        
                        <CardContent className="relative pl-12 space-y-12 pb-10">
                            {/* Roadmap Vertical Line */}
                            <div className="absolute left-[39px] top-4 bottom-4 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-zinc-200 dark:to-zinc-800 rounded-full"></div>
                            
                            {/* Step 1: Completed */}
                            <div className="relative">
                                <div className="absolute -left-[45px] top-1 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white dark:border-zinc-950 z-10 shadow-sm">
                                    <Check className="text-white w-5 h-5" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                                    <div>
                                        <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">{t("step1Title")}</h4>
                                        <p className="text-muted-foreground text-sm">{t("step1Desc")}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase font-bold">{t("completed")}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50">
                                            <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: In Progress */}
                            <div className="relative">
                                <div className="absolute -left-[45px] top-1 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border-4 border-blue-600 z-10 shadow-sm ring-2 ring-blue-500/20 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950">
                                    <Loader2 className="text-blue-600 w-5 h-5 animate-spin" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-blue-500 shadow-sm">
                                    <div className="w-full">
                                        <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">{t("step2Title")}</h4>
                                        <p className="text-muted-foreground text-sm">{t("step2Desc")}</p>
                                        <div className="mt-4 flex items-center gap-4 w-full max-w-sm">
                                            <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-600 h-full w-[65%]"></div>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-muted-foreground">65%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 mt-4 md:mt-0">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">{t("continue")}</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Locked */}
                            <div className="relative opacity-60">
                                <div className="absolute -left-[45px] top-1 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-950 z-10">
                                    <Lock className="text-zinc-400 w-4 h-4" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                    <div>
                                        <h4 className="text-lg font-bold text-muted-foreground mb-1">{t("step3Title")}</h4>
                                        <p className="text-muted-foreground/70 text-sm">{t("step3Desc")}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs font-mono text-zinc-400 uppercase font-bold">{t("locked")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4: Locked */}
                            <div className="relative opacity-60">
                                <div className="absolute -left-[45px] top-1 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-950 z-10">
                                    <Lock className="text-zinc-400 w-4 h-4" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                    <div>
                                        <h4 className="text-lg font-bold text-muted-foreground mb-1">{t("step4Title")}</h4>
                                        <p className="text-muted-foreground/70 text-sm">{t("step4Desc")}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs font-mono text-zinc-400 uppercase font-bold">{t("locked")}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
