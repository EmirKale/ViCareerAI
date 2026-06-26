"use client";

import { useTranslations, useLocale } from "next-intl";
import { ChevronRight, Check, Loader2, Lock, TrendingUp, BrainCircuit, Zap, RefreshCw, Upload, FileText, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";

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
            
            toast.success("Yol haritası oluşturuldu!");
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
            toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
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
            
            if (!parseRes.ok) throw new Error(parseData.error || "Dosya okunamadı");

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
                .rm-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:16px;align-items:start;}
                .rm-left{display:flex;flex-direction:column;gap:16px;}

                .score-gauge-card{
                    position:relative;background:linear-gradient(135deg, rgba(167,139,250,.18), rgba(111,214,232,.10));
                    border:1px solid rgba(111,214,232,0.55);border-radius:var(--dashboard-radius);padding:26px;
                }
                .score-gauge-card svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
                .score-gauge-card svg.corners path{stroke:var(--dashboard-cyan);stroke-width:1.3;fill:none;}
                .sg-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;}
                .sg-label{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--dashboard-mono-label);}
                .sg-val{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:40px;margin-bottom:18px;}
                .sg-val .of100{font-size:18px;color:var(--dashboard-text-dim);font-weight:400;}
                .sg-track{height:8px;background:rgba(255,255,255,.1);border-radius:4px;overflow:hidden;margin-bottom:14px;}
                .sg-fill{height:100%;background:linear-gradient(90deg, var(--dashboard-cyan), var(--dashboard-purple, #A78BFA));border-radius:4px;}
                .sg-delta{font-size:12.5px;color:var(--dashboard-green);}

                .prep-card .pc-title{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--dashboard-mono-label);margin-bottom:20px;}
                .prep-row{margin-bottom:18px;}
                .prep-row:last-child{margin-bottom:0;}
                .prep-row .pr-top{display:flex;justify-content:space-between;margin-bottom:10px;font-size:13.5px;}
                .prep-row .pr-name{color:var(--dashboard-text-dim);}
                .prep-row .pr-pct{font-family:'JetBrains Mono',monospace;color:var(--dashboard-cyan);}
                .prep-track{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;}
                .prep-fill{height:100%;background:var(--dashboard-cyan);border-radius:3px;}

                .insight-mini{display:flex;flex-direction:column;gap:14px;margin-top:6px;}
                .insight-pill{padding:14px 16px;border-radius:var(--dashboard-radius);border:1px solid var(--dashboard-paper-border);background:rgba(255,255,255,.015);}
                .insight-pill .ip-title{font-size:13.5px;font-weight:600;margin-bottom:6px;}
                .insight-pill .ip-title.warn{color:var(--dashboard-stamp);}
                .insight-pill .ip-title.good{color:var(--dashboard-green);}
                .insight-pill p{font-size:12.5px;color:var(--dashboard-text-dim);line-height:1.55;}

                .journey-card .jc-title{font-size:16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
                .plan-tag-mini{font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--dashboard-cyan);border:1px solid rgba(111,214,232,0.55);padding:3px 8px;border-radius:var(--dashboard-radius);}
                .journey{position:relative;padding-left:6px;}
                .jstep{position:relative;padding:0 0 28px 36px;}
                .jstep:last-child{padding-bottom:0;}
                .jstep::before{content:'';position:absolute;left:9px;top:24px;bottom:-4px;width:1px;background:var(--dashboard-paper-border);}
                .jstep:last-child::before{display:none;}
                .jmark{position:absolute;left:0;top:0;width:19px;height:19px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
                .jmark.done{background:var(--dashboard-green);}
                .jmark.done svg{width:11px;height:11px;color:#06121f;}
                .jmark.active{border:2px solid var(--dashboard-purple, #A78BFA);background:var(--dashboard-bg);}
                .jmark.locked{border:1.5px solid var(--dashboard-paper-border);background:var(--dashboard-bg);}
                .jmark.locked svg{width:10px;height:10px;color:var(--dashboard-text-dim);}
                .jbody{padding:2px 0 0;}
                .jstep.active .jbody{border:1px solid var(--dashboard-purple, #A78BFA);border-radius:var(--dashboard-radius);padding:14px 16px;background:rgba(167,139,250,.05);margin-top:-4px;}
                .jtitle-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px;}
                .jtitle{font-size:14.5px;font-weight:500;}
                .jstep.locked .jtitle, .jstep.locked p{opacity:.45;}
                .jtag{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.04em;padding:3px 8px;border-radius:var(--dashboard-radius);white-space:nowrap;}
                .jtag.done{color:var(--dashboard-green);border:1px solid rgba(111,232,168,.4);}
                .jtag.locked{color:var(--dashboard-mono-label);border:1px solid var(--dashboard-paper-border);}
                .jstep p{font-size:13px;color:var(--dashboard-text-dim);line-height:1.55;margin-bottom:10px;}
                .jprogress-row{display:flex;align-items:center;gap:12px;}
                .jprogress-track{flex:1;height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;}
                .jprogress-fill{height:100%;background:var(--dashboard-purple, #A78BFA);border-radius:3px;}
                .jpct{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--dashboard-purple, #A78BFA);}
                .jbtn{font-family:'JetBrains Mono',monospace;font-size:11px;background:var(--dashboard-purple, #A78BFA);color:#0A1628;padding:7px 13px;border-radius:var(--dashboard-radius);border:none;white-space:nowrap;}
                @media(max-width:980px){.rm-grid{grid-template-columns:1fr;}}
            `}} />

            <div className="rm-head">
                <div className="page-head" style={{ marginBottom: 0 }}>
                    <div className="peyebrow">KARİYER YOL HARİTASI</div>
                    <h1>{target_position || "Kariyer Yol Haritası"}</h1>
                    <p>{target_position} pozisyonu için özel hazırlanmış gelişim planınız.</p>
                </div>
                <button className="btn-outline" onClick={() => setShowUpload(true)}>
                    <svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
                        <path d="M21 12a9 9 0 11-2.6-6.4M21 4v6h-6"/>
                    </svg>
                    Yeniden Analiz Et
                </button>
            </div>

            <div className="rm-grid">
                <div className="rm-left">
                    <div className="score-gauge-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="sg-top">
                            <span className="sg-label">YETENEK PUANI</span>
                            <svg className="icon" viewBox="0 0 24 24" style={{ color: 'var(--dashboard-green)', width: '18px', height: '18px' }}><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
                        </div>
                        <div className="sg-val">{overall_score}<span className="of100">/100</span></div>
                        <div className="sg-track"><div className="sg-fill" style={{ width: `${overall_score}%` }}></div></div>
                        <div className="sg-delta">Hedefe ulaşmak için harika bir temel</div>
                    </div>

                    <div className="bp-card prep-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="pc-title">HAZIRLIK TAHMİNİ</div>
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
                            AI İçgörüleri
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
                    <div className="jc-title">Öğrenme Yolculuğu <span className="plan-tag-mini">PLAN</span></div>

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
                                            {isCompleted && <span className="jtag done">TAMAMLANDI</span>}
                                            {isInProgress && <button className="jbtn">Devam Et</button>}
                                            {isLocked && <span className="jtag locked">KİLİTLİ</span>}
                                        </div>
                                        <p>{step.description}</p>
                                        {isInProgress && step.progress !== undefined && (
                                            <div className="jprogress-row">
                                                <div className="jprogress-track"><div className="jprogress-fill" style={{ width: `${step.progress}%` }}></div></div>
                                                <span className="jpct">{step.progress}%</span>
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
