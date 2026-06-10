"use client";

import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Quote, CheckCircle2, AlertCircle, ArrowUpRight, BarChart3 } from "lucide-react";

export default function InterviewSummaryPage() {
    return (
        <div className="min-h-screen bg-[#09090B] text-[#e5e1e4] p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Header Navigation */}
                <div className="flex items-center gap-4 border-b border-white/[0.06] pb-4">
                    <Link href="/dashboard" className="text-[#A1A1AA] hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A1A1AA]">
                        Interview Analysis
                    </h1>
                </div>

                {/* Title Section */}
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        Interview Summary - Senior Frontend Role
                    </h2>
                    <p className="text-sm text-[#A1A1AA]">
                        Completed on Oct 24, 2023 • Technical Assessment
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Overall Performance */}
                    <Card className="bg-[#1c1b1d] border-white/[0.06] rounded-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A1A1AA]">
                                Overall Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-6 pt-0">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2563EB" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - 0.82)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-white">82</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> ABOVE AVERAGE
                            </span>
                        </CardContent>
                    </Card>

                    {/* Skill Breakdown */}
                    <Card className="bg-[#1c1b1d] border-white/[0.06] rounded-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#2563EB]" /> Skill Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            {[
                                { name: "Technical Knowledge", score: 85, color: "bg-blue-500" },
                                { name: "Communication", score: 78, color: "bg-purple-500" },
                                { name: "Problem Solving", score: 92, color: "bg-emerald-500" },
                                { name: "Confidence", score: 74, color: "bg-orange-500" },
                            ].map((skill) => (
                                <div key={skill.name} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-[#e5e1e4]">{skill.name}</span>
                                        <span className="text-white">{skill.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#131315] rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${skill.color} rounded-full`} 
                                            style={{ width: `${skill.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>

                {/* AI AI Feedback Quote */}
                <div className="relative p-8 rounded-2xl glass-panel border border-[#2563EB]/20 bg-[#2563EB]/[0.02]">
                    <div className="absolute top-4 left-4 text-[#2563EB]/20">
                        <Quote className="w-12 h-12" />
                    </div>
                    <p className="relative z-10 text-lg md:text-xl text-white leading-relaxed font-medium pl-8 italic">
                        &quot;You demonstrated strong command over React hooks and state management. To elevate your performance for senior roles, focus on articulating the &apos;why&apos; behind your architecture choices rather than just the &apos;how&apos;. When discussing system design, slow your pacing to ensure the interviewer follows your logic.&quot;
                    </p>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card className="bg-emerald-500/[0.02] border-emerald-500/20 rounded-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Deep React Knowledge</h4>
                                        <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">Exceptional understanding of component lifecycle and state optimization.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Clear articulation</h4>
                                        <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">Explained complex topics clearly and concisely.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Edge case handling</h4>
                                        <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">Proactively identified and mitigated potential edge cases in coding tasks.</p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Areas for Improvement */}
                    <Card className="bg-orange-500/[0.02] border-orange-500/20 rounded-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-orange-400 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" /> Areas for Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Slow down pacing</h4>
                                        <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">You rushed through the initial requirements gathering phase.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Explain system design trade-offs</h4>
                                        <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">Provide more context on why you chose specific architectural patterns over alternatives.</p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-12">
                    <Button variant="outline" className="flex-1 bg-transparent border-white/[0.06] text-white hover:bg-white/5 py-6">
                        Retake Interview
                    </Button>
                    <Button className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white py-6 shadow-lg shadow-blue-500/20">
                        Refine My Roadmap
                    </Button>
                </div>

            </div>
        </div>
    );
}
