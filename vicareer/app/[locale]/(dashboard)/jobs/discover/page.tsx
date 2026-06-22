"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Target, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Search, Building2, MapPin, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface JobListing {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    type: string;
    matchScore: number;
    skills: string[];
    source: string;
    postedAt: string;
    applyLink?: string;
}

interface AnalysisResult {
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
}

export default function JobDiscoverPage() {
    const t = useTranslations("JobsDiscover");
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLocation, setSearchLocation] = useState("Turkey");
    const [hasSearched, setHasSearched] = useState(false);
    const [apiSource, setApiSource] = useState<string>("");

    const [form, setForm] = useState({
        company: "",
        position: "",
        jobDescription: "",
    });

    const handleAnalyze = async () => {
        if (!form.jobDescription || !form.position || !form.company) return;

        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setResult({
                matchScore: 82,
                matchedSkills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
                missingSkills: ["GraphQL", "AWS", "Jest"],
                recommendations: [
                    "AWS S3 ve EC2 hakkında temel seviye bilgi edin.",
                    "Frontend testing için Jest dökümantasyonunu incele.",
                ]
            });
            setIsLoading(false);
        }, 2000);
    };

    const handleJobSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);
        try {
            const res = await fetch("/api/jobs/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    query: searchQuery || "developer",
                    location: searchLocation,
                    page: 1 
                }),
            });
            const data = await res.json();
            setJobs(data.jobs || []);
            setApiSource(data.source || "unknown");
            
            if (data.source === "mock" || data.source === "mock_fallback") {
                console.log("[Jobs] Using mock data. Add RAPIDAPI_KEY to .env.local for real job listings.");
            }
        } catch (error) {
            console.error("[Jobs] Search error:", error);
            setJobs([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4 md:p-8">
            {/* Live Job Search Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                <p className="text-muted-foreground mt-1">
                    {t("desc")}
                </p>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t("searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                                className="pl-10 h-11"
                            />
                        </div>
                        <div className="relative w-full md:w-48">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <select
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="Turkey">{t("locationTurkey")}</option>
                                <option value="Remote">{t("locationRemote")}</option>
                                <option value="United States">{t("locationUS")}</option>
                                <option value="United Kingdom">{t("locationUK")}</option>
                                <option value="Germany">{t("locationGermany")}</option>
                                <option value="Netherlands">{t("locationNetherlands")}</option>
                            </select>
                        </div>
                        <Button onClick={handleJobSearch} disabled={isSearching} className="gradient-brand text-white h-11 px-6">
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : t("searchButton")}
                        </Button>
                    </div>
                    {apiSource && (
                        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                            {apiSource === "jsearch" ? (
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
                                    {t("apiSourceReal")}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                                    {t("apiSourceDemo")}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Job Results */}
            {hasSearched && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    {isSearching ? (
                        <div className="py-10 text-center text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-500" />
                            <p>{t("searching")}</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <Card className="py-10 text-center border-dashed bg-zinc-50/50 dark:bg-zinc-900/50">
                            <Target className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
                            <p className="text-muted-foreground">{t("noResults")}</p>
                        </Card>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground font-medium">{t("resultsFound", { count: jobs.length })}</p>
                            <div className="grid grid-cols-1 gap-4">
                                {jobs.map(job => (
                                    <Card key={job.id} className="shadow-sm hover:shadow-md transition-shadow group border-zinc-200 dark:border-zinc-800">
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                            {job.title}
                                                        </h3>
                                                        <Badge variant="outline" className="text-[10px] shrink-0 border-zinc-200 dark:border-zinc-700">{job.type}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground flex-wrap">
                                                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.company}</span>
                                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.postedAt}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2">{job.description}</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {job.skills.map(skill => (
                                                            <span key={skill} className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md">
                                                                <Tag className="h-2.5 w-2.5" />{skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-right flex flex-col items-end gap-3">
                                                    <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl px-3 py-2">
                                                        <Sparkles className="h-3.5 w-3.5 text-green-600 dark:text-green-500 mb-0.5" />
                                                        <span className="text-lg font-black text-green-700 dark:text-green-400 leading-none">{job.matchScore}%</span>
                                                        <span className="text-[9px] text-green-600/70 dark:text-green-500/70 font-medium mt-0.5">{t("matchScore")}</span>
                                                    </div>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="h-8 text-xs group-hover:border-blue-400 group-hover:text-blue-600 dark:group-hover:border-blue-700 dark:group-hover:text-blue-400 transition-all"
                                                        onClick={() => job.applyLink && job.applyLink !== "#" && window.open(job.applyLink, "_blank")}
                                                        disabled={!job.applyLink || job.applyLink === "#"}
                                                    >
                                                        {job.applyLink && job.applyLink !== "#" ? t("applyButton") : t("analyzeButton")} <ArrowRight className="ml-1.5 h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Manual Analysis Section */}
            <div className="border-t pt-8">
                <h2 className="text-xl font-bold mb-1">{t("manualAnalysisTitle")}</h2>
                <p className="text-muted-foreground text-sm mb-6">{t("manualAnalysisDesc")}</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">{t("jobInfoTitle")}</CardTitle>
                            <CardDescription>{t("jobInfoDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t("companyLabel")}</Label>
                                    <Input placeholder={t("companyPlaceholder")} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("positionLabel")}</Label>
                                    <Input placeholder={t("positionPlaceholder")} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>{t("descriptionLabel")}</Label>
                                <Textarea rows={8} className="resize-none" placeholder={t("descriptionPlaceholder")} value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
                            </div>
                            <Button className="w-full gradient-brand text-white mt-2" onClick={handleAnalyze} disabled={isLoading || !form.jobDescription}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("analyzing")}</> : <><Sparkles className="mr-2 h-4 w-4" />{t("analyzeButtonAI")}</>}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col h-full">
                        {!result && !isLoading ? (
                            <Card className="flex-1 flex flex-col items-center justify-center border-dashed bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none p-10">
                                <Target className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground">{t("resultWaiting")}</h3>
                                <p className="text-sm text-center text-muted-foreground/70 mt-2 max-w-sm">{t("resultWaitingDesc")}</p>
                            </Card>
                        ) : isLoading ? (
                            <Card className="flex-1 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none p-10">
                                <div className="h-16 w-16 rounded-full gradient-brand flex items-center justify-center animate-pulse">
                                    <Sparkles className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-medium mt-6">{t("aiWorking")}</h3>
                            </Card>
                        ) : (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-400">
                                <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">{t("matchScoreTitle")}</p>
                                                <h2 className="text-4xl font-black tracking-tight text-blue-900 dark:text-blue-100 mt-1">{result?.matchScore}<span className="text-2xl text-blue-700/50">%</span></h2>
                                            </div>
                                            <div className="h-20 w-20 flex items-center justify-center">
                                                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                                    <path className="text-blue-200 dark:text-blue-900/50" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    <path className="text-blue-600 dark:text-blue-400" strokeDasharray={`${result?.matchScore}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                </svg>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 space-y-6">
                                        <div>
                                            <h4 className="text-sm font-semibold flex items-center text-green-700 dark:text-green-400 mb-3"><CheckCircle2 className="mr-2 h-4 w-4" />{t("matchedSkills")}</h4>
                                            <div className="flex flex-wrap gap-2">{result?.matchedSkills.map((skill, i) => (<Badge key={i} className="bg-green-100 text-green-700 border-0 dark:bg-green-900/30 dark:text-green-400">{skill}</Badge>))}</div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold flex items-center text-red-700 dark:text-red-400 mb-3"><AlertTriangle className="mr-2 h-4 w-4" />{t("missingSkills")}</h4>
                                            <div className="flex flex-wrap gap-2">{result?.missingSkills.map((skill, i) => (<Badge key={i} className="bg-red-100 text-red-700 border-0 dark:bg-red-900/30 dark:text-red-400">{skill}</Badge>))}</div>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-semibold mb-3">{t("aiRecommendations")}</h4>
                                            <ul className="space-y-2">{result?.recommendations.map((rec, i) => (<li key={i} className="flex gap-3 text-sm text-muted-foreground bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border"><BookOpen className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />{rec}</li>))}</ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
