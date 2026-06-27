"use client";

import { useTranslations, useLocale } from "next-intl";
import { Sparkles, Box, Users, Terminal, ArrowRight, Upload, FileText, Loader2, RefreshCw, AlertTriangle, Target, CheckCircle2, Zap, ArrowRightCircle, Activity, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
                        width:100%;max-width:540px;background:rgba(14,32,56,.6);backdrop-filter:blur(6px);
                        border:1.5px dashed var(--dashboard-cyan-dim);border-radius:6px;padding:clamp(32px,5vw,48px) clamp(28px,5vw,44px);
                        text-align:center;
                    }
                    .select-card h1{font-size:clamp(22px,3vw,27px);margin-bottom:10px;}
                    .select-card .sub{font-size:14px;color:var(--dashboard-text-dim);max-width:400px;margin:0 auto 32px;line-height:1.55;}

                    .field-block{text-align:left;margin-bottom:26px;}
                    .field-block .flabel{
                        display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;
                        letter-spacing:.06em;color:var(--dashboard-text);font-weight:600;margin-bottom:10px;
                    }
                    .field-block .flabel svg{width:14px;height:14px;color:var(--dashboard-cyan);}
                    .field-block input{
                        width:100%;height:48px;padding:0 14px;background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);
                        border-radius:var(--dashboard-radius);color:var(--dashboard-text);font-size:14.5px;
                    }
                    .field-block input:focus{outline:none;border-color:var(--dashboard-cyan);background:rgba(111,214,232,0.04);}
                    .field-block input::placeholder{color:rgba(234,243,247,0.3);}
                    .field-block .fhint{font-size:12px;color:var(--dashboard-mono-label);margin-top:9px;}

                    .cv-pick{
                        display:flex;align-items:center;gap:12px;width:100%;height:54px;padding:0 18px;
                        background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);
                        color:var(--dashboard-text);font-size:14.5px;font-weight:500;margin-bottom:10px;text-align:left;
                    }
                    .cv-pick:hover{border-color:var(--dashboard-cyan-dim);background:rgba(111,214,232,.04);cursor:pointer;}
                    .cv-pick svg.cv-doc{width:17px;height:17px;color:var(--dashboard-cyan);flex-shrink:0;}
                    .cv-pick .cv-name{flex:1;}
                    .cv-pick svg.cv-go{width:15px;height:15px;color:var(--dashboard-mono-label);flex-shrink:0;}

                    .divider{display:flex;align-items:center;gap:14px;margin:26px 0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;color:var(--dashboard-mono-label);}
                    .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--dashboard-paper-border);}

                    .upload-btn{
                        width:100%;height:50px;display:flex;align-items:center;justify-content:center;gap:10px;
                        border:1px solid var(--dashboard-cyan-dim);border-radius:var(--dashboard-radius);background:rgba(111,214,232,.06);
                        color:var(--dashboard-cyan);font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.02em;
                    }
                    .upload-btn:hover{background:rgba(111,214,232,.12);cursor:pointer;}
                    .upload-btn svg{width:16px;height:16px;}
                    .upload-hint{font-size:11.5px;color:var(--dashboard-mono-label);margin-top:10px;font-family:'JetBrains Mono',monospace;}

                    .cancel-link{display:block;margin-top:30px;font-size:13px;color:var(--dashboard-cyan-dim);cursor:pointer;background:transparent;border:none;margin-left:auto;margin-right:auto;}
                    .cancel-link:hover{color:var(--dashboard-cyan);text-decoration:underline;}
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

    const { scores, overall_score, insight, recommendations } = analysisData;
    
    // New Advanced fields parsed from the JSONB scores object
    const targetRoleText = scores?.target_role;
    const atsScore = scores?.ats_score || overall_score;
    const superpower = scores?.superpower;
    const redFlags = scores?.red_flags || [];
    const actionPlan = scores?.action_plan || [];
    const cvCorrections = scores?.cv_corrections || [];

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .skills-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:28px;}
                .target-line{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--dashboard-text-dim);margin-top:6px;}
                .target-line b{color:var(--dashboard-text);}

                .insight-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
                .insight-card{position:relative;border-radius:var(--dashboard-radius);padding:24px;}
                .insight-card svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
                .insight-card svg.corners path{stroke-width:1.3;fill:none;}
                .insight-card.std{background:var(--dashboard-paper);border:1px solid var(--dashboard-paper-border);}
                .insight-card.std svg.corners path{stroke:var(--dashboard-cyan);}
                .insight-card.power{background:rgba(232,84,60,.06);border:1px solid var(--dashboard-stamp-dim);}
                .insight-card.power svg.corners path{stroke:var(--dashboard-stamp);}
                .insight-card h3{font-size:14px;display:flex;align-items:center;gap:9px;margin-bottom:14px;}
                .insight-card h3 svg{width:16px;height:16px;}
                .insight-card.power h3{color:var(--dashboard-stamp);}
                .insight-card p{font-size:14px;line-height:1.65;color:var(--dashboard-text-dim);}
                .insight-card.power p{color:var(--dashboard-text);}

                .score-row{display:grid;grid-template-columns:1fr 1.3fr;gap:16px;margin-bottom:16px;}
                .score-stack{display:flex;flex-direction:column;gap:16px;}

                .score-block{margin-bottom:0;}
                .score-block .sb-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;}
                .score-block .sb-label{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--dashboard-mono-label);}
                .score-block .sb-val{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:22px;}
                .score-block .sb-val .of100{font-size:13px;color:var(--dashboard-text-dim);font-weight:400;}
                .progress-track{height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden;margin-bottom:16px;}
                .progress-fill{height:100%;border-radius:4px;}
                .flag-list{display:flex;flex-direction:column;gap:8px;}
                .flag-item{font-size:12.5px;color:var(--dashboard-text-dim);display:flex;gap:8px;align-items:flex-start;}
                .flag-item::before{content:'—';color:var(--dashboard-stamp);flex-shrink:0;}

                .redflag-list{display:flex;flex-direction:column;gap:10px;margin-top:6px;}
                .redflag-item{font-size:13.5px;color:var(--dashboard-text);display:flex;gap:10px;align-items:flex-start;}
                .redflag-item .dot{width:7px;height:7px;border-radius:50%;background:var(--dashboard-stamp);flex-shrink:0;margin-top:5px;}

                .radar-wrap{display:flex;flex-direction:column;align-items:center;}
                .radar-wrap h3{align-self:flex-start;margin-bottom:4px;}
                .radar-wrap .rsub{align-self:flex-start;font-size:12.5px;color:var(--dashboard-text-dim);margin-bottom:22px;}

                .action-card{margin-top:8px;}
                .action-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
                .action-head svg{width:18px;height:18px;color:var(--dashboard-green);}
                .action-head h3{font-size:16px;}
                .action-sub{font-size:13px;color:var(--dashboard-text-dim);margin-bottom:20px;}
                .action-step{
                    display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--dashboard-paper-border);
                    border-radius:var(--dashboard-radius);margin-bottom:10px;background:rgba(255,255,255,.015);
                }
                .action-step .anum{
                    width:26px;height:26px;border-radius:50%;background:rgba(111,214,232,.1);color:var(--dashboard-cyan);
                    display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:12px;flex-shrink:0;
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

            <div className="insight-row">
                <div className="insight-card std">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3><svg viewBox="0 0 24 24" stroke="var(--dashboard-cyan)" strokeWidth="1.6" fill="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/></svg>{t("aiInsights")}</h3>
                    <p>{insight}</p>
                </div>
                {superpower && (
                    <div className="insight-card power">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <h3><svg viewBox="0 0 24 24" stroke="var(--dashboard-stamp)" strokeWidth="1.6" fill="none"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>{t("superpower")}</h3>
                        <p>{superpower}</p>
                    </div>
                )}
            </div>

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
                        
                        const p1 = getPoint(scores?.teknik, 0);
                        const p2 = getPoint(scores?.iletisim, 60);
                        const p3 = getPoint(scores?.uyumluluk, 120);
                        const p4 = getPoint(scores?.problemCozme, 180);
                        const p5 = getPoint(scores?.isbirligi, 240);
                        const p6 = getPoint(scores?.liderlik, 300);
                        
                        const points = `${p1} ${p2} ${p3} ${p4} ${p5} ${p6}`;
                        
                        return (
                            <svg width="280" height="280" viewBox="0 0 280 280">
                                <g stroke="var(--dashboard-paper-border)" strokeWidth="1" fill="none">
                                    <polygon points="140,30 220,85 220,195 140,250 60,195 60,85"/>
                                    <polygon points="140,58 192,93 192,187 140,222 88,187 88,93"/>
                                    <polygon points="140,86 164,101 164,179 140,194 116,179 116,101"/>
                                </g>
                                <polygon points={points} fill="rgba(111,214,232,.18)" stroke="var(--dashboard-cyan)" strokeWidth="2"/>
                                <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--dashboard-mono-label)" textAnchor="middle">
                                    <text x="140" y="18">{t("techSkills").toUpperCase()} ({scores?.teknik || 0})</text>
                                    <text x="245" y="89">{t("communication").toUpperCase()} ({scores?.iletisim || 0})</text>
                                    <text x="245" y="199">{t("adaptability").toUpperCase()} ({scores?.uyumluluk || 0})</text>
                                    <text x="140" y="266">{t("problemSolving").toUpperCase()} ({scores?.problemCozme || 0})</text>
                                    <text x="35" y="199">{t("collaboration").toUpperCase()} ({scores?.isbirligi || 0})</text>
                                    <text x="35" y="89">{t("leadership").toUpperCase()} ({scores?.liderlik || 0})</text>
                                </g>
                            </svg>
                        );
                    })()}
                </div>
            </div>

            {actionPlan.length > 0 && (
                <div className="bp-card action-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <div className="action-head"><svg viewBox="0 0 24 24" stroke="var(--dashboard-green)" strokeWidth="1.8" fill="none"><path d="M20 6L9 17l-5-5"/></svg><h3>{t("actionPlanTitle")}</h3></div>
                    <div className="action-sub">{t("actionPlanDesc")}</div>
                    {actionPlan.map((plan: string, i: number) => (
                        <div key={i} className="action-step"><span className="anum">{i+1}</span>{plan}</div>
                    ))}
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
