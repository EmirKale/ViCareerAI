"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Share2, Box, Users, Terminal, ArrowRight, Verified } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SkillsPage() {
    const t = useTranslations("Skills");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Profile Info & AI Score */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <Card className="overflow-hidden">
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white dark:border-zinc-900 shadow-xl">
                                    <Image 
                                        width={96} height={96}
                                        alt="Profile Large" 
                                        className="w-full h-full object-cover" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgRnHIjBMQ8ufBLrjLM22vA9j8dADGjnj-lDcLEaQt61oRYvCDrRxCIKTbp40u3bM1aziQYgFs7OV10g4cfUeN8W2z0F3HHpb3DwqGgteqYAI6wGJ7yQ3ty6PQksm27MvbaJeaVyQf8WQmNCFlU5wtHiAqBbrQGA9kK0_PJSDSyqfwoAMtvmaJHjVPOyngiBLK5s_qhJO2cYTuufaQxyV0z5iTONj7OoQWlvGj8R6R9wOxreBdZ8QqtVYwSk8db3r7DnDJGFC9AwhS"
                                    />
                                </div>
                                <div className="absolute bottom-4 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm">
                                    <Verified className="w-4 h-4" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Alex Sterling</h2>
                            <p className="text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-widest text-xs font-bold">{t("role")}</p>
                            
                            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mb-6"></div>
                            
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{t("aiResumeScore")}</span>
                                    <span className="text-blue-600 dark:text-blue-400 text-xl font-black">85<span className="text-sm font-medium text-muted-foreground">/100</span></span>
                                </div>
                                <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full w-[85%] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
                                </div>
                                <p className="text-muted-foreground mt-3 text-left text-sm">{t("scoreDesc")}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                                <Sparkles className="text-blue-500 w-5 h-5" />
                                {t("aiInsights")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <p className="text-zinc-700 dark:text-zinc-300 italic text-sm">{t("insightDesc")}</p>
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
                                <CardTitle className="text-2xl font-bold">{t("competencyMatrix")}</CardTitle>
                                <CardDescription className="text-base mt-1">{t("competencyDesc")}</CardDescription>
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl shadow-sm">
                                <Share2 className="w-4 h-4 text-zinc-500" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center relative z-10 p-10">
                            {/* Simulated Radar Chart Visualization */}
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
                                <span className="absolute -top-8 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">{t("techSkills")}</span>
                                <span className="absolute -bottom-8 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">{t("problemSolving")}</span>
                                <span className="absolute -left-20 top-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">{t("leadership")}</span>
                                <span className="absolute -right-24 top-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">{t("communication")}</span>
                                <span className="absolute -left-24 bottom-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">{t("collaboration")}</span>
                                <span className="absolute -right-16 bottom-1/4 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 px-2">{t("adaptability")}</span>
                                
                                {/* The Polygon (SVG) */}
                                <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100">
                                    <polygon fill="rgba(37, 99, 235, 0.15)" points="50,10 85,35 75,75 50,90 25,75 15,35" stroke="#2563eb" strokeWidth="1.5"></polygon>
                                    <circle cx="50" cy="10" fill="#2563eb" r="1.5" className="shadow-lg"></circle>
                                    <circle cx="85" cy="35" fill="#2563eb" r="1.5" className="shadow-lg"></circle>
                                    <circle cx="75" cy="75" fill="#2563eb" r="1.5" className="shadow-lg"></circle>
                                    <circle cx="50" cy="90" fill="#2563eb" r="1.5" className="shadow-lg"></circle>
                                    <circle cx="25" cy="75" fill="#2563eb" r="1.5" className="shadow-lg"></circle>
                                    <circle cx="15" cy="35" fill="#2563eb" r="1.5" className="shadow-lg"></circle>
                                </svg>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bento Skills Suggestions */}
                <div className="md:col-span-12 mt-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("recommendedGrowth")}</h3>
                        <Button variant="link" className="text-blue-600 font-bold tracking-widest text-xs uppercase">{t("viewAll")}</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Suggestion 1 */}
                        <Card className="hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Box className="w-6 h-6" />
                                    </div>
                                    <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{t("hiredRate", {percent: "12"})}</span>
                                </div>
                                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t("s1Title")}</h4>
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{t("s1Desc")}</p>
                                <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-mono text-xs font-bold tracking-widest uppercase group-hover:gap-2 transition-all">
                                    <span>{t("startModule")}</span>
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Suggestion 2 */}
                        <Card className="hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{t("hiredRate", {percent: "8"})}</span>
                                </div>
                                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t("s2Title")}</h4>
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{t("s2Desc")}</p>
                                <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 font-mono text-xs font-bold tracking-widest uppercase group-hover:gap-2 transition-all">
                                    <span>{t("accessWorkshop")}</span>
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Suggestion 3 */}
                        <Card className="hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Terminal className="w-6 h-6" />
                                    </div>
                                    <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{t("hiredRate", {percent: "15"})}</span>
                                </div>
                                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t("s3Title")}</h4>
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{t("s3Desc")}</p>
                                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase group-hover:gap-2 transition-all">
                                    <span>{t("quickLearning")}</span>
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
