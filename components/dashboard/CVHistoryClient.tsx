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
                .item-card{position:relative;background:var(--dashboard-paper);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);padding:22px;max-width:420px;width:100%;}
                .item-card svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
                .item-card svg.corners path{stroke:var(--dashboard-cyan);stroke-width:1.3;fill:none;}
                .item-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}
                .item-icon{width:38px;height:38px;border-radius:var(--dashboard-radius);background:rgba(111,214,232,.08);display:flex;align-items:center;justify-content:center;color:var(--dashboard-cyan);flex-shrink:0;}
                .item-actions{display:flex;gap:6px;}
                .item-actions button{width:30px;height:30px;border-radius:var(--dashboard-radius);border:1px solid var(--dashboard-paper-border);background:transparent;color:var(--dashboard-text-dim);display:flex;align-items:center;justify-content:center;}
                .item-actions button:hover{border-color:var(--dashboard-cyan-dim);color:var(--dashboard-cyan);}
                .item-actions button.danger:hover{border-color:var(--dashboard-stamp);color:var(--dashboard-stamp);}
                .item-tag{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.05em;color:var(--dashboard-cyan);border:1px solid var(--dashboard-cyan-dim);padding:2px 7px;border-radius:var(--dashboard-radius);margin-left:10px;display:inline-block;vertical-align:middle;}
                .item-title{font-size:15.5px;font-weight:500;margin-bottom:8px;}
                .item-date{display:flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--dashboard-mono-label);}
                .item-edit-btn{
                    width:100%;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:8px;
                    font-family:'JetBrains Mono',monospace;font-size:12px;border:1px solid var(--dashboard-paper-border);
                    padding:11px;border-radius:var(--dashboard-radius);color:var(--dashboard-text);
                }
                .item-edit-btn:hover{border-color:var(--dashboard-cyan-dim);}
                .empty-hint{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--dashboard-mono-label);margin-top:40px;text-align:center;}
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
                                <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                                <div className="item-top">
                                    <div className="item-icon">
                                        <svg className="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                                    </div>
                                    <div className="item-actions">
                                        <button title={t("actions.download")} onClick={() => handleDownloadPDF(cv)} disabled={downloadingId === cv.id}>
                                            {downloadingId === cv.id ? <Loader2 className="w-[15px] h-[15px] animate-spin" /> : <svg className="icon" viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }}><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>}
                                        </button>
                                        <button className="danger" title={t("actions.delete")} onClick={() => handleDelete(cv.id)}>
                                            <svg className="icon" viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }}><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0l-1 14a2 2 0 01-2 2H9a2 2 0 01-2-2L6 6"/></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="item-title">
                                    {cv.title} <span className="item-tag">{(templateLabel[cv.template] || cv.template).toUpperCase()}</span>
                                </div>
                                <div className="item-date">
                                    <svg className="icon" viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                                    {mounted ? relativeTime(cv.updated_at) : ""}
                                </div>
                                <Link className="item-edit-btn" href={`/cv/${cv.id}/edit`}>
                                    <svg className="icon" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z"/></svg>
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
