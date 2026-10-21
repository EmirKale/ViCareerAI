"use client";

import { useRouter } from "@/i18n/routing";
import React from "react";
import { useTranslations } from "next-intl";

export default function NewCVPage() {
    const router = useRouter();
    const t = useTranslations("Templates");

    const templates = [
        {
            id: "classic",
            name: t("classic.name") || "Klasik Kurumsal",
            description: t("classic.desc") || "Tek sütunlu, geleneksel ve temiz tasarım. ATS'den geçerken hiçbir sorun yaşatmaz.",
            isPro: false,
            thumbHtml: <div className="tmpl-thumb"><div className="theader"></div><div className="tline w80"></div><div className="tline w60"></div><div className="tline w40"></div><div className="tline w80"></div><div className="tline w60"></div></div>
        },
        {
            id: "modern",
            name: t("modern.name") || "Modern Profesyonel",
            description: t("modern.desc") || "İki sütunlu, renk detayına sahip dinamik görünüm. Özgeçmişini fark edilir kılar.",
            isPro: false,
            thumbHtml: <div className="tmpl-thumb split"><div className="tside"><div className="tline w80"></div><div className="tline w60"></div><div className="tline w40"></div></div><div className="tmain"><div className="theader"></div><div className="tline w80"></div><div className="tline w60"></div></div></div>
        },
        {
            id: "minimal",
            name: t("minimal.name") || "Minimalist",
            description: t("minimal.desc") || "Sadece içeriğe odaklanan, sade ve şık tasarım. Teknoloji rollerine çok uygun.",
            isPro: false,
            thumbHtml: <div className="tmpl-thumb"><div className="tline w40" style={{marginBottom:'16px'}}></div><div className="tline w80"></div><div className="tline w60"></div></div>
        },
        {
            id: "executive",
            name: t("executive.name") || "Yönetici (Executive)",
            description: t("executive.desc") || "Üst düzey yöneticiler için premium tasarım detayları barındırır.",
            isPro: true,
            thumbHtml: <div className="tmpl-thumb"><div className="theader" style={{width:'75%',height:'18px'}}></div><div className="tline w80"></div><div className="tline w60"></div><div className="tline w40"></div></div>
        },
        {
            id: "creative",
            name: t("creative.name") || "Yaratıcı (Creative)",
            description: t("creative.desc") || "Portfolyo odaklı, modern ve dinamik tasarım. Tasarımcılar için mükemmel.",
            isPro: true,
            thumbHtml: <div className="tmpl-thumb accent"><div className="theader"></div><div className="tline w60"></div><div className="tline w80"></div><div className="tline w40"></div></div>
        },
        {
            id: "tech",
            name: t("tech.name") || "Teknoloji (Tech)",
            description: t("tech.desc") || "Yazılımcılar için terminal estetiği. GitHub ve TechStack odaklı.",
            isPro: true,
            thumbHtml: <div className="tmpl-thumb dark"><div className="theader"></div><div className="tline w60"></div><div className="tline w80"></div><div className="tline w40"></div></div>
        }
    ];

    const handleSelectTemplate = (id: string, isPro: boolean) => {
        if (isPro) {
            router.push("/pricing");
            return;
        }
        router.push(`/cv/new/edit?template=${id}`);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .tmpl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
                .tmpl-card{
                    position:relative;background:#FFFFFF;border:1px solid #111111;border-radius:0px;
                    overflow:hidden;display:flex;flex-direction:column;box-shadow:2px 2px 0 #111111;
                    transition:transform .15s ease, box-shadow .15s ease;
                }
                .tmpl-card:hover{
                    transform:translateY(-2px);
                    box-shadow:4px 4px 0 #111111;
                }
                .tmpl-card.pro{border-color:#1849A9;}

                .pro-ribbon{
                    position:absolute;top:14px;right:-32px;z-index:3;background:#1849A9;color:#FFFFFF;
                    font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.08em;padding:4px 36px;
                    transform:rotate(40deg);border:1px solid #111111;
                }

                .tmpl-thumb{height:180px;background:#F4F1EA;padding:18px;position:relative;border-bottom:1px solid #111111;}
                .tmpl-thumb .tline{height:6px;background:#D3CDC2;border-radius:0px;margin-bottom:8px;}
                .tmpl-thumb .tline.w60{width:60%;}
                .tmpl-thumb .tline.w40{width:40%;}
                .tmpl-thumb .tline.w80{width:80%;}
                .tmpl-thumb .theader{height:12px;background:#111111;border-radius:0px;width:55%;margin-bottom:14px;}

                .tmpl-thumb.split{display:grid;grid-template-columns:32% 68%;gap:12px;padding:0;}
                .tmpl-thumb.split .tside{background:#EAE6DC;padding:16px 10px;border-right:1px solid #D3CDC2;}
                .tmpl-thumb.split .tside .tline{background:#B8B2A6;}
                .tmpl-thumb.split .tmain{padding:16px 14px 16px 0;}

                .tmpl-thumb.dark{background:#111111;}
                .tmpl-thumb.dark .tline{background:#4A4742;}
                .tmpl-thumb.dark .theader{background:#FFFFFF;}

                .tmpl-thumb.accent .theader{background:#1849A9;}
                .tmpl-thumb.accent .tline:first-child{background:#1849A9;opacity:0.35;}

                .tmpl-body{padding:20px;display:flex;flex-direction:column;flex:1;background:#FFFFFF;}
                .tmpl-name{
                    display:flex;align-items:center;gap:8px;font-family:'Archivo Narrow',sans-serif;
                    font-size:17px;font-weight:700;letter-spacing:-0.01em;color:#111111;margin-bottom:8px;
                }
                .tmpl-name svg{width:16px;height:16px;color:#1849A9;flex-shrink:0;}
                .tmpl-card.pro .tmpl-name svg{color:#1849A9;}
                .tmpl-desc{font-family:'Source Serif 4',Georgia,serif;font-size:13.5px;color:#4A4742;line-height:1.55;margin-bottom:20px;flex:1;}
                .tmpl-btn{
                    display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:42px;
                    font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;letter-spacing:.04em;border-radius:0px;
                    transition:all .15s ease;
                }
                .tmpl-btn.free{border:1px solid #111111;background:transparent;color:#111111;}
                .tmpl-btn.free:hover{background:#111111;color:#FFFFFF;cursor:pointer;}
                .tmpl-btn.pro{border:1px solid #111111;background:#1849A9;color:#FFFFFF;cursor:pointer;}
                .tmpl-btn.pro:hover{background:#123782;box-shadow:2px 2px 0 #111111;}

                @media(max-width:980px){.tmpl-grid{grid-template-columns:repeat(2,1fr);}}
                @media(max-width:640px){.tmpl-grid{grid-template-columns:1fr;}}
            `}} />

            <div className="page-head animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="peyebrow">{t("eyebrow") || "YENİ CV OLUŞTUR"}</div>
                <h1>{t("pageTitle") || "Kariyer hedefine uygun bir şablon seç"}</h1>
                <p>{t("pageDesc") || "ATS uyumlu bir şablon seçerek başla. Pro şablonlar gelişmiş düzen ve görsel detaylar barındırır."}</p>
            </div>

            <div className="tmpl-grid animate-in fade-in slide-in-from-bottom-6 duration-700">
                {templates.map(template => (
                    <div key={template.id} className={`tmpl-card ${template.isPro ? 'pro' : ''}`}>
                        {template.isPro && <div className="pro-ribbon">{t("proBadge") || "PRO ŞABLON"}</div>}
                        
                        {template.thumbHtml}
                        
                        <div className="tmpl-body">
                            <div className="tmpl-name">
                                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none"><rect x="3" y="3" width="8" height="8" rx="0"/><rect x="13" y="3" width="8" height="8" rx="0"/><rect x="3" y="13" width="8" height="8" rx="0"/><rect x="13" y="13" width="8" height="8" rx="0"/></svg>
                                {template.name}
                            </div>
                            <div className="tmpl-desc">{template.description}</div>
                            <button 
                                className={`tmpl-btn ${template.isPro ? 'pro' : 'free'}`}
                                onClick={() => handleSelectTemplate(template.id, template.isPro)}
                            >
                                {template.isPro ? (t("proBtn") || "Pro'ya Geçerek Kullan →") : (t("freeBtn") || "Bu Şablonu Seç →")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
