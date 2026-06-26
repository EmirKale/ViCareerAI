"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
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

    const cvCount = quotaData?.cv_count ?? 0;
    const letterCount = quotaData?.cover_letter_count ?? 0;
    const analysisCount = quotaData?.analysis_count ?? 0;

    const stats = [
        { title: t("stats.cvs"), value: `${cvCount}`, max: `/${maxCv}`, desc: t("stats.thisMonth"), icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/> },
        { title: t("stats.letters"), value: `${letterCount}`, max: `/${maxLetter}`, desc: t("stats.thisMonth"), icon: <><path d="M4 4h16v16H4z"/><path d="M4 7l8 6 8-6"/></> },
        { title: t("stats.analysis"), value: `${analysisCount}`, max: `/${maxAnalysis}`, desc: t("stats.used"), icon: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></> },
        { title: t("stats.plan"), value: plan === "pro" ? "Pro" : t("stats.free"), max: "", desc: plan === "pro" ? t("unlimitedAccess") : t("limitedAccess"), icon: <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/>, isPro: true }
    ];

    const quickLinks = [
        { href: "/cv/history", label: t("quickAccess.cvs"), icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/> },
        { href: "/cover-letter/new", label: t("quickAccess.letter"), icon: <><path d="M12 5v14M5 12h14"/></> },
        { href: "/jobs/tracker", label: t("quickAccess.applications"), icon: <><path d="M3 7h18M3 7l2-4h14l2 4M3 7v12a1 1 0 001 1h16a1 1 0 001-1V7"/></> },
        { href: "/jobs/discover", label: t("quickAccess.find"), icon: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></> },
    ];

    const recentDocuments = cvData.slice(0, 3).map((cv, idx) => ({
        id: cv.id, 
        title: cv.title || "İsimsiz CV", 
        date: new Date(cv.updated_at).toLocaleDateString()
    }));

    const pipelineStats = [
        { label: t("pipelineApplied"), value: jobsData.filter(j => j.status === 'Applied').length || 0, color: "var(--dashboard-cyan)" },
        { label: t("pipelineInterviews"), value: jobsData.filter(j => j.status === 'Interviewing').length || 0, color: "#E8B85E" },
        { label: t("pipelineOffers"), value: jobsData.filter(j => j.status === 'Offer').length || 0, color: "var(--dashboard-green)" },
    ];

    const displayUserName = profileData?.full_name || profileData?.email?.split("@")[0] || userName;

    return (
        <div className="w-full text-[#EAF3F7]">
            {/* ---------- DASHBOARD HEADER ---------- */}
            <div className="flex justify-between items-start flex-wrap gap-5 mb-8">
                <div>
                    <h1 className="text-[clamp(24px,3vw,30px)] font-['Space_Grotesk'] font-semibold tracking-tight mb-1.5">{t("welcome", { name: displayUserName.split(' ')[0] })}</h1>
                    <p className="text-[#EAF3F7]/60 text-[14.5px]">{t("todayGoal")}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link href="/cv/new" className="btn-stamp">
                        + {t("newCv")}
                    </Link>
                    <Link href="/cover-letter/new" className="btn-outline">
                        {t("writeLetter")}
                    </Link>
                </div>
            </div>

            {/* ---------- STAT CARDS ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bp-card" style={stat.isPro ? { borderColor: "var(--dashboard-stamp-dim)" } : {}}>
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M6,15 L6,6 L15,6" stroke={stat.isPro ? "var(--dashboard-stamp)" : "var(--dashboard-cyan)"}/>
                            <path d="M85,6 L94,6 L94,15" stroke={stat.isPro ? "var(--dashboard-stamp)" : "var(--dashboard-cyan)"}/>
                            <path d="M94,85 L94,94 L85,94" stroke={stat.isPro ? "var(--dashboard-stamp)" : "var(--dashboard-cyan)"}/>
                            <path d="M15,94 L6,94 L6,85" stroke={stat.isPro ? "var(--dashboard-stamp)" : "var(--dashboard-cyan)"}/>
                        </svg>
                        <div className="relative z-10 px-2">
                            <div className="flex justify-between items-start mb-[18px]">
                                <span className="text-[13px] text-[#EAF3F7]/60">{stat.title}</span>
                                <svg className="w-[18px] h-[18px] shrink-0 fill-none stroke-current stroke-[1.6px]" viewBox="0 0 24 24" style={{ color: stat.isPro ? "var(--dashboard-stamp)" : "var(--dashboard-cyan-dim)" }}>
                                    {stat.icon}
                                </svg>
                            </div>
                            <div className="font-['Space_Grotesk'] font-bold text-[28px] mb-1 leading-none" style={{ color: stat.isPro ? "var(--dashboard-stamp)" : "inherit" }}>
                                {stat.value}<span className="text-[#EAF3F7]/60 text-[18px]">{stat.max}</span>
                            </div>
                            <div className="font-['JetBrains_Mono'] text-[10.5px] tracking-[0.06em] text-[#8FB9CC]">
                                {stat.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------- MID ROW ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bp-card md:col-span-2">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M6,15 L6,6 L15,6"/><path d="M85,6 L94,6 L94,15"/><path d="M94,85 L94,94 L85,94"/><path d="M15,94 L6,94 L6,85"/>
                    </svg>
                    <div className="relative z-10 px-2 sm:px-4">
                        <div className="flex justify-between items-center mb-[18px]">
                            <h3 className="font-['Space_Grotesk'] font-semibold text-[16px]">{t("recentWork")}</h3>
                            <Link className="font-['JetBrains_Mono'] text-[11px] text-[#6FD6E8] flex items-center gap-1 hover:opacity-80" href="/cv/history">
                                {t("viewAll")} →
                            </Link>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {recentDocuments.length > 0 ? recentDocuments.map((doc) => (
                                <Link key={doc.id} href={`/cv/${doc.id}/edit`} className="flex items-center gap-[14px] p-4 border border-[#6FD6E8]/14 rounded-[2px] bg-white/[0.015] hover:bg-[#6FD6E8]/5 transition-colors">
                                    <div className="w-9 h-9 rounded-[2px] bg-[#6FD6E8]/10 flex items-center justify-center text-[#6FD6E8] shrink-0">
                                        <svg className="w-[18px] h-[18px] shrink-0 fill-none stroke-current stroke-[1.6px]" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-['JetBrains_Mono'] text-[11px] text-[#8FB9CC] mb-1">{mounted ? doc.date : ""}</div>
                                        <div className="text-[14.5px] font-medium text-[#EAF3F7]">{doc.title}</div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="text-center py-6 text-[#EAF3F7]/60 border border-dashed border-[#6FD6E8]/14 rounded-[2px]">
                                    <p className="text-[14.5px] mb-2">{t("noCvYet")}</p>
                                    <Link href="/cv/new" className="text-[#6FD6E8] font-['JetBrains_Mono'] text-[11px] hover:underline">{t("createNow")} →</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bp-card flex flex-col items-center text-center">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M6,15 L6,6 L15,6"/><path d="M85,6 L94,6 L94,15"/><path d="M94,85 L94,94 L85,94"/><path d="M15,94 L6,94 L6,85"/>
                    </svg>
                    <div className="relative z-10 px-2 w-full flex flex-col items-center">
                        <h3 className="font-['Space_Grotesk'] font-semibold text-[16px] mb-[18px] self-start">{t("profileStrength")}</h3>
                        <div className="relative w-[140px] h-[140px] mb-[18px]">
                            <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                                <circle cx="70" cy="70" r="60" fill="none" stroke="var(--dashboard-paper-border)" strokeWidth="8"/>
                                <circle cx="70" cy="70" r="60" fill="none" stroke="var(--dashboard-cyan)" strokeWidth="8"
                                  strokeDasharray="377" strokeDashoffset={377 - (377 * profileStrength) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out"/>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-['Space_Grotesk'] font-bold text-[30px]">
                                {profileStrength}%
                            </div>
                        </div>
                        <p className="text-[13px] text-[#EAF3F7]/60 mb-[18px] max-w-[220px]">{profileStrength >= 75 ? t("profileStrengthGood") : t("profileStrengthImprove")}</p>
                        <Link href="/profile" className="btn-outline w-full justify-center">
                            {t("updateProfile")}
                        </Link>
                    </div>
                </div>
            </div>

            {/* ---------- BOTTOM ROW ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr] gap-4">
                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M6,15 L6,6 L15,6"/><path d="M85,6 L94,6 L94,15"/><path d="M94,85 L94,94 L85,94"/><path d="M15,94 L6,94 L6,85"/>
                    </svg>
                    <div className="relative z-10 px-2">
                        <h3 className="font-['Space_Grotesk'] font-semibold text-[16px]">{t("jobStats")}</h3>
                        <div className="font-['JetBrains_Mono'] text-[11px] text-[#8FB9CC] mt-1 mb-1.5 uppercase">{t("jobStatsDesc")}</div>
                        <div className="flex flex-col">
                            {pipelineStats.map((stat, i) => (
                                <div key={i} className={`flex justify-between items-center py-[11px] text-[14px] ${i !== 0 ? 'border-t border-[#6FD6E8]/14' : ''}`}>
                                    <span className="flex items-center text-[#EAF3F7]/60">
                                        <span className="w-[7px] h-[7px] rounded-full inline-block mr-[9px]" style={{ background: stat.color }}></span>
                                        {stat.label}
                                    </span>
                                    <span className="font-['JetBrains_Mono']">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                        <Link className="font-['JetBrains_Mono'] text-[11px] text-[#6FD6E8] flex items-center gap-1 hover:opacity-80 mt-4 block uppercase" href="/jobs/tracker">
                            {t("detailedAnalysis")} →
                        </Link>
                    </div>
                </div>

                <div className="bp-card" style={{ borderColor: "var(--dashboard-stamp-dim)" }}>
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M6,15 L6,6 L15,6" stroke="var(--dashboard-stamp)"/><path d="M85,6 L94,6 L94,15" stroke="var(--dashboard-stamp)"/><path d="M94,85 L94,94 L85,94" stroke="var(--dashboard-stamp)"/><path d="M15,94 L6,94 L6,85" stroke="var(--dashboard-stamp)"/>
                    </svg>
                    <div className="relative z-10 px-2">
                        <h3 className="font-['Space_Grotesk'] font-semibold text-[16px]">{t("dailyTip")}</h3>
                        <p className="border-l-[2px] border-[#E8543C] pl-[14px] text-[13.5px] text-[#EAF3F7]/60 italic leading-[1.6] mt-[14px] mb-[14px]">
                            &quot;{t("dailyTipQuote")}&quot;
                        </p>
                        <span className="font-['JetBrains_Mono'] text-[11px] text-[#6FD6E8] uppercase">✦ {t("dailyTipSource")}</span>
                    </div>
                </div>

                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M6,15 L6,6 L15,6"/><path d="M85,6 L94,6 L94,15"/><path d="M94,85 L94,94 L85,94"/><path d="M15,94 L6,94 L6,85"/>
                    </svg>
                    <div className="relative z-10 px-2">
                        <h3 className="font-['Space_Grotesk'] font-semibold text-[16px]">{t("quickAccess.title")}</h3>
                        <p className="text-[13px] text-[#EAF3F7]/60 mt-1 mb-1.5">{t("quickAccess.desc")}</p>
                        <div className="grid grid-cols-2 gap-[10px] mt-1.5">
                            {quickLinks.map((link, i) => (
                                <Link key={i} className="flex flex-col items-start gap-2 p-[14px] border border-[#6FD6E8]/14 rounded-[2px] text-[#EAF3F7] text-[13px] hover:border-[#6FD6E8]/55 hover:bg-[#6FD6E8]/[0.03] transition-colors" href={link.href as React.ComponentProps<typeof Link>["href"]}>
                                    <svg className="w-[18px] h-[18px] shrink-0 fill-none stroke-current stroke-[1.6px]" viewBox="0 0 24 24">
                                        {link.icon}
                                    </svg>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
