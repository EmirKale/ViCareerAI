"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Clock, Pencil, Download, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { ClassicTemplate, CVData } from "@/components/cv/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/cv/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/cv/templates/MinimalTemplate";
import { ExecutiveTemplate } from "@/components/cv/templates/ExecutiveTemplate";
import { CreativeTemplate } from "@/components/cv/templates/CreativeTemplate";
import { ProfessionalTemplate } from "@/components/cv/templates/ProfessionalTemplate";

interface CVItem {
    id: string;
    title: string;
    template: string;
    updated_at: string;
    data?: CVData;
}

const templateLabel: Record<string, string> = {
    classic: "Klasik",
    modern: "Modern",
    minimal: "Minimal",
    executive: "Executive",
    creative: "Creative",
    professional: "Professional",
};

const templateBadgeClass: Record<string, string> = {
    classic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    modern: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    minimal: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    executive: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    creative: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    professional: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

function relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dakika önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
}

export default function CVHistoryClient({ initialCvs }: { initialCvs: CVItem[] }) {
    const t = useTranslations("History");
    const nav = useTranslations("Navigation");
    const [cvs, setCvs] = useState<CVItem[]>(initialCvs || []);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(t("confirmDelete") || "Bu CV'yi silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCvs(prev => prev.filter(c => c.id !== id));
                toast.success(t("deleteSuccess") || "CV silindi");
            } else {
                throw new Error();
            }
        } catch {
            toast.error(t("deleteError") || "Silme işlemi başarısız");
        }
    };

    const handleDownloadPDF = async (cv: CVItem) => {
        if (!cv.data) {
            toast.error(t("noDataError") || "CV verisi bulunamadı.");
            return;
        }
        setDownloadingId(cv.id);
        try {
            toast.info(t("preparingPdf") || "PDF hazırlanıyor...");
            const TemplateComponent = 
                cv.template === "modern" ? ModernTemplate : 
                cv.template === "minimal" ? MinimalTemplate : 
                cv.template === "executive" ? ExecutiveTemplate : 
                cv.template === "creative" ? CreativeTemplate : 
                cv.template === "professional" ? ProfessionalTemplate : 
                ClassicTemplate;
            const blob = await pdf(<TemplateComponent data={cv.data} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${cv.title}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(t("pdfDownloaded") || "PDF indirildi!");
        } catch {
            toast.error(t("pdfError") || "PDF oluşturulamadı.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .list-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:32px;}
                .page-head h1{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:clamp(26px,3vw,32px);text-transform:uppercase;color:#111111;margin-bottom:6px;letter-spacing:-0.01em;}
                .page-head p{font-size:14.5px;color:#4A4742;}
                .peyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;font-bold:700;letter-spacing:.12em;text-transform:uppercase;color:#757169;margin-bottom:6px;}
                .item-card{position:relative;background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;padding:22px;max-width:420px;width:100%;}
                .item-card svg.corners{display:none;}
                .item-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}
                .item-icon{width:38px;height:38px;border-radius:0px;border:1px solid #1849A9;background:rgba(24,73,169,.08);display:flex;align-items:center;justify-content:center;color:#1849A9;flex-shrink:0;}
                .item-actions{display:flex;gap:6px;}
                .item-actions button{width:30px;height:30px;border-radius:0px;border:1px solid #D3CDC2;background:#FFFFFF;color:#4A4742;display:flex;align-items:center;justify-content:center;cursor:pointer;}
                .item-actions button:hover{border-color:#111111;color:#111111;}
                .item-actions button.danger:hover{border-color:#A32020;color:#A32020;background:rgba(163,32,32,0.06);}
                .item-tag{font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:.05em;color:#1849A9;border:1px solid #1849A9;background:rgba(24,73,169,.06);padding:2px 7px;border-radius:0px;margin-left:8px;display:inline-block;vertical-align:middle;}
                .item-title{font-family:'Archivo Narrow',sans-serif;font-size:17px;font-weight:700;color:#111111;margin-bottom:6px;text-transform:uppercase;letter-spacing:-0.01em;}
                .item-date{display:flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#757169;}
                .item-edit-btn{
                    width:100%;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:8px;
                    font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;text-transform:uppercase;border:1.5px solid #111111;
                    padding:11px;border-radius:0px;background:#FFFFFF;color:#111111;text-decoration:none;transition:background .15s ease;
                }
                .item-edit-btn:hover{background:#EAE6DC;}
                .empty-hint{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#757169;margin-top:40px;text-align:center;}
            `}} />

            <div className="list-head">
                <div className="page-head" style={{ marginBottom: 0 }}>
                    <div className="peyebrow">{t("cvTitle").toUpperCase()}</div>
                    <h1>{t("cvTitle")}</h1>
                    <p>{t("cvDesc")}</p>
                </div>
                <Link className="btn-stamp" href="/cv/new">+ {t("newCv") || "YENİ CV OLUŞTUR"}</Link>
            </div>

            {cvs.length === 0 ? (
                <div className="empty-hint">{t("empty")}</div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {cvs.map((cv) => (
                            <div className="item-card" key={cv.id}>
                                <div className="item-top">
                                    <div className="item-icon">
                                        <svg className="icon" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                                    </div>
                                    <div className="item-actions">
                                        <button title={t("actions.download")} onClick={() => handleDownloadPDF(cv)} disabled={downloadingId === cv.id}>
                                            {downloadingId === cv.id ? <Loader2 className="w-[15px] h-[15px] animate-spin" /> : <svg className="icon" viewBox="0 0 24 24" style={{ width: '15px', height: '15px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>}
                                        </button>
                                        <button className="danger" title={t("actions.delete")} onClick={() => handleDelete(cv.id)}>
                                            <svg className="icon" viewBox="0 0 24 24" style={{ width: '15px', height: '15px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0l-1 14a2 2 0 01-2 2H9a2 2 0 01-2-2L6 6"/></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="item-title">
                                    {cv.title} <span className="item-tag">{(templateLabel[cv.template] || cv.template).toUpperCase()}</span>
                                </div>
                                <div className="item-date">
                                    <svg className="icon" viewBox="0 0 24 24" style={{ width: '13px', height: '13px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                                    {mounted ? relativeTime(cv.updated_at) : ""}
                                </div>
                                <Link className="item-edit-btn" href={`/cv/${cv.id}/edit`}>
                                    <svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z"/></svg>
                                    {t("actions.edit")}
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                    <div className="empty-hint" style={{ marginTop: '30px' }}>+ {t("moreHint") || "DAHA FAZLA CV OLUŞTURARAK BAŞVURU ŞANSINI ARTIR"}</div>
                </>
            )}
        </>
    );
}
