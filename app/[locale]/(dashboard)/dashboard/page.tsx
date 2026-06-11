"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText, Briefcase, PlusCircle, FileSearch, ArrowRight, Sparkles,
    TrendingUp, Lightbulb, Target, Clock, ChevronRight, PenTool
} from "lucide-react";

interface QuotaData {
    cv_count: number;
    letter_count: number;
    analysis_count: number;
    cover_letter_count: number;
}

export default function DashboardPage() {
    const t = useTranslations("Dashboard");
    const [quota, setQuota] = useState<QuotaData | null>(null);
    const [userName, setUserName] = useState("Kullanıcı");
    const [plan, setPlan] = useState("free");

    useEffect(() => {
        Promise.all([
            fetch("/api/profile").then(r => r.ok ? r.json() : null),
            fetch("/api/quota").then(r => r.ok ? r.json() : null),
        ]).then(([profileData, quotaData]) => {
            if (profileData) {
                setUserName(profileData.full_name || profileData.email?.split("@")[0] || "Kullanıcı");
                setPlan(profileData.plan || "free");
            }
            if (quotaData) setQuota(quotaData);
        }).catch(() => {});
    }, []);

    const maxCv = plan === "pro" ? "∞" : "2";
    const maxLetter = plan === "pro" ? "∞" : "3";
    const maxAnalysis = plan === "pro" ? "∞" : "5";

    const stats = [
        { title: t("stats.cvs"), value: quota ? `${quota.cv_count}/${maxCv}` : "...", desc: t("stats.thisMonth"), icon: FileText, color: "text-blue-500" },
        { title: t("stats.letters"), value: quota ? `${quota.cover_letter_count || 0}/${maxLetter}` : "...", desc: t("stats.thisMonth"), icon: FileText, color: "text-purple-500" },
        { title: t("stats.analysis"), value: quota ? `${quota.analysis_count}/${maxAnalysis}` : "...", desc: t("stats.used"), icon: FileSearch, color: "text-teal-500" },
        { title: t("stats.plan"), value: plan === "pro" ? t("stats.pro") : t("stats.free"), desc: plan === "pro" ? "Sınırsız erişim" : "Kısıtlı erişim", icon: Briefcase, color: plan === "pro" ? "text-yellow-500" : "text-orange-500" },
    ];

    const quickLinks = [
        { href: "/cv/history", label: t("quickAccess.cvs"), icon: FileText },
        { href: "/cover-letter/new", label: t("quickAccess.letter"), icon: PlusCircle },
        { href: "/jobs/tracker", label: t("quickAccess.applications"), icon: Briefcase },
        { href: "/jobs/discover", label: t("quickAccess.find"), icon: FileSearch },
    ];

    // Mock data for new features
    const recentDocuments = [
        { id: 1, title: "Yazılım Uzmanı CV", date: "2 saat önce", type: "cv", icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { id: 2, title: "Frontend Developer (Tech)", date: "Dün", type: "cv", icon: PenTool, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
        { id: 3, title: "Google Başvuru Mektubu", date: "3 gün önce", type: "letter", icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    ];

    const pipelineStats = [
        { label: "Başvurular", value: 12, color: "bg-blue-500" },
        { label: "Görüşmeler", value: 3, color: "bg-amber-500" },
        { label: "Teklifler", value: 1, color: "bg-green-500" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto p-4 md:p-8">

            {/* Welcome & Quick Actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("welcome", { name: userName })}</h1>
                    <p className="text-muted-foreground mt-1">{t("todayGoal")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/cv/new">
                        <Button className="gradient-brand text-white shadow-md shadow-blue-500/20">
                            <PlusCircle className="mr-2 h-4 w-4" /> {t("newCv")}
                        </Button>
                    </Link>
                    <Link href="/cover-letter/new">
                        <Button variant="outline" className="dark:border-zinc-700">
                            {t("writeLetter")}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Documents */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-5 bg-white dark:bg-zinc-900/50 shadow-sm border-zinc-200/50 dark:border-zinc-800/50">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Son Çalışmalarım
                            </CardTitle>
                            <CardDescription>Kaldığınız yerden düzenlemeye devam edin</CardDescription>
                        </div>
                        <Link href="/cv/history">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600">
                                Tümünü Gör <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {recentDocuments.map(doc => (
                                <div key={doc.id} className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-lg ${doc.bg}`}>
                                            <doc.icon className={`h-5 w-5 ${doc.color}`} />
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground">{doc.date}</div>
                                    </div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-white truncate pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.title}</h3>
                                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                        Düzenle <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Strength */}
                <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                            <Target className="h-5 w-5 text-indigo-500" /> Profil Gücü
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center pt-2 pb-6">
                        {/* Circular Progress Mockup */}
                        <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-indigo-200 dark:text-indigo-900/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-indigo-600 dark:text-indigo-400 drop-shadow-md" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-indigo-950 dark:text-indigo-50">85<span className="text-lg text-indigo-700/60 dark:text-indigo-300/60">%</span></span>
                            </div>
                        </div>
                        <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 font-medium px-2">Harika gidiyorsunuz! Özgeçmişiniz işverenlerin dikkatini çekecek düzeyde.</p>
                        <Button variant="outline" size="sm" className="mt-4 bg-white/50 dark:bg-zinc-900/50 border-indigo-200 dark:border-indigo-800 hover:bg-white dark:hover:bg-zinc-900">
                            Eksikleri Tamamla
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Application Pipeline */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" /> İş Arama İstatistikleri
                        </CardTitle>
                        <CardDescription>Son 30 günlük aktiviteniz</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5 pt-2">
                            {pipelineStats.map((stat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${stat.color} shadow-[0_0_8px_rgba(0,0,0,0.2)] shadow-${stat.color.replace('bg-', '')}`} />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{stat.label}</span>
                                    </div>
                                    <span className="font-bold text-lg">{stat.value}</span>
                                </div>
                            ))}
                            <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
                                <Link href="/jobs/tracker" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                                    Detaylı Analiz <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily AI Tip */}
                <Card className="col-span-1 lg:col-span-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                            <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50">
                                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            Günün Kariyer İpucu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <blockquote className="border-l-4 border-amber-400 pl-4 py-1 my-2 text-sm text-amber-800 dark:text-amber-200/90 italic leading-relaxed">
                            &quot;İş ilanlarındaki anahtar kelimeleri özgeçmişinize birebir eklemek, ATS (Aday Takip Sistemi) puanınızı ortalama %40 oranında artırır.&quot;
                        </blockquote>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-700/70 dark:text-amber-400/70">
                            <Sparkles className="h-3.5 w-3.5" /> AI Asistanınızdan Tavsiyeler
                        </div>
                    </CardContent>
                </Card>

                {/* Quick navigation links */}
                <Card className="col-span-1 lg:col-span-3 border-zinc-200/60 dark:border-zinc-800/60">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{t("quickAccess.title")}</CardTitle>
                        <CardDescription>{t("quickAccess.desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {quickLinks.map(link => (
                                <Link key={link.href} href={link.href as "/cv/history" | "/cover-letter/new" | "/jobs/tracker" | "/jobs/discover"}>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all group cursor-pointer h-full">
                                        <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                            <link.icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{link.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
