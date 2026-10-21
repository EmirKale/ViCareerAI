"use client";

import { useTranslations, useLocale } from "next-intl";
import { Upload, FileText, Loader2, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SkillsClient({ analysisData, cvs }: { analysisData: any, cvs: any[] }) {
    const t = useTranslations("Skills");
    const locale = useLocale();
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showUpload, setShowUpload] = useState(!analysisData);
    const [targetRole, setTargetRole] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const handleAnalyzeFromCV = async (cvId: string) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/skills/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvId, targetRole, locale })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success(t("analysisSuccess") || "Analiz tamamlandı!");
            router.refresh();
            setShowUpload(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t("fileTooLarge") || "Dosya boyutu 5MB'dan küçük olmalıdır.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "raw");

            const parseRes = await fetch("/api/cv/parse-file", {
                method: "POST",
                body: formData
            });
            const parseData = await parseRes.json();
            
            if (!parseRes.ok) throw new Error(parseData.error || t("fileReadError") || "Dosya okunamadı");

            const res = await fetch("/api/skills/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileContent: parseData.text, targetRole, locale })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success(t("analysisSuccess") || "Analiz tamamlandı!");
            router.refresh();
            setShowUpload(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (showUpload || !analysisData) {
        return (
            <div className="select-wrap animate-in fade-in duration-500">
                <style dangerouslySetInnerHTML={{__html: `
                    .select-wrap{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;padding:40px 20px;}
                    .select-card{
                        width:100%;max-width:540px;background:#FFFFFF;
                        border:2px solid #111111;box-shadow:4px 4px 0px #111111;border-radius:0px;padding:clamp(32px,5vw,48px) clamp(28px,5vw,44px);
                        text-align:center;color:#111111;
                    }
                    .select-card h1{font-family:'Archivo Narrow',sans-serif;font-size:clamp(24px,3vw,30px);font-weight:700;text-transform:uppercase;color:#111111;margin-bottom:10px;letter-spacing:-0.01em;}
                    .select-card .sub{font-size:14.5px;color:#4A4742;max-width:400px;margin:0 auto 32px;line-height:1.55;}

                    .field-block{text-align:left;margin-bottom:26px;}
                    .field-block .flabel{
                        display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;
                        letter-spacing:.08em;text-transform:uppercase;color:#757169;font-weight:700;margin-bottom:10px;
                    }
                    .field-block .flabel svg{width:14px;height:14px;color:#1849A9;}
                    .field-block input{
                        width:100%;height:48px;padding:0 14px;background:#FFFFFF;border:1.5px solid #111111;
                        border-radius:0px;color:#111111;font-size:14.5px;
                    }
                    .field-block input:focus{outline:none;border-color:#1849A9;box-shadow:0 0 0 2px rgba(24,73,169,0.2);}
                    .field-block input::placeholder{color:#757169;}
                    .field-block .fhint{font-size:12px;color:#757169;margin-top:8px;}

                    .cv-pick{
                        display:flex;align-items:center;gap:12px;width:100%;height:54px;padding:0 18px;
                        background:#FAF8F5;border:1.5px solid #111111;border-radius:0px;
                        color:#111111;font-size:14.5px;font-weight:600;margin-bottom:10px;text-align:left;transition:all .15s ease;
                    }
                    .cv-pick:hover{background:#FFFFFF;box-shadow:2px 2px 0px #111111;cursor:pointer;}
                    .cv-pick svg.cv-doc{width:17px;height:17px;color:#1849A9;flex-shrink:0;}
                    .cv-pick .cv-name{flex:1;}
                    .cv-pick svg.cv-go{width:15px;height:15px;color:#757169;flex-shrink:0;}

                    .divider{display:flex;align-items:center;gap:14px;margin:26px 0;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;color:#757169;}
                    .divider::before,.divider::after{content:'';flex:1;height:1px;background:#D3CDC2;}

                    .upload-btn{
                        width:100%;height:50px;display:flex;align-items:center;justify-content:center;gap:10px;
                        border:1.5px solid #111111;border-radius:0px;background:#1849A9;
                        color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;
                        transition:background .15s ease;cursor:pointer;
                    }
                    .upload-btn:hover{background:#123782;}
                    .upload-btn svg{width:16px;height:16px;}
                    .upload-hint{font-size:11.5px;color:#757169;margin-top:10px;font-family:'JetBrains Mono',monospace;}

                    .cancel-link{display:block;margin-top:28px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;text-transform:uppercase;color:#1849A9;cursor:pointer;background:transparent;border:none;margin-left:auto;margin-right:auto;}
                    .cancel-link:hover{text-decoration:underline;}
                `}} />
                
                <div className="select-card">
                    <h1>{t("title") || "Beceri Analizi"}</h1>
                    <p className="sub">{t("desc") || "Hedef pozisyonunuzu belirleyin ve yeteneklerinizi AI ile analiz edin."}</p>

                    {isAnalyzing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '40px 0' }}>
                            <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--dashboard-cyan)' }} />
                            <p style={{ color: 'var(--dashboard-cyan)' }} className="animate-pulse">{t("analyzing") || "Yapay zeka CV'nizi analiz ediyor..."}</p>
                        </div>
                    ) : (
                        <>
                            <div className="field-block">
                                <div className="flabel"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg> {t("targetRoleLabel") || "HEDEF POZİSYON (OPSİYONEL)"}</div>
                                <input 
                                    type="text" 
                                    placeholder={t("targetRolePlaceholder") || "Örn: Frontend Developer, Product Manager..."} 
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                />
                                <div className="fhint">{t("targetRoleHint") || "Belirtirseniz analiz tamamen bu role uygunluğunuz üzerinden yapılır."}</div>
                            </div>

                            {cvs.length > 0 ? (
                                <>
                                    {cvs.map(cv => (
                                        <button 
                                            key={cv.id} 
                                            className="cv-pick"
                                            onClick={() => handleAnalyzeFromCV(cv.id)}
                                        >
                                            <FileText className="cv-doc" />
                                            <span className="cv-name">{cv.title || "CV'm"} {t("createWith") || "ile Oluştur"}</span>
                                            <ChevronRight className="cv-go" />
                                        </button>
                                    ))}
                                    
                                    <div className="divider">{t("or") || "VEYA"}</div>
                                </>
                            ) : null}

                            <input 
                                type="file" 
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            <button 
                                className="upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload /> {t("uploadExt") || "Dışarıdan CV Yükle (PDF / DOCX)"}
                            </button>
                            <div className="upload-hint">{t("uploadHint") || "Maksimum 5MB dosya boyutu"}</div>

                            {analysisData && (
                                <button className="cancel-link" onClick={() => setShowUpload(false)}>
                                    {t("cancelAndReturn") || "İptal Et ve Analize Dön"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    const { scores, overall_score, insight } = analysisData;
    
    // New Advanced fields parsed from the JSONB scores object
    const targetRoleText = scores?.target_role;
    const atsScore = scores?.ats_score || overall_score;
    const superpower = scores?.superpower;
    const redFlags = scores?.red_flags || [];
    const actionPlan = scores?.action_plan || [];
    const cvCorrections = scores?.cv_corrections || [];
    const competencyReasoning = scores?.competency_reasoning || {};

    // Parse insights: support both new array format (JSON string) and legacy single string
    let insightsArray: { type: string; title: string; description: string }[] = [];
    try {
        if (typeof insight === 'string' && insight.startsWith('[')) {
            insightsArray = JSON.parse(insight);
        } else if (typeof insight === 'string' && insight.length > 0) {
            insightsArray = [{ type: 'strength', title: t('aiInsights'), description: insight }];
        }
    } catch {
        if (insight) insightsArray = [{ type: 'strength', title: t('aiInsights'), description: String(insight) }];
    }

    const insightColor = (type: string) => {
        switch (type) {
            case 'strength': return { border: 'rgba(52,211,153,.35)', bg: 'rgba(52,211,153,.06)', text: '#34d399' };
            case 'weakness': return { border: 'rgba(251,191,36,.35)', bg: 'rgba(251,191,36,.06)', text: '#fbbf24' };
            case 'opportunity': return { border: 'rgba(96,165,250,.35)', bg: 'rgba(96,165,250,.06)', text: '#60a5fa' };
            case 'critical': return { border: 'rgba(248,113,113,.35)', bg: 'rgba(248,113,113,.06)', text: '#f87171' };
            default: return { border: 'var(--dashboard-paper-border)', bg: 'rgba(255,255,255,.015)', text: 'var(--dashboard-text-dim)' };
        }
    };

    const insightLabel = (type: string) => {
        if (locale === 'tr') {
            switch (type) {
                case 'strength': return 'Güçlü Yön';
                case 'weakness': return 'Zayıf Yön';
                case 'opportunity': return 'Fırsat';
                case 'critical': return 'Kritik';
                default: return type;
            }
        }
        switch (type) {
            case 'strength': return 'Strength';
            case 'weakness': return 'Weakness';
            case 'opportunity': return 'Opportunity';
            case 'critical': return 'Critical';
            default: return type;
        }
    };


    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .skills-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:28px;}
                .page-head h1{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:clamp(26px,3vw,32px);text-transform:uppercase;color:#111111;margin-bottom:6px;letter-spacing:-0.01em;}
                .peyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#757169;margin-bottom:6px;}
                .target-line{display:flex;align-items:center;gap:8px;font-size:13.5px;color:#4A4742;margin-top:6px;}
                .target-line b{color:#111111;}

                .insight-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
                .insight-card{position:relative;border-radius:0px;padding:24px;}
                .insight-card svg.corners{display:none;}
                .insight-card.std{background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;}
                .insight-card.power{background:#F0FDF4;border:1.5px solid #15803D;box-shadow:2px 2px 0px rgba(21,128,61,0.2);}
                .insight-card h3{font-family:'Archivo Narrow',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;display:flex;align-items:center;gap:9px;margin-bottom:14px;color:#111111;}
                .insight-card h3 svg{width:16px;height:16px;}
                .insight-card.power h3{color:#15803D;}
                .insight-card p{font-size:14px;line-height:1.65;color:#4A4742;}
                .insight-card.power p{color:#111111;}

                .insights-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
                .insight-mini{background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;padding:16px;border-radius:0px;}
                .insight-mini .im-tag{font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:.06em;padding:3px 8px;border-radius:0px;display:inline-block;margin-bottom:10px;text-transform:uppercase;}
                .insight-mini .im-title{font-family:'Archivo Narrow',sans-serif;font-size:15px;font-weight:700;text-transform:uppercase;color:#111111;margin-bottom:6px;}
                .insight-mini .im-desc{font-size:13px;color:#4A4742;line-height:1.55;}

                .radar-reasons{margin-top:16px;width:100%;}
                .rr-item{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:0px;margin-bottom:4px;font-size:12.5px;color:#4A4742;line-height:1.5;cursor:default;transition:background .15s;}
                .rr-item:hover{background:#FAF8F5;}
                .rr-item .rr-label{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.04em;color:#1849A9;white-space:nowrap;min-width:50px;padding-top:1px;}

                .action-detail{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;}
                .action-desc{font-size:12.5px;color:#4A4742;line-height:1.5;width:100%;}
                .action-res{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.03em;padding:3px 9px;border-radius:0px;background:rgba(24,73,169,.08);border:1px solid #1849A9;color:#1849A9;}

                .score-row{display:grid;grid-template-columns:1fr 1.3fr;gap:16px;margin-bottom:16px;}
                .score-stack{display:flex;flex-direction:column;gap:16px;}

                .score-block{margin-bottom:0;background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;padding:20px;border-radius:0px;}
                .score-block .sb-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;}
                .score-block .sb-label{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#757169;}
                .score-block .sb-val{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:26px;color:#111111;}
                .score-block .sb-val .of100{font-size:14px;color:#757169;font-weight:400;}
                .progress-track{height:8px;background:#EAE6DC;border-radius:0px;overflow:hidden;margin-bottom:16px;}
                .progress-fill{height:100%;background:#1849A9;border-radius:0px;}
                .flag-list{display:flex;flex-direction:column;gap:8px;}
                .flag-item{font-size:13px;color:#4A4742;display:flex;gap:8px;align-items:flex-start;}
                .flag-item::before{content:'—';color:#A32020;flex-shrink:0;}

                .redflag-list{display:flex;flex-direction:column;gap:10px;margin-top:6px;}
                .redflag-item{font-size:13.5px;color:#111111;display:flex;gap:10px;align-items:flex-start;}
                .redflag-item .dot{width:7px;height:7px;border-radius:0px;background:#A32020;flex-shrink:0;margin-top:5px;}

                .radar-wrap{display:flex;flex-direction:column;align-items:center;background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;padding:24px;border-radius:0px;}
                .radar-wrap h3{font-family:'Archivo Narrow',sans-serif;font-size:17px;font-weight:700;text-transform:uppercase;color:#111111;align-self:flex-start;margin-bottom:4px;}
                .radar-wrap .rsub{align-self:flex-start;font-size:12.5px;color:#757169;margin-bottom:22px;}

                .action-card{margin-top:8px;background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;padding:24px;border-radius:0px;}
                .action-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
                .action-head svg{width:18px;height:18px;color:#15803D;}
                .action-head h3{font-family:'Archivo Narrow',sans-serif;font-size:17px;font-weight:700;text-transform:uppercase;color:#111111;}
                .action-sub{font-size:13.5px;color:#4A4742;margin-bottom:20px;}
                .action-step{
                    display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid #D3CDC2;
                    border-radius:0px;margin-bottom:10px;background:#FAF8F5;color:#111111;
                }
                .action-step .anum{
                    width:26px;height:26px;border-radius:0px;background:#1849A9;color:#FFFFFF;
                    display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;flex-shrink:0;
                }
                @media(max-width:980px){.insight-row,.score-row{grid-template-columns:1fr;}}
            `}} />

            <div className="skills-head">
                <div className="page-head" style={{ marginBottom: 0 }}>
                    <div className="peyebrow">{t("title").toUpperCase()}</div>
                    <h1>{t("title")}</h1>
                    {targetRoleText && <div className="target-line">{t("targetRoleDisplay")}: <b>{targetRoleText}</b></div>}
                </div>
                <button className="btn-outline" onClick={() => setShowUpload(true)}>
                    <svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path d="M21 12a9 9 0 11-2.6-6.4M21 4v6h-6"/></svg>
                    {t("reanalyze")}
                </button>
            </div>

            {/* Superpower Card - top prominent card */}
            {superpower && (
                <div className="insight-row" style={{ marginBottom: '16px' }}>
                    <div className="insight-card power" style={{ gridColumn: '1 / -1' }}>
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <h3><svg viewBox="0 0 24 24" stroke="#34d399" strokeWidth="1.6" fill="none"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>{t("superpower")}</h3>
                        <p>{typeof superpower === 'string' ? superpower : superpower.description || superpower.title}</p>
                    </div>
                </div>
            )}

            {/* AI Insights - multiple typed cards */}
            {insightsArray.length > 0 && (
                <div className="insights-grid">
                    {insightsArray.map((ins, idx) => {
                        const colors = insightColor(ins.type);
                        return (
                            <div key={idx} className="insight-mini" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                                <span className="im-tag" style={{ color: colors.text, border: `1px solid ${colors.border}`, background: 'transparent' }}>{insightLabel(ins.type).toUpperCase()}</span>
                                <div className="im-title" style={{ color: colors.text }}>{ins.title}</div>
                                <div className="im-desc">{ins.description}</div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="score-row">
                <div className="score-stack">
                    <div className="bp-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="score-block">
                            <div className="sb-top"><span className="sb-label">{t("overallMatch")}</span><span className="sb-val">{overall_score}<span className="of100">/100</span></span></div>
                            <div className="progress-track"><div className="progress-fill" style={{ width: `${overall_score}%`, background: 'var(--dashboard-cyan)' }}></div></div>
                        </div>
                        <div className="score-block" style={{ marginTop: '22px' }}>
                            <div className="sb-top"><span className="sb-label">{t("atsScore")}</span><span className="sb-val">{atsScore}<span className="of100">/100</span></span></div>
                            <div className="progress-track"><div className="progress-fill" style={{ width: `${atsScore}%`, background: 'var(--dashboard-stamp)' }}></div></div>
                            {scores?.ats_feedback && scores.ats_feedback.length > 0 && (
                                <div className="flag-list">
                                    {scores.ats_feedback.map((fb: string, i: number) => (
                                        <div key={i} className="flag-item">{fb}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {redFlags.length > 0 && (
                        <div className="bp-card">
                            <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                            <h3 style={{ fontSize: '14px', color: 'var(--dashboard-stamp)', display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '16px' }}>
                                <svg viewBox="0 0 24 24" stroke="var(--dashboard-stamp)" strokeWidth="1.6" fill="none" style={{ width: '16px', height: '16px' }}><path d="M12 9v4M12 17h.01M10.3 3.86L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.86a2 2 0 00-3.4 0z"/></svg>
                                {t("redFlags")}
                            </h3>
                            <div className="redflag-list">
                                {redFlags.map((flag: string, i: number) => (
                                    <div key={i} className="redflag-item"><span className="dot"></span>{flag}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bp-card radar-wrap">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3>{t("competencyMatrix")}</h3>
                    <div className="rsub">{t("competencyDesc")}</div>
                    
                    {(() => {
                        const getPoint = (score: number, angleDeg: number) => {
                            const r = (score || 0) / 100 * 110; 
                            const a = (angleDeg - 90) * Math.PI / 180;
                            return `${140 + r * Math.cos(a)},${140 + r * Math.sin(a)}`;
                        };
                        
                        const ts = scores?.technical_skills || scores?.teknik || 0;
                        const cm = scores?.communication || scores?.iletisim || 0;
                        const ad = scores?.adaptability || scores?.uyumluluk || 0;
                        const ps = scores?.problem_solving || scores?.problemCozme || 0;
                        const co = scores?.collaboration || scores?.isbirligi || 0;
                        const ld = scores?.leadership || scores?.liderlik || 0;
                        
                        const p1 = getPoint(ts, 0);
                        const p2 = getPoint(cm, 60);
                        const p3 = getPoint(ad, 120);
                        const p4 = getPoint(ps, 180);
                        const p5 = getPoint(co, 240);
                        const p6 = getPoint(ld, 300);
                        
                        const points = `${p1} ${p2} ${p3} ${p4} ${p5} ${p6}`;

                        const categories = [
                            { key: 'technical_skills', label: t('techSkills'), score: ts },
                            { key: 'communication', label: t('communication'), score: cm },
                            { key: 'adaptability', label: t('adaptability'), score: ad },
                            { key: 'problem_solving', label: t('problemSolving'), score: ps },
                            { key: 'collaboration', label: t('collaboration'), score: co },
                            { key: 'leadership', label: t('leadership'), score: ld },
                        ];
                        
                        return (
                            <>
                                <svg width="280" height="280" viewBox="0 0 280 280">
                                    <g stroke="var(--dashboard-paper-border)" strokeWidth="1" fill="none">
                                        <polygon points="140,30 220,85 220,195 140,250 60,195 60,85"/>
                                        <polygon points="140,58 192,93 192,187 140,222 88,187 88,93"/>
                                        <polygon points="140,86 164,101 164,179 140,194 116,179 116,101"/>
                                    </g>
                                    <polygon points={points} fill="rgba(111,214,232,.18)" stroke="var(--dashboard-cyan)" strokeWidth="2"/>
                                    <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--dashboard-mono-label)" textAnchor="middle">
                                        <text x="140" y="18">{t("techSkills").toUpperCase()} ({ts})</text>
                                        <text x="245" y="89">{t("communication").toUpperCase()} ({cm})</text>
                                        <text x="245" y="199">{t("adaptability").toUpperCase()} ({ad})</text>
                                        <text x="140" y="266">{t("problemSolving").toUpperCase()} ({ps})</text>
                                        <text x="35" y="199">{t("collaboration").toUpperCase()} ({co})</text>
                                        <text x="35" y="89">{t("leadership").toUpperCase()} ({ld})</text>
                                    </g>
                                </svg>
                                {Object.keys(competencyReasoning).length > 0 && (
                                    <div className="radar-reasons">
                                        {categories.map(cat => (
                                            competencyReasoning[cat.key] && (
                                                <div key={cat.key} className="rr-item" onMouseEnter={() => setHoveredCategory(cat.key)} onMouseLeave={() => setHoveredCategory(null)} style={hoveredCategory === cat.key ? { background: 'rgba(111,214,232,.08)' } : {}}>
                                                    <span className="rr-label">{cat.score}</span>
                                                    <span><strong style={{ color: 'var(--dashboard-text)' }}>{cat.label}:</strong> {competencyReasoning[cat.key]}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>

            {actionPlan.length > 0 && (
                <div className="bp-card action-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <div className="action-head"><svg viewBox="0 0 24 24" stroke="var(--dashboard-green)" strokeWidth="1.8" fill="none"><path d="M20 6L9 17l-5-5"/></svg><h3>{t("actionPlanTitle")}</h3></div>
                    <div className="action-sub">{t("actionPlanDesc")}</div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {actionPlan.map((plan: any, i: number) => {
                        const title = typeof plan === 'string' ? plan : plan.title;
                        const desc = typeof plan === 'string' ? null : plan.description;
                        const resource = typeof plan === 'string' ? null : plan.resource;
                        return (
                            <div key={i} className="action-step" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <span className="anum">{i+1}</span>
                                    <span style={{ fontWeight: 500, fontSize: '14px' }}>{title}</span>
                                </div>
                                {(desc || resource) && (
                                    <div className="action-detail">
                                        {desc && <div className="action-desc">{desc}</div>}
                                        {resource && <span className="action-res">{resource}</span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* Kept out of standard design but useful for recommendations/cv Corrections if we want to display them in a matching style */}
            {cvCorrections.length > 0 && (
                <div className="bp-card action-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <div className="action-head">
                        <svg viewBox="0 0 24 24" stroke="var(--dashboard-cyan)" strokeWidth="1.8" fill="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/></svg>
                        <h3>{t("cvCorrectionsTitle")}</h3>
                    </div>
                    <div className="action-sub">{t("cvCorrectionsDesc")}</div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {cvCorrections.map((corr: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '16px', border: '1px solid var(--dashboard-paper-border)', borderRadius: 'var(--dashboard-radius)', background: 'rgba(255,255,255,.015)', padding: '14px' }}>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '240px' }}>
                                    <div style={{ fontSize: '10.5px', color: 'var(--dashboard-stamp)', fontFamily: '"JetBrains Mono", monospace', marginBottom: '8px' }}>{t("yourWriting")}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--dashboard-text-dim)', textDecoration: 'line-through' }}>{corr.original}</div>
                                </div>
                                <div style={{ flex: 1, minWidth: '240px' }}>
                                    <div style={{ fontSize: '10.5px', color: 'var(--dashboard-green)', fontFamily: '"JetBrains Mono", monospace', marginBottom: '8px' }}>{t("aiSuggestion")}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--dashboard-text)' }}>{corr.improved}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--dashboard-paper-border)', fontSize: '12px', color: 'var(--dashboard-text-dim)' }}>
                                <strong style={{ color: 'var(--dashboard-cyan)' }}>{t("reason")}</strong> {corr.reason}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
