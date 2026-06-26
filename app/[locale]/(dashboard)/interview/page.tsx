"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Sparkles, Activity, ChevronLeft, Image as ImageIcon, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function AIInterviewPage() {
    const [isRecording, setIsRecording] = useState(false);
    const t = useTranslations("Interview");

    return (
        <div className="h-full flex flex-col items-center py-8">
            <style dangerouslySetInnerHTML={{__html: `
                .preview-banner{
                    display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:12.5px;
                    color:var(--dashboard-stamp);border:1px dashed var(--dashboard-stamp-dim);border-radius:var(--dashboard-radius);padding:13px 16px;
                    margin-bottom:28px;max-width:680px;width:100%;
                }
                .interview-wrap{max-width:680px;width:100%;}
                .iv-eyebrow{display:flex;align-items:center;justify-content:center;gap:10px;font-size:14px;font-weight:500;margin-bottom:18px;}
                .iv-eyebrow svg{width:16px;height:16px;color:var(--dashboard-cyan);}

                .avatar-box{
                    position:relative;border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);overflow:hidden;
                    background:radial-gradient(ellipse at center, rgba(167,139,250,.15), var(--dashboard-bg-2) 70%);
                    height:300px;display:flex;align-items:center;justify-content:center;margin-bottom:22px;
                }
                .avatar-glow{width:140px;height:140px;border-radius:50%;background:radial-gradient(circle, rgba(167,139,250,.4), transparent 70%);display:flex;align-items:center;justify-content:center;}
                .avatar-glow svg{width:70px;height:70px;color:var(--dashboard-cyan);}
                .avatar-mic{
                    position:absolute;bottom:16px;left:50%;transform:translateX(-50%);
                    width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.4);border:1px solid var(--dashboard-paper-border);
                    display:flex;align-items:center;justify-content:center;color:var(--dashboard-cyan);
                }

                .q-counter{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;color:var(--dashboard-mono-label);text-align:center;margin-bottom:14px;}
                .q-text{font-size:19px;font-weight:600;text-align:center;line-height:1.5;margin-bottom:28px;font-family:'Space Grotesk',sans-serif;}

                .analysis-card{position:relative;background:var(--dashboard-paper);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);padding:26px;margin-bottom:20px;}
                .analysis-card svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
                .analysis-card svg.corners path{stroke:var(--dashboard-cyan);stroke-width:1.3;fill:none;}
                .analysis-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:20px;}
                .analysis-title{display:flex;align-items:center;gap:9px;font-size:14px;color:var(--dashboard-cyan);}
                .score-circle{width:64px;height:64px;border-radius:50%;border:2px solid var(--dashboard-cyan);display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:22px;flex-shrink:0;}
                .check-list{display:flex;flex-direction:column;gap:9px;}
                .check-item{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--dashboard-text-dim);}
                .check-item svg{width:14px;height:14px;flex-shrink:0;}
                .check-item.good svg{color:var(--dashboard-green);}
                .check-item.warn svg{color:var(--dashboard-amber);}

                .metric-block{margin-bottom:18px;}
                .metric-block:last-of-type{margin-bottom:0;}
                .metric-top{display:flex;justify-content:space-between;margin-bottom:10px;font-size:12.5px;}
                .metric-name{font-family:'JetBrains Mono',monospace;letter-spacing:.06em;color:var(--dashboard-mono-label);}
                .metric-pct{font-family:'JetBrains Mono',monospace;font-weight:600;}
                .metric-track{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;}
                .metric-fill{height:100%;border-radius:3px;}

                .tone-row{display:flex;justify-content:space-between;align-items:center;margin-top:22px;padding-top:18px;border-top:1px solid var(--dashboard-paper-border);}
                .tone-label{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--dashboard-mono-label);}
                .tone-tag{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--dashboard-cyan);border:1px solid var(--dashboard-cyan-dim);padding:4px 10px;border-radius:var(--dashboard-radius);}

                .transcript-box{
                    width:100%;min-height:64px;background:rgba(255,255,255,.02);border:1px solid var(--dashboard-paper-border);
                    border-radius:var(--dashboard-radius);padding:14px 16px;font-size:13.5px;color:var(--dashboard-text-dim);line-height:1.6;margin-bottom:18px;
                }
                .iv-actions{display:flex;gap:12px;}
                .iv-actions .btn-outline, .iv-actions .btn-stamp{flex:1;justify-content:center;}
                .btn-stamp{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.03em;background:var(--dashboard-stamp);color:var(--dashboard-bg);padding:11px 18px;border-radius:var(--dashboard-radius);border:none;}
                .btn-outline{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.03em;background:transparent;color:var(--dashboard-text);padding:11px 18px;border-radius:var(--dashboard-radius);border:1px solid var(--dashboard-paper-border);}
                .btn-outline:hover{border-color:var(--dashboard-cyan-dim);}
                @media(max-width:600px){.analysis-top{flex-direction:column;}}
            `}} />

            <div className="preview-banner">
                <svg className="icon" viewBox="0 0 24 24" style={{ color: 'var(--dashboard-stamp)', width: '16px', height: '16px' }}><path d="M12 9v4M12 17h.01M10.3 3.86L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.86a2 2 0 00-3.4 0z"/></svg>
                Bu özellik yakında aktif olacak. Şu an önizleme modunda.
            </div>

            <div className="interview-wrap w-full px-4">
                <div className="iv-eyebrow"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>✦ ViCareer AI</div>

                <div className="avatar-box">
                    <div className="avatar-glow">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" fill="none"><path d="M9.5 2a2.5 2.5 0 015 0v8a2.5 2.5 0 01-5 0z"/><path d="M12 6.5a3 3 0 013 3M9 9.5a3 3 0 013-3"/></svg>
                    </div>
                    <div className="avatar-mic"><svg className="icon" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}><path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg></div>
                </div>

                <div className="q-counter">{t("questionCount")}</div>
                <div className="q-text">{t("question")}</div>

                <div className="analysis-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <div className="analysis-top">
                        <div>
                            <div className="analysis-title"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none" style={{ width: '16px', height: '16px' }}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>{t("liveAnalysis")}</div>
                            <div className="check-list" style={{ marginTop: '16px' }}>
                                <div className="check-item good"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 6L9 17l-5-5"/></svg>{t("strongStart")}</div>
                                <div className="check-item good"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 6L9 17l-5-5"/></svg>{t("clearArtic")}</div>
                                <div className="check-item warn"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none"><path d="M12 9v4M12 17h.01M10.3 3.86L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.86a2 2 0 00-3.4 0z"/></svg>{t("pacingFast")}</div>
                            </div>
                        </div>
                        <div className="score-circle">85</div>
                    </div>

                    <div className="metric-block">
                        <div className="metric-top"><span className="metric-name">{t("techAccuracy")}</span><span className="metric-pct" style={{ color: 'var(--dashboard-green)' }}>92%</span></div>
                        <div className="metric-track"><div className="metric-fill" style={{ width: '92%', background: 'var(--dashboard-green)' }}></div></div>
                    </div>
                    <div className="metric-block">
                        <div className="metric-top"><span className="metric-name">{t("fluency")}</span><span className="metric-pct" style={{ color: 'var(--dashboard-cyan)' }}>88%</span></div>
                        <div className="metric-track"><div className="metric-fill" style={{ width: '88%', background: 'var(--dashboard-cyan)' }}></div></div>
                    </div>
                    <div className="metric-block">
                        <div className="metric-top"><span className="metric-name">{t("confidence")}</span><span className="metric-pct" style={{ color: 'var(--dashboard-purple)' }}>76%</span></div>
                        <div className="metric-track"><div className="metric-fill" style={{ width: '76%', background: 'var(--dashboard-purple)' }}></div></div>
                    </div>

                    <div className="tone-row"><span className="tone-label">{t("tone")}</span><span className="tone-tag">{t("toneValue")}</span></div>
                </div>

                <div className="transcript-box">{t("userSim")}</div>

                <div className="iv-actions">
                    <button className="btn-outline"><svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>{t("showResume")}</button>
                    <button className="btn-stamp" onClick={() => setIsRecording(!isRecording)} style={{ background: isRecording ? 'var(--dashboard-stamp)' : 'var(--dashboard-cyan)', color: '#0A1628' }}>
                        <svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/></svg>
                        {isRecording ? t("stopRecording") : t("answer")}
                    </button>
                </div>
            </div>
        </div>
    );
}
