"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Target, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Search, Building2, MapPin, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";

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
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLocation, setSearchLocation] = useState("Turkey");
    const [searchWorkType, setSearchWorkType] = useState("all");
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
                    t("mockRec1"),
                    t("mockRec2"),
                ]
            });
            setIsLoading(false);
        }, 2000);
    };

    const handleJobSearch = async (workTypeOverride?: string) => {
        setIsSearching(true);
        setHasSearched(true);
        try {
            const currentWorkType = workTypeOverride || searchWorkType;
            const res = await fetch(`/api/jobs/search?workType=${currentWorkType}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    query: searchQuery || "developer",
                    location: searchLocation,
                    page: 1,
                    locale
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
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .search-bar{display:flex;gap:10px;margin-bottom:48px;flex-wrap:wrap;}
                .search-bar input{
                    flex:1;min-width:240px;height:50px;padding:0 16px;background:rgba(255,255,255,0.02);
                    border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);color:var(--dashboard-text);font-size:14.5px;
                }
                .search-bar select{
                    height:50px;padding:0 34px 0 14px;background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);
                    border-radius:var(--dashboard-radius);color:var(--dashboard-text);font-family:'JetBrains Mono',monospace;font-size:12.5px;
                    appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236FD6E8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                    background-repeat:no-repeat;background-position:right 13px top 50%;background-size:10px auto;
                }
                .search-bar select option{background:var(--dashboard-bg-2);color:var(--dashboard-text);}
                .search-bar input:focus, .search-bar select:focus{outline:none;border-color:var(--dashboard-cyan);}
                .search-bar button{height:50px;padding:0 24px;background:var(--dashboard-cyan);color:var(--dashboard-bg);border:none;border-radius:var(--dashboard-radius);font-family:'JetBrains Mono',monospace;font-size:13px;cursor:pointer;}
                .search-bar button:disabled{opacity:0.7;}
                .work-type-pills{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
                .pill{height:50px;padding:0 20px;background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);color:var(--dashboard-text-dim);font-family:'JetBrains Mono',monospace;font-size:12.5px;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;}
                .pill:hover{background:rgba(255,255,255,0.05);color:var(--dashboard-text);}
                .pill.active{background:rgba(111,214,232,0.1);border-color:var(--dashboard-cyan);color:var(--dashboard-cyan);}

                .divider-label{display:flex;align-items:center;gap:16px;margin:48px 0 20px;}
                .divider-label .dline{flex:1;height:1px;background:var(--dashboard-paper-border);}
                .divider-label h2{font-size:18px;white-space:nowrap;margin:0;}

                .analyze-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;}
                .field{margin-bottom:18px;}
                .field label{display:block;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--dashboard-mono-label);margin-bottom:9px;}
                .field input, .field textarea{width:100%;padding:0 13px;height:46px;background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);color:var(--dashboard-text);font-size:14.5px;}
                .field textarea{height:auto;padding:11px 13px;resize:vertical;}
                .field input:focus, .field textarea:focus{outline:none;border-color:var(--dashboard-cyan);}
                .field input::placeholder, .field textarea::placeholder{color:rgba(234,243,247,0.25);}
                .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
                .result-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:320px;color:var(--dashboard-text-dim);gap:14px;}
                .result-empty svg{width:38px;height:38px;color:var(--dashboard-cyan-dim);}
                
                .job-item{position:relative;background:var(--dashboard-paper);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);padding:22px;margin-bottom:16px;}
                .job-item svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
                .job-item svg.corners path{stroke:var(--dashboard-cyan);stroke-width:1.3;fill:none;}
                .job-title{font-size:16px;font-weight:600;color:var(--dashboard-text);margin-bottom:4px;}
                .job-meta{display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--dashboard-mono-label);margin-bottom:12px;flex-wrap:wrap;}
                .job-meta span{display:flex;align-items:center;gap:4px;}
                .job-desc{font-size:13px;color:var(--dashboard-text-dim);margin-bottom:16px;line-height:1.5;}
                .job-skills{display:flex;gap:6px;flex-wrap:wrap;}
                .job-skill{font-family:'JetBrains Mono',monospace;font-size:10px;padding:4px 8px;border-radius:var(--dashboard-radius);background:rgba(111,214,232,0.1);color:var(--dashboard-cyan);}
                .job-score{display:flex;flex-direction:column;align-items:center;background:rgba(111,232,168,0.1);border:1px solid rgba(111,232,168,0.2);padding:10px 14px;border-radius:var(--dashboard-radius);margin-left:auto;}
                .job-score-val{font-size:18px;font-weight:700;color:var(--dashboard-green);line-height:1;}
                .job-score-lbl{font-size:9px;color:var(--dashboard-green);opacity:0.8;margin-top:4px;text-transform:uppercase;font-family:'JetBrains Mono',monospace;}
                .job-top-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;}
                
                @media(max-width:900px){.analyze-grid{grid-template-columns:1fr;}.field-row{grid-template-columns:1fr;}}
            `}} />

            <div className="page-head">
                <div className="peyebrow">{t('title').toUpperCase()}</div>
                <h1>{t('title')}</h1>
                <p>{t('desc')}</p>
            </div>

            <div className="search-bar">
                <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder={t('searchPlaceholder')} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                    />
                    <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}>
                        <option value="Turkey">TR {t('locationTurkey')}</option>
                        <option value="United States">🇺🇸 {t('locationUS')}</option>
                        <option value="United Kingdom">🇬🇧 {t('locationUK')}</option>
                        <option value="Germany">🇩🇪 {t('locationGermany')}</option>
                        <option value="Netherlands">🇳🇱 {t('locationNetherlands')}</option>
                    </select>
                </div>
                <div className="work-type-pills">
                    <button className={`pill ${searchWorkType === 'all' ? 'active' : ''}`} onClick={() => { setSearchWorkType('all'); handleJobSearch('all'); }}>{t('workTypeAll')}</button>
                    <button className={`pill ${searchWorkType === 'remote' ? 'active' : ''}`} onClick={() => { setSearchWorkType('remote'); handleJobSearch('remote'); }}>{t('workTypeRemote')}</button>
                    <button className={`pill ${searchWorkType === 'hybrid' ? 'active' : ''}`} onClick={() => { setSearchWorkType('hybrid'); handleJobSearch('hybrid'); }}>{t('workTypeHybrid')}</button>
                    <button className={`pill ${searchWorkType === 'onsite' ? 'active' : ''}`} onClick={() => { setSearchWorkType('onsite'); handleJobSearch('onsite'); }}>{t('workTypeOnsite')}</button>
                </div>
                <button onClick={() => handleJobSearch()} disabled={isSearching}>
                    {isSearching ? t('searching') : t('searchButton')}
                </button>
            </div>

            {hasSearched && (
                <div style={{ marginBottom: '48px' }}>
                    {isSearching ? (
                        <div className="result-empty" style={{ minHeight: '160px' }}>
                            <Loader2 className="w-[38px] h-[38px] animate-spin" style={{ color: 'var(--dashboard-cyan)' }} />
                            <div style={{ color: 'var(--dashboard-text)' }}>{t('searching')}</div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="result-empty" style={{ minHeight: '160px', border: '1px dashed var(--dashboard-paper-border)', borderRadius: 'var(--dashboard-radius)' }}>
                            <Search className="w-[38px] h-[38px]" style={{ color: 'var(--dashboard-text-dim)', opacity: 0.5 }} />
                            <div style={{ color: 'var(--dashboard-text)' }}>{searchWorkType !== 'all' ? t('noResultsWorkType') : t('noResults')}</div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--dashboard-mono-label)', marginBottom: '16px' }}>
                                {t('resultsFound', { count: jobs.length }).toUpperCase()} {apiSource === "jsearch" ? t('apiSourceReal') : t('apiSourceDemo')}
                            </div>
                            <div>
                                {jobs.map(job => (
                                    <div key={job.id} className="job-item">
                                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                                        <div className="job-top-row">
                                            <div>
                                                <div className="job-title">{job.title} <span style={{ fontSize: '10px', color: 'var(--dashboard-text-dim)', border: '1px solid var(--dashboard-paper-border)', padding: '2px 6px', borderRadius: 'var(--dashboard-radius)', marginLeft: '8px', verticalAlign: 'middle', fontWeight: 'normal' }}>{job.type}</span></div>
                                                <div className="job-meta">
                                                    <span><Building2 className="w-[12px] h-[12px]" /> {job.company}</span>
                                                    <span><MapPin className="w-[12px] h-[12px]" /> {job.location}</span>
                                                    <span><Clock className="w-[12px] h-[12px]" /> {job.postedAt}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                                <div className="job-score">
                                                    <span className="job-score-val">{job.matchScore}%</span>
                                                    <span className="job-score-lbl">{t('matchScore').toUpperCase()}</span>
                                                </div>
                                                <button 
                                                    className="btn-outline" 
                                                    style={{ padding: '6px 12px', fontSize: '11px' }}
                                                    onClick={() => job.applyLink && job.applyLink !== "#" && window.open(job.applyLink, "_blank")}
                                                    disabled={!job.applyLink || job.applyLink === "#"}
                                                >
                                                    {job.applyLink && job.applyLink !== "#" ? t('applyButton').toUpperCase() : t('analyzeButton').toUpperCase()}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="job-desc">{job.description}</div>
                                        <div className="job-skills">
                                            {job.skills.map(skill => (
                                                <span key={skill} className="job-skill">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="divider-label"><div className="dline"></div><h2>{t('manualAnalysisTitle')}</h2><div className="dline"></div></div>

            <div className="analyze-grid">
                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3 style={{ marginBottom: '8px' }}>{t('jobInfoTitle')}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--dashboard-text-dim)', marginBottom: '22px' }}>{t('jobInfoDesc')}</p>
                    <div className="field-row">
                        <div className="field">
                            <label>{t('companyLabel')}</label>
                            <input type="text" placeholder={t('companyPlaceholder')} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                        </div>
                        <div className="field">
                            <label>{t('positionLabel')}</label>
                            <input type="text" placeholder={t('positionPlaceholder')} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                        </div>
                    </div>
                    <div className="field">
                        <label>{t('descriptionLabel')}</label>
                        <textarea rows={4} placeholder={t('descriptionPlaceholder')} value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
                    </div>
                    <button className="btn-stamp" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAnalyze} disabled={isLoading || !form.jobDescription}>
                        {isLoading ? (
                            <><Loader2 className="w-[14px] h-[14px] mr-2 animate-spin" /> {t('analyzing').toUpperCase()}</>
                        ) : (
                            <>✦ {t('analyzeButtonAI').toUpperCase()}</>
                        )}
                    </button>
                </div>

                <div className="bp-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    {!result && !isLoading ? (
                        <div className="result-empty" style={{ flex: 1 }}>
                            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" fill="none"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>
                            <div style={{ color: 'var(--dashboard-text)', fontSize: '15px', fontWeight: 500 }}>{t('resultWaiting')}</div>
                            <div style={{ fontSize: '13px', maxWidth: '230px' }}>{t('resultWaitingDesc')}</div>
                        </div>
                    ) : isLoading ? (
                        <div className="result-empty" style={{ flex: 1 }}>
                            <Loader2 className="w-[38px] h-[38px] animate-spin" style={{ color: 'var(--dashboard-cyan)' }} />
                            <div style={{ color: 'var(--dashboard-text)', fontSize: '15px', fontWeight: 500 }}>{t('aiWorking')}</div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '20px' }}>{t('manualAnalysisTitle').replace(' İle Analiz', '')}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '16px', background: 'rgba(111,214,232,0.05)', borderRadius: 'var(--dashboard-radius)', border: '1px solid var(--dashboard-paper-border)' }}>
                                <div>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--dashboard-mono-label)' }}>{t('matchScoreTitle').toUpperCase()}</div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--dashboard-cyan)' }}>{result?.matchScore}%</div>
                                </div>
                                <Target className="w-[42px] h-[42px]" style={{ color: 'var(--dashboard-cyan)', opacity: 0.5 }} />
                            </div>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--dashboard-green)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 className="w-[12px] h-[12px]"/> {t('matchedSkills').toUpperCase()}</div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {result?.matchedSkills.map((s, i) => <span key={i} style={{ fontSize: '12px', background: 'rgba(111,232,168,0.1)', color: 'var(--dashboard-green)', padding: '4px 8px', borderRadius: 'var(--dashboard-radius)' }}>{s}</span>)}
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--dashboard-stamp)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle className="w-[12px] h-[12px]"/> {t('missingSkills').toUpperCase()}</div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {result?.missingSkills.map((s, i) => <span key={i} style={{ fontSize: '12px', background: 'rgba(232,84,60,0.1)', color: 'var(--dashboard-stamp)', padding: '4px 8px', borderRadius: 'var(--dashboard-radius)' }}>{s}</span>)}
                                </div>
                            </div>
                            
                            <div style={{ borderTop: '1px solid var(--dashboard-paper-border)', paddingTop: '20px' }}>
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--dashboard-mono-label)', marginBottom: '12px' }}>{t('aiRecommendations').toUpperCase()}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {result?.recommendations.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--dashboard-text-dim)', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--dashboard-radius)' }}>
                                            <Sparkles className="w-[14px] h-[14px]" style={{ color: 'var(--dashboard-purple)', flexShrink: 0, marginTop: '2px' }} />
                                            <span>{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
