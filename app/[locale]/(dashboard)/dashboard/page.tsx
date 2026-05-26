"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText, Briefcase, PlusCircle, FileSearch, ArrowRight, Sparkles
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

                {/* Quick navigation links */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t("quickAccess.title")}</CardTitle>
                        <CardDescription>{t("quickAccess.desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {quickLinks.map(link => (
                                <Link key={link.href} href={link.href as "/cv/history" | "/cover-letter/new" | "/jobs/tracker" | "/jobs/discover"}>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all group cursor-pointer">
                                        <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        <span className="text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{link.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Features promo */}
                <Card className="col-span-1 lg:col-span-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-900/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                    <Sparkles className="h-5 w-5 text-blue-500" />
                                    {t("aiTools.title")}
                                </CardTitle>
                                <CardDescription className="text-blue-700/70 dark:text-blue-300/70 mt-1">
                                    {t("aiTools.desc")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2.5 text-sm text-blue-800 dark:text-blue-200">
                            {[
                                t("aiTools.feature1"),
                                t("aiTools.feature2"),
                                t("aiTools.feature3"),
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/jobs/discover">
                            <Button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white border-0" size="sm">
                                {t("aiTools.button")} <ArrowRight className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
