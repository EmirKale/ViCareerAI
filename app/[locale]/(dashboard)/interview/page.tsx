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
                    display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:12px;
                    font-weight:700;text-transform:uppercase;color:#A32020;border:1.5px solid #A32020;background:#FFF9F8;
                    border-radius:0px;padding:13px 16px;margin-bottom:28px;max-width:680px;width:100%;box-shadow:2px 2px 0px rgba(163,32,32,0.15);
                }
                .interview-wrap{max-width:680px;width:100%;}
                .iv-eyebrow{display:flex;align-items:center;justify-content:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;text-transform:uppercase;color:#757169;margin-bottom:18px;}
                .iv-eyebrow svg{width:16px;height:16px;color:#1849A9;}

                .avatar-box{
                    position:relative;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;overflow:hidden;
                    background:#FAF8F5;height:280px;display:flex;align-items:center;justify-content:center;margin-bottom:22px;
                }
                .avatar-glow{width:120px;height:120px;border-radius:0px;border:1.5px solid #1849A9;background:rgba(24,73,169,0.06);display:flex;align-items:center;justify-content:center;}
                .avatar-glow svg{width:60px;height:60px;color:#1849A9;}
                .avatar-mic{
                    position:absolute;bottom:16px;left:50%;transform:translateX(-50%);
                    width:34px;height:34px;border-radius:0px;background:#FFFFFF;border:1.5px solid #111111;
                    display:flex;align-items:center;justify-content:center;color:#1849A9;
                }

                .q-counter{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;color:#757169;text-align:center;margin-bottom:12px;text-transform:uppercase;}
                .q-text{font-size:22px;font-weight:700;text-align:center;line-height:1.4;margin-bottom:28px;font-family:'Archivo Narrow',sans-serif;text-transform:uppercase;color:#111111;}

                .analysis-card{position:relative;background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;padding:26px;margin-bottom:20px;}
                .analysis-card svg.corners{display:none;}
                .analysis-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:20px;}
                .analysis-title{display:flex;align-items:center;gap:9px;font-family:'Archivo Narrow',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;color:#111111;}
                .score-circle{width:64px;height:64px;border-radius:0px;border:2px solid #111111;background:#FAF8F5;display:flex;align-items:center;justify-content:center;font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:26px;color:#111111;flex-shrink:0;}
                .check-list{display:flex;flex-direction:column;gap:9px;}
                .check-item{display:flex;align-items:center;gap:9px;font-size:13.5px;color:#4A4742;}
                .check-item svg{width:15px;height:15px;flex-shrink:0;}
                .check-item.good svg{color:#15803D;}
                .check-item.warn svg{color:#B45309;}

                .metric-block{margin-bottom:18px;}
                .metric-block:last-of-type{margin-bottom:0;}
                .metric-top{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12.5px;}
                .metric-name{font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#757169;}
                .metric-pct{font-family:'JetBrains Mono',monospace;font-weight:700;}
                .metric-track{height:6px;background:#EAE6DC;border-radius:0px;overflow:hidden;}
                .metric-fill{height:100%;border-radius:0px;}

                .tone-row{display:flex;justify-content:space-between;align-items:center;margin-top:22px;padding-top:18px;border-top:1px solid #D3CDC2;}
                .tone-label{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#757169;}
                .tone-tag{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#1849A9;border:1px solid #1849A9;background:rgba(24,73,169,.06);padding:3px 10px;border-radius:0px;text-transform:uppercase;}

                .transcript-box{
                    width:100%;min-height:64px;background:#FAF8F5;border:1.5px solid #111111;
                    border-radius:0px;padding:14px 16px;font-size:13.5px;color:#4A4742;line-height:1.6;margin-bottom:18px;
                }
                .iv-actions{display:flex;gap:12px;}
                .iv-actions .btn-outline, .iv-actions .btn-stamp{flex:1;justify-content:center;}
                .btn-stamp{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;background:#1849A9;color:#FFFFFF;padding:11px 18px;border-radius:0px;border:1.5px solid #111111;cursor:pointer;}
                .btn-stamp:hover{background:#123782;}
                .btn-outline{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;background:#FFFFFF;color:#111111;padding:11px 18px;border-radius:0px;border:1.5px solid #111111;cursor:pointer;}
                .btn-outline:hover{background:#EAE6DC;}
                @media(max-width:600px){.analysis-top{flex-direction:column;}}
            `}} />

            <div className="preview-banner">
                <svg className="icon" viewBox="0 0 24 24" style={{ color: '#A32020', width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M12 9v4M12 17h.01M10.3 3.86L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.86a2 2 0 00-3.4 0z"/></svg>
                Bu özellik yakında aktif olacak. Şu an önizleme modunda.
            </div>

            <div className="interview-wrap w-full px-4">
                <div className="iv-eyebrow"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>✦ ViCareer AI</div>

                <div className="avatar-box">
                    <div className="avatar-glow">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M9.5 2a2.5 2.5 0 015 0v8a2.5 2.5 0 01-5 0z"/><path d="M12 6.5a3 3 0 013 3M9 9.5a3 3 0 013-3"/></svg>
                    </div>
                    <div className="avatar-mic"><svg className="icon" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg></div>
                </div>

                <div className="q-counter">{t("questionCount")}</div>
                <div className="q-text">{t("question")}</div>

                <div className="analysis-card">
                    <div className="analysis-top">
                        <div>
                            <div className="analysis-title"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none" style={{ width: '16px', height: '16px', color: '#1849A9' }}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>{t("liveAnalysis")}</div>
                            <div className="check-list" style={{ marginTop: '16px' }}>
                                <div className="check-item good"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 6L9 17l-5-5"/></svg>{t("strongStart")}</div>
                                <div className="check-item good"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 6L9 17l-5-5"/></svg>{t("clearArtic")}</div>
                                <div className="check-item warn"><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none"><path d="M12 9v4M12 17h.01M10.3 3.86L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.86a2 2 0 00-3.4 0z"/></svg>{t("pacingFast")}</div>
                            </div>
                        </div>
                        <div className="score-circle">85</div>
                    </div>

                    <div className="metric-block">
                        <div className="metric-top"><span className="metric-name">{t("techAccuracy")}</span><span className="metric-pct" style={{ color: '#15803D' }}>92%</span></div>
                        <div className="metric-track"><div className="metric-fill" style={{ width: '92%', background: '#15803D' }}></div></div>
                    </div>
                    <div className="metric-block">
                        <div className="metric-top"><span className="metric-name">{t("fluency")}</span><span className="metric-pct" style={{ color: '#1849A9' }}>88%</span></div>
                        <div className="metric-track"><div className="metric-fill" style={{ width: '88%', background: '#1849A9' }}></div></div>
                    </div>
                    <div className="metric-block">
                        <div className="metric-top"><span className="metric-name">{t("confidence")}</span><span className="metric-pct" style={{ color: '#B45309' }}>76%</span></div>
                        <div className="metric-track"><div className="metric-fill" style={{ width: '76%', background: '#B45309' }}></div></div>
                    </div>

                    <div className="tone-row"><span className="tone-label">{t("tone")}</span><span className="tone-tag">{t("toneValue")}</span></div>
                </div>

                <div className="transcript-box">{t("userSim")}</div>

                <div className="iv-actions">
                    <button className="btn-outline"><svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>{t("showResume")}</button>
                    <button className="btn-stamp" onClick={() => setIsRecording(!isRecording)} style={{ background: isRecording ? '#A32020' : '#1849A9', color: '#FFFFFF' }}>
                        <svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/></svg>
                        {isRecording ? t("stopRecording") : t("answer")}
                    </button>
                </div>
            </div>
        </div>
    );
}
