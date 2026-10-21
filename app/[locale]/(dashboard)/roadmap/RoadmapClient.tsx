"use client";

import { useTranslations, useLocale } from "next-intl";
import { ChevronRight, Loader2, Upload, FileText, Target } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RoadmapClient({ analysisData, cvs: initialCvs }: { analysisData: any, cvs: any[] }) {
    const t = useTranslations("Roadmap");
    const locale = useLocale();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cvs] = useState<any[]>(initialCvs || []);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showUpload, setShowUpload] = useState(!analysisData);
    const [targetPosition, setTargetPosition] = useState(analysisData?.target_position || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalyzeFromCV = async (cvId: string) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/roadmap/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvId, targetPosition, locale })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success(t("roadmapCreated") || "Yol haritası oluşturuldu!");
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

            const res = await fetch("/api/roadmap/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileContent: parseData.text, targetPosition, locale })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            toast.success(t("roadmapCreated") || "Yol haritası oluşturuldu!");
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
                    <h1>{t("title") || "Kariyer Yol Haritası"}</h1>
                    <p className="sub">{t("desc") || "Hedef pozisyonunuza ulaşmak için size özel, adım adım bir yol haritası oluşturun."}</p>

                    {isAnalyzing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '40px 0' }}>
                            <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--dashboard-cyan)' }} />
                            <p style={{ color: 'var(--dashboard-cyan)' }} className="animate-pulse">{t("analyzing") || "Yapay zeka yol haritanızı oluşturuyor..."}</p>
                        </div>
                    ) : (
                        <>
                            <div className="field-block">
                                <div className="flabel"><Target className="w-[14px] h-[14px]" /> {t("targetPositionLabel") || "HEDEF POZİSYON (OPSİYONEL)"}</div>
                                <input 
                                    type="text" 
                                    placeholder={t("targetPositionPlaceholder") || "Örn: Senior Frontend Developer"} 
                                    value={targetPosition}
                                    onChange={(e) => setTargetPosition(e.target.value)}
                                />
                                <div className="fhint">{t("targetPositionHint") || "Boş bırakırsanız CV'nizdeki deneyimlere göre tahmin edilecektir."}</div>
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

                            {analysisData && (
                                <button className="cancel-link" onClick={() => setShowUpload(false)}>
                                    {t("cancelAndReturn") || "İptal Et ve Haritaya Dön"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    const { overall_score, readiness, steps, insights, target_position } = analysisData;

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .rm-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:28px;}
                .page-head h1{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:clamp(26px,3vw,32px);text-transform:uppercase;color:#111111;margin-bottom:6px;letter-spacing:-0.01em;}
                .peyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#757169;margin-bottom:6px;}
                .rm-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:16px;align-items:start;}
                .rm-left{display:flex;flex-direction:column;gap:16px;}

                .score-gauge-card{
                    position:relative;background:#FFFFFF;
                    border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;padding:26px;
                }
                .score-gauge-card svg.corners{display:none;}
                .sg-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;}
                .sg-label{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#757169;}
                .sg-val{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:42px;color:#111111;margin-bottom:18px;}
                .sg-val .of100{font-size:18px;color:#757169;font-weight:400;}
                .sg-track{height:8px;background:#EAE6DC;border-radius:0px;overflow:hidden;margin-bottom:14px;}
                .sg-fill{height:100%;background:#1849A9;border-radius:0px;}
                .sg-delta{font-size:12.5px;color:#15803D;font-weight:700;}

                .prep-card{background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;padding:26px;}
                .prep-card .pc-title{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#757169;margin-bottom:20px;}
                .prep-row{margin-bottom:18px;}
                .prep-row:last-child{margin-bottom:0;}
                .prep-row .pr-top{display:flex;justify-content:space-between;margin-bottom:8px;font-size:13.5px;}
                .prep-row .pr-name{color:#4A4742;font-weight:500;}
                .prep-row .pr-pct{font-family:'JetBrains Mono',monospace;font-weight:700;color:#1849A9;}
                .prep-track{height:6px;background:#EAE6DC;border-radius:0px;overflow:hidden;}
                .prep-fill{height:100%;background:#1849A9;border-radius:0px;}

                .insight-mini{display:flex;flex-direction:column;gap:14px;margin-top:6px;}
                .insight-pill{padding:14px 16px;border-radius:0px;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;background:#FFFFFF;}
                .insight-pill .ip-title{font-family:'Archivo Narrow',sans-serif;font-size:14.5px;font-weight:700;text-transform:uppercase;margin-bottom:6px;color:#111111;}
                .insight-pill .ip-title.warn{color:#A32020;}
                .insight-pill .ip-title.good{color:#15803D;}
                .insight-pill p{font-size:13px;color:#4A4742;line-height:1.55;}

                .journey-card{background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;padding:26px;}
                .journey-card .jc-title{font-family:'Archivo Narrow',sans-serif;font-size:18px;font-weight:700;text-transform:uppercase;color:#111111;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
                .plan-tag-mini{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:#1849A9;border:1px solid #1849A9;background:rgba(24,73,169,0.06);padding:3px 8px;border-radius:0px;text-transform:uppercase;}
                .journey{position:relative;padding-left:6px;}
                .jstep{position:relative;padding:0 0 28px 36px;}
                .jstep:last-child{padding-bottom:0;}
                .jstep::before{content:'';position:absolute;left:9px;top:24px;bottom:-4px;width:1px;background:#D3CDC2;}
                .jstep:last-child::before{display:none;}
                .jmark{position:absolute;left:0;top:0;width:19px;height:19px;border-radius:0px;display:flex;align-items:center;justify-content:center;}
                .jmark.done{background:#15803D;color:#FFFFFF;}
                .jmark.done svg{width:11px;height:11px;color:#FFFFFF;}
                .jmark.active{border:2px solid #111111;background:#1849A9;color:#FFFFFF;}
                .jmark.locked{border:1.5px solid #D3CDC2;background:#EAE6DC;}
                .jmark.locked svg{width:10px;height:10px;color:#757169;}
                .jbody{padding:2px 0 0;}
                .jstep.active .jbody{border:1.5px solid #111111;box-shadow:2px 2px 0px #111111;border-radius:0px;padding:14px 16px;background:#FAF8F5;margin-top:-4px;}
                .jtitle-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px;}
                .jtitle{font-family:'Archivo Narrow',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;color:#111111;}
                .jstep.locked .jtitle, .jstep.locked p{opacity:.5;}
                .jtag{font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:.04em;padding:3px 8px;border-radius:0px;white-space:nowrap;text-transform:uppercase;}
                .jtag.done{color:#15803D;border:1px solid #15803D;background:rgba(21,128,61,0.06);}
                .jtag.locked{color:#757169;border:1px solid #D3CDC2;background:#FFFFFF;}
                .jstep p{font-size:13px;color:#4A4742;line-height:1.55;margin-bottom:10px;}
                .jprogress-row{display:flex;align-items:center;gap:12px;}
                .jprogress-track{flex:1;height:5px;background:#EAE6DC;border-radius:0px;overflow:hidden;}
                .jprogress-fill{height:100%;background:#1849A9;border-radius:0px;}
                .jpct{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#1849A9;}
                .jbtn{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;text-transform:uppercase;background:#1849A9;color:#FFFFFF;padding:7px 13px;border-radius:0px;border:1px solid #111111;white-space:nowrap;cursor:pointer;}
                .jbtn:hover{background:#123782;}
                .jmeta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:10px;}
                .jduration{display:inline-flex;align-items:center;gap:5px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#1849A9;background:rgba(24,73,169,.08);border:1px solid #1849A9;padding:4px 10px;border-radius:0px;}
                .jduration svg{width:12px;height:12px;}
                .jresources{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
                .jres-chip{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.03em;padding:3px 9px;border-radius:0px;background:rgba(24,73,169,.08);border:1px solid #1849A9;color:#1849A9;}
                @media(max-width:980px){.rm-grid{grid-template-columns:1fr;}}
            `}} />

            <div className="rm-head">
                <div className="page-head" style={{ marginBottom: 0 }}>
                    <div className="peyebrow">{t("title").toUpperCase()}</div>
                    <h1>{target_position || t("title")}</h1>
                    <p>{target_position ? t("positionDesc", { position: target_position }) : t("desc")}</p>
                </div>
                <button className="btn-outline" onClick={() => setShowUpload(true)}>
                    <svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
                        <path d="M21 12a9 9 0 11-2.6-6.4M21 4v6h-6"/>
                    </svg>
                    {t("reanalyze") || "Yeniden Analiz Et"}
                </button>
            </div>

            <div className="rm-grid">
                <div className="rm-left">
                    <div className="score-gauge-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="sg-top">
                            <span className="sg-label">{t("skillsScore").toUpperCase()}</span>
                            <svg className="icon" viewBox="0 0 24 24" style={{ color: 'var(--dashboard-green)', width: '18px', height: '18px' }}><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
                        </div>
                        <div className="sg-val">{overall_score}<span className="of100">/100</span></div>
                        <div className="sg-track"><div className="sg-fill" style={{ width: `${overall_score}%` }}></div></div>
                        <div className="sg-delta">{t("scoreDelta") || "Hedefe ulaşmak için harika bir temel"}</div>
                    </div>

                    <div className="bp-card prep-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="pc-title">{t("readinessForecast").toUpperCase()}</div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {Object.entries(readiness || {}).map(([category, value]: [string, any], idx) => (
                            <div className="prep-row" key={idx}>
                                <div className="pr-top"><span className="pr-name">{category}</span><span className="pr-pct">{value}%</span></div>
                                <div className="prep-track"><div className="prep-fill" style={{ width: `${value}%` }}></div></div>
                            </div>
                        ))}
                    </div>

                    <div className="bp-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <h3 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '16px' }}>
                            <svg viewBox="0 0 24 24" stroke="var(--dashboard-cyan)" strokeWidth="1.6" fill="none" style={{ width: '16px', height: '16px' }}><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/></svg>
                            {t("aiInsights")}
                        </h3>
                        <div className="insight-mini">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {Array.isArray(insights) && insights.map((insight: any, idx: number) => (
                                <div className="insight-pill" key={idx}>
                                    <div className={`ip-title ${insight.type === 'critical' ? 'warn' : 'good'}`}>{insight.title}</div>
                                    <p>{insight.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bp-card journey-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <div className="jc-title">{t("learningJourney")} <span className="plan-tag-mini">PLAN</span></div>

                    <div className="journey">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {Array.isArray(steps) && steps.map((step: any, idx: number) => {
                            const isCompleted = step.status === 'completed';
                            const isInProgress = step.status === 'in_progress';
                            const isLocked = step.status === 'locked';

                            return (
                                <div className={`jstep ${isCompleted ? 'done' : isInProgress ? 'active' : 'locked'}`} key={idx}>
                                    <span className={`jmark ${isCompleted ? 'done' : isInProgress ? 'active' : 'locked'}`}>
                                        {isCompleted && <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none"><path d="M20 6L9 17l-5-5"/></svg>}
                                        {isLocked && <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>}
                                    </span>
                                    <div className="jbody">
                                        <div className="jtitle-row">
                                            <span className="jtitle">{step.title}</span>
                                            {isCompleted && <span className="jtag done">{t("completed").toUpperCase()}</span>}
                                            {isInProgress && <button className="jbtn">{t("continue")}</button>}
                                            {isLocked && <span className="jtag locked">{t("locked").toUpperCase()}</span>}
                                        </div>
                                        <p>{step.description}</p>
                                        {isInProgress && step.progress !== undefined && (
                                            <div className="jprogress-row">
                                                <div className="jprogress-track"><div className="jprogress-fill" style={{ width: `${step.progress}%` }}></div></div>
                                                <span className="jpct">{step.progress}%</span>
                                            </div>
                                        )}
                                        <div className="jmeta">
                                            {step.estimatedDuration && (
                                                <span className="jduration">
                                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                                    {t("estimatedDuration")}: {step.estimatedDuration}
                                                </span>
                                            )}
                                        </div>
                                        {step.resources && step.resources.length > 0 && (
                                            <div className="jresources">
                                                {step.resources.map((res: string, rIdx: number) => (
                                                    <span className="jres-chip" key={rIdx}>{res}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
