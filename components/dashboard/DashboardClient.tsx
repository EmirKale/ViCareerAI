"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText, Briefcase, PlusCircle, FileSearch, ArrowRight, Sparkles,
    TrendingUp, Lightbulb, Target, Clock, ChevronRight
} from "lucide-react";

interface QuotaData {
    cv_count: number;
    letter_count: number;
    analysis_count: number;
    cover_letter_count: number;
}

interface DashboardCV {
    id: string;
    title: string;
    updated_at: string;
}

interface DashboardJob {
    id: string;
    status: string;
}

interface ProfileData {
    full_name?: string;
    email?: string;
    phone?: string;
    plan?: string;
}

interface DashboardClientProps {
    profileData: ProfileData | null;
    quotaData: QuotaData | null;
    cvData: DashboardCV[];
    jobsData: DashboardJob[];
}

export default function DashboardClient({ profileData, quotaData, cvData, jobsData }: DashboardClientProps) {
    const t = useTranslations("Dashboard");
    
    // Initialize state from props (SSR)
    const [userName, setUserName] = useState("Kullanıcı");
    const [plan, setPlan] = useState("free");
    const [profileStrength, setProfileStrength] = useState(25);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let strength = 25; // Base strength
        
        if (profileData) {
            setUserName(profileData.full_name || profileData.email?.split("@")[0] || "Kullanıcı");
            setPlan(profileData.plan || "free");
            if (profileData.full_name) strength += 15;
            if (profileData.phone) strength += 10;
        }
        
        if (cvData && cvData.length > 0) strength += 25;
        if (jobsData && jobsData.length > 0) strength += 25;
        
        setProfileStrength(Math.min(100, strength));
    }, [profileData, cvData, jobsData]);

    const maxCv = plan === "pro" ? "∞" : "2";
    const maxLetter = plan === "pro" ? "∞" : "3";
    const maxAnalysis = plan === "pro" ? "∞" : "5";

    const stats = [
        { title: t("stats.cvs"), value: quotaData ? `${quotaData.cv_count}/${maxCv}` : "...", desc: t("stats.thisMonth"), icon: FileText, color: "text-blue-500" },
        { title: t("stats.letters"), value: quotaData ? `${quotaData.cover_letter_count || 0}/${maxLetter}` : "...", desc: t("stats.thisMonth"), icon: FileText, color: "text-purple-500" },
        { title: t("stats.analysis"), value: quotaData ? `${quotaData.analysis_count}/${maxAnalysis}` : "...", desc: t("stats.used"), icon: FileSearch, color: "text-teal-500" },
        { title: t("stats.plan"), value: plan === "pro" ? t("stats.pro") : t("stats.free"), desc: plan === "pro" ? t("unlimitedAccess") : t("limitedAccess"), icon: Briefcase, color: plan === "pro" ? "text-yellow-500" : "text-orange-500" },
    ];

    const quickLinks = [
        { href: "/cv/history", label: t("quickAccess.cvs"), icon: FileText },
        { href: "/cover-letter/new", label: t("quickAccess.letter"), icon: PlusCircle },
        { href: "/jobs/tracker", label: t("quickAccess.applications"), icon: Briefcase },
        { href: "/jobs/discover", label: t("quickAccess.find"), icon: FileSearch },
    ];

    const recentDocuments = cvData.slice(0, 3).map((cv, idx) => ({
        id: cv.id, 
        title: cv.title || "Untitled CV", 
        date: new Date(cv.updated_at).toLocaleDateString(), 
        type: "cv", 
        icon: FileText, 
        color: idx === 0 ? "text-blue-500" : idx === 1 ? "text-indigo-500" : "text-purple-500", 
        bg: idx === 0 ? "bg-blue-50 dark:bg-blue-900/20" : idx === 1 ? "bg-indigo-50 dark:bg-indigo-900/20" : "bg-purple-50 dark:bg-purple-900/20" 
    }));

    const pipelineStats = [
        { label: t("pipelineApplied"), value: jobsData.filter(j => j.status === 'Applied').length || 0, color: "bg-blue-500" },
        { label: t("pipelineInterviews"), value: jobsData.filter(j => j.status === 'Interviewing').length || 0, color: "bg-amber-500" },
        { label: t("pipelineOffers"), value: jobsData.filter(j => j.status === 'Offer').length || 0, color: "bg-green-500" },
    ];

    // Get initial userName immediately if profileData exists so we don't flash "Kullanıcı" on first render
    const displayUserName = profileData?.full_name || profileData?.email?.split("@")[0] || userName;

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">

            {/* Welcome & Quick Actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("welcome", { name: displayUserName })}</h1>
                    <p className="text-muted-foreground mt-1">{t("todayGoal")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/cv/new">
                        <Button className="bg-blue-600 text-white">
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
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
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

            <div className="grid gap-6 grid-cols-1 md:grid-cols-7">
                {/* Recent Documents */}
                <Card className="col-span-1 md:col-span-5 bg-white dark:bg-zinc-900/50 shadow-sm border-zinc-200/50 dark:border-zinc-800/50">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-blue-500" />
                                {t("recentWork")}
                            </CardTitle>
                            <CardDescription>{t("recentWorkDesc")}</CardDescription>
                        </div>
                        <Link href="/cv/history">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600">
                                {t("viewAll")} <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {recentDocuments.length > 0 ? recentDocuments.map(doc => (
                                <Link key={doc.id} href={`/cv/${doc.id}/edit`}>
                                    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer h-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`p-2 rounded-lg ${doc.bg}`}>
                                                <doc.icon className={`h-5 w-5 ${doc.color}`} />
                                            </div>
                                            <div className="text-xs font-medium text-muted-foreground">
                                                {mounted ? doc.date : ""}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-zinc-900 dark:text-white truncate pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.title}</h3>
                                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                            {t("edit")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="col-span-3 text-center py-6 text-muted-foreground bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                    <p className="text-sm">{t("noCvYet")}</p>
                                    <Link href="/cv/new">
                                        <Button variant="link" className="text-blue-600 mt-1">{t("createNow")}</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Strength */}
                <Card className="col-span-1 md:col-span-2 relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                            <Target className="h-5 w-5 text-indigo-500" /> {t("profileStrength")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center pt-2 pb-6">
                        <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-indigo-200 dark:text-indigo-900/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-indigo-600 dark:text-indigo-400 drop-shadow-md" strokeDasharray={`${profileStrength}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-indigo-950 dark:text-indigo-50">{profileStrength}<span className="text-lg text-indigo-700/60 dark:text-indigo-300/60">%</span></span>
                            </div>
                        </div>
                        <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 font-medium px-2">
                            {profileStrength >= 80 ? t("profileStrengthGood") : t("profileStrengthImprove")}
                        </p>
                        <Link href="/profile">
                            <Button variant="outline" size="sm" className="mt-4 bg-white/50 dark:bg-zinc-900/50 border-indigo-200 dark:border-indigo-800 hover:bg-white dark:hover:bg-zinc-900">
                                {t("updateProfile")}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-7">
                {/* Application Pipeline */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" /> {t("jobStats")}
                        </CardTitle>
                        <CardDescription>{t("jobStatsDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5 pt-2">
                            {pipelineStats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${stat.color} shadow-[0_0_8px_rgba(0,0,0,0.2)] shadow-${stat.color.replace('bg-', '')}`} />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{stat.label}</span>
                                    </div>
                                    <span className="font-bold text-lg">{stat.value}</span>
                                </div>
                            ))}
                            <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
                                <Link href="/jobs/tracker" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                                    {t("detailedAnalysis")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily AI Tip */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                            <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50">
                                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            {t("dailyTip")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <blockquote className="border-l-4 border-amber-400 pl-4 py-1 my-2 text-sm text-amber-800 dark:text-amber-200/90 italic leading-relaxed">
                            &quot;{t("dailyTipQuote")}&quot;
                        </blockquote>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-700/70 dark:text-amber-400/70">
                            <Sparkles className="h-3.5 w-3.5" /> {t("dailyTipSource")}
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
