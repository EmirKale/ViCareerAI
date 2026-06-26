"use client";

import { useRouter } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
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
            // Show upgrade modal logic goes here eventually
            router.push("/pricing");
            return;
        }
        // Proceed to editor with selected template ID
        router.push(`/cv/new/edit?template=${id}`);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .tmpl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
                .tmpl-card{
                    position:relative;background:var(--dashboard-paper);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);
                    overflow:hidden;display:flex;flex-direction:column;
                }
                .tmpl-card svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:2;}
                .tmpl-card svg.corners path{stroke:var(--dashboard-cyan);stroke-width:1.3;fill:none;}
                .tmpl-card.pro{border-color:var(--dashboard-stamp-dim);}
                .tmpl-card.pro svg.corners path{stroke:var(--dashboard-stamp);}

                .pro-ribbon{
                    position:absolute;top:14px;right:-30px;z-index:3;background:var(--dashboard-stamp);color:var(--dashboard-bg);
                    font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.06em;padding:4px 36px;
                    transform:rotate(40deg);box-shadow:0 2px 6px rgba(0,0,0,.3);
                }

                .tmpl-thumb{height:190px;background:#eef3f6;padding:18px;position:relative;}
                .tmpl-thumb .tline{height:7px;background:#cfd9de;border-radius:2px;margin-bottom:7px;}
                .tmpl-thumb .tline.w60{width:60%;}
                .tmpl-thumb .tline.w40{width:40%;}
                .tmpl-thumb .tline.w80{width:80%;}
                .tmpl-thumb .theader{height:13px;background:#16243d;border-radius:2px;width:55%;margin-bottom:14px;}

                .tmpl-thumb.split{display:grid;grid-template-columns:32% 68%;gap:14px;padding:0;}
                .tmpl-thumb.split .tside{background:#16243d;padding:16px 12px;}
                .tmpl-thumb.split .tside .tline{background:rgba(255,255,255,.18);}
                .tmpl-thumb.split .tmain{padding:18px 16px 18px 0;}

                .tmpl-thumb.dark{background:#0c1322;}
                .tmpl-thumb.dark .tline{background:rgba(111,214,232,.25);}
                .tmpl-thumb.dark .theader{background:var(--dashboard-cyan);}

                .tmpl-thumb.accent .theader{background:var(--dashboard-purple, #A78BFA);}
                .tmpl-thumb.accent .tline:first-child{background:#c9b8f5;}

                .tmpl-body{padding:20px;display:flex;flex-direction:column;flex:1;}
                .tmpl-name{display:flex;align-items:center;gap:9px;font-size:15.5px;font-weight:600;margin-bottom:8px;}
                .tmpl-name svg{width:16px;height:16px;color:var(--dashboard-cyan);flex-shrink:0;}
                .tmpl-card.pro .tmpl-name svg{color:var(--dashboard-stamp);}
                .tmpl-desc{font-size:13px;color:var(--dashboard-text-dim);line-height:1.55;margin-bottom:18px;flex:1;}
                .tmpl-btn{
                    display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:44px;
                    font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.03em;border-radius:var(--dashboard-radius);
                }
                .tmpl-btn.free{border:1px solid var(--dashboard-paper-border);background:transparent;color:var(--dashboard-text);}
                .tmpl-btn.free:hover{border-color:var(--dashboard-cyan-dim);cursor:pointer;}
                .tmpl-btn.pro{border:1px solid var(--dashboard-stamp);background:var(--dashboard-stamp);color:var(--dashboard-bg);cursor:pointer;}
                .tmpl-btn.pro:hover{box-shadow:0 6px 18px rgba(232,84,60,.25);}

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
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        {template.isPro && <div className="pro-ribbon">{t("proBadge") || "PRO ŞABLON"}</div>}
                        
                        {template.thumbHtml}
                        
                        <div className="tmpl-body">
                            <div className="tmpl-name">
                                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
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

