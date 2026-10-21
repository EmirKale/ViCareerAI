"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Building2, Calendar, GripVertical, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useTranslations } from "next-intl";

type JobStatus = "Saved" | "Applied" | "Interviewing" | "Offer" | "Rejected";

interface JobApplication {
    id: string;
    company: string;
    position: string;
    location: string;
    status: JobStatus;
    appliedDate: string;
    matchScore: number;
}

const COLUMNS: JobStatus[] = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

const statusColors: Record<JobStatus, string> = {
    Saved: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
    Applied: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    Interviewing: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    Offer: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
    Rejected: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
};

export default function JobTrackerPage() {
    const t = useTranslations("Tracker");
    const [isMounted, setIsMounted] = useState(false);
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    
    // Modal states
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    
    // Loading states
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [manualForm, setManualForm] = useState({
        company: "",
        position: "",
        location: "",
        appliedDate: new Date().toISOString().split("T")[0],
        notes: "",
    });
    const [aiForm, setAiForm] = useState({
        urlOrText: "",
    });

    useEffect(() => {
        setIsMounted(true);
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/jobs/tracker");
            const data = await res.json();
            if (Array.isArray(data)) setJobs(data);
        } catch {
            // Error handling
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualForm.position || !manualForm.company) {
            toast.error(t("toastErrManual"));
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/jobs/tracker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "manual",
                    ...manualForm
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "İlan kaydedilemedi.");
            }

            toast.success(t("toastSuccessManual"));
            setIsManualModalOpen(false);
            setManualForm({
                company: "",
                position: "",
                location: "",
                appliedDate: new Date().toISOString().split("T")[0],
                notes: "",
            });
            fetchJobs();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiForm.urlOrText || aiForm.urlOrText.trim().length < 5) {
            toast.error(t("toastErrAi"));
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/jobs/tracker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "ai",
                    urlOrText: aiForm.urlOrText
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "AI analizi başarısız oldu.");
            }

            toast.success(t("toastSuccessAi"));
            setIsAiModalOpen(false);
            setAiForm({ urlOrText: "" });
            fetchJobs();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as JobStatus;
        
        // Optimistic UI Update
        const oldJobs = [...jobs];
        setJobs(prev => prev.map(job => 
            job.id === draggableId ? { ...job, status: newStatus } : job
        ));

        try {
            const res = await fetch("/api/jobs/tracker", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: draggableId, status: newStatus })
            });
            if (!res.ok) throw new Error("Update failed");
        } catch {
            setJobs(oldJobs); // Revert
        }
    };

    if (!isMounted) return null; // Prevent hydration mismatch with dnd

    const getJobsByStatus = (status: JobStatus) => jobs.filter(job => job.status === status);

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .kanban-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:32px;}
                .page-head h1{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:clamp(26px,3vw,32px);text-transform:uppercase;color:#111111;margin-bottom:6px;letter-spacing:-0.01em;}
                .page-head p{font-size:14.5px;color:#4A4742;}
                .peyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#757169;margin-bottom:6px;}
                .head-actions{display:flex;gap:12px;flex-wrap:wrap;}
                .btn-ai-solid{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:#1849A9;color:#FFFFFF;padding:11px 18px;border-radius:0px;border:1.5px solid #111111;cursor:pointer;}
                .btn-ai-solid:hover{background:#123782;}

                .kanban-board{display:flex;gap:16px;overflow-x:auto;padding-bottom:16px;}
                .kcol{flex:0 0 280px;background:#EAE6DC;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;padding:16px;min-height:440px;display:flex;flex-direction:column;}
                .kcol-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:10px;border-b:1px solid #D3CDC2;}
                .kcol-tag{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.05em;padding:4px 9px;border-radius:0px;border:1px solid #111111;background:#FFFFFF;}
                .kcol-count{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#757169;}
                .kcard{
                    position:relative;background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;
                    padding:14px;margin-bottom:12px;cursor:grab;transition:all .15s ease;
                }
                .kcard:hover{box-shadow:3px 3px 0px #111111;}
                .kcard .kgrip{position:absolute;top:12px;left:10px;color:#757169;}
                .kcard-title{font-family:'Archivo Narrow',sans-serif;font-size:15px;font-weight:700;text-transform:uppercase;color:#111111;margin-bottom:4px;padding-left:14px;}
                .kcard-co{display:flex;align-items:center;gap:6px;font-size:13px;color:#4A4742;margin-bottom:12px;padding-left:14px;}
                .kcard-foot{display:flex;justify-content:space-between;align-items:center;padding-left:14px;}
                .kcard-date{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#757169;display:flex;align-items:center;gap:5px;}
                .kcard-match{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:#1849A9;background:rgba(24,73,169,.08);border:1px solid #1849A9;padding:2px 6px;border-radius:0px;}

                .modal-overlay{position:fixed;inset:0;background:rgba(17,17,17,.55);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
                .modal{position:relative;background:#FFFFFF;border:2px solid #111111;box-shadow:4px 4px 0px #111111;border-radius:0px;padding:30px;max-width:460px;width:100%;color:#111111;}
                .modal svg.corners{display:none;}
                .modal-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
                .modal-head h3{font-family:'Archivo Narrow',sans-serif;font-size:19px;font-weight:700;text-transform:uppercase;color:#111111;display:flex;align-items:center;gap:9px;}
                .modal-head h3 svg{width:18px;height:18px;color:#1849A9;}
                .modal-close{width:28px;height:28px;border-radius:0px;border:1px solid #111111;background:transparent;color:#111111;display:flex;align-items:center;justify-content:center;cursor:pointer;}
                .modal p.sub{font-size:13.5px;color:#4A4742;margin-bottom:22px;line-height:1.55;}
                .field{margin-bottom:18px;}
                .field label{display:block;font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#757169;margin-bottom:8px;}
                .field input, .field textarea{width:100%;height:46px;padding:0 13px;background:#FFFFFF;border:1.5px solid #111111;border-radius:0px;color:#111111;font-size:14.5px;}
                .field textarea{height:auto;padding:11px 13px;resize:vertical;}
                .field input:focus, .field textarea:focus{outline:none;border-color:#1849A9;box-shadow:0 0 0 2px rgba(24,73,169,0.2);}
                .field input::placeholder, .field textarea::placeholder{color:#757169;}
                .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
                .modal-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:12px;}
                @media(max-width:760px){.field-row{grid-template-columns:1fr;}}
            `}} />

            <div className="kanban-head">
                <div className="page-head" style={{ marginBottom: 0 }}>
                    <div className="peyebrow">{t("titleTop")}</div>
                    <h1>{t("title")}</h1>
                    <p>{t("desc")}</p>
                </div>
                <div className="head-actions">
                    <button className="btn-ai-solid" onClick={() => setIsAiModalOpen(true)}>{t("addAi")}</button>
                    <button className="btn-stamp" onClick={() => setIsManualModalOpen(true)}>{t("addManual")}</button>
                </div>
            </div>

            <div className="kanban-board">
                <DragDropContext onDragEnd={onDragEnd}>
                    {COLUMNS.map(status => {
                        const columnJobs = getJobsByStatus(status);
                        
                        // Pick color scheme based on status
                        let tagBg = 'rgba(111,214,232,.1)', tagColor = 'var(--dashboard-cyan)';
                        if (status === 'Applied') { tagBg = 'rgba(167,139,250,.12)'; tagColor = 'var(--dashboard-purple)'; }
                        if (status === 'Interviewing') { tagBg = 'rgba(232,184,94,.12)'; tagColor = 'var(--dashboard-amber)'; }
                        if (status === 'Offer') { tagBg = 'rgba(111,232,168,.12)'; tagColor = 'var(--dashboard-green)'; }
                        if (status === 'Rejected') { tagBg = 'rgba(232,84,60,.12)'; tagColor = 'var(--dashboard-stamp)'; }

                        return (
                            <div key={status} className="kcol">
                                <div className="kcol-head">
                                    <span className="kcol-tag" style={{ background: tagBg, color: tagColor }}>
                                        {t(`columns.${status}`).toUpperCase()}
                                    </span>
                                    <span className="kcol-count">{columnJobs.length}</span>
                                </div>
                                <Droppable droppableId={status}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ flex: 1, minHeight: '150px' }}
                                        >
                                            {columnJobs.map((job, index) => (
                                                <Draggable key={job.id} draggableId={job.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className="kcard"
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                borderColor: snapshot.isDragging ? 'var(--dashboard-cyan)' : 'var(--dashboard-paper-border)',
                                                                zIndex: snapshot.isDragging ? 50 : 1,
                                                                boxShadow: snapshot.isDragging ? '0 10px 25px rgba(0,0,0,0.5)' : 'none',
                                                            }}
                                                        >
                                                            <div {...provided.dragHandleProps} style={{ position: 'absolute', top: 12, left: 10, cursor: 'grab', width: 13, height: 13, zIndex: 2 }}>
                                                                <svg className="icon kgrip" viewBox="0 0 24 24" style={{ top: 0, left: 0 }}><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>
                                                            </div>
                                                            <div className="kcard-title">{job.position}</div>
                                                            <div className="kcard-co"><svg className="icon" viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>{job.company}</div>
                                                            <div className="kcard-foot">
                                                                <span className="kcard-date"><svg className="icon" viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>{job.appliedDate}</span>
                                                                <span className="kcard-match">✦ {job.matchScore}%</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </DragDropContext>
            </div>

            {/* MANUAL ADD MODAL */}
            {isManualModalOpen && (
                <div className="modal-overlay">
                    <div className="modal animate-in zoom-in-95 duration-200">
                        <div className="modal-head">
                            <h3><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M12 5v14M5 12h14"/></svg>{t("modalManualTitle")}</h3>
                            <button type="button" className="modal-close" onClick={() => setIsManualModalOpen(false)}>
                                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ width: '16px', height: '16px' }}><path d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <p className="sub">{t("modalManualDesc")}</p>
                        <form onSubmit={handleManualSubmit}>
                            <div className="field-row">
                                <div className="field">
                                    <label>{t("companyLabel")}</label>
                                    <input type="text" placeholder={t("companyPh")} value={manualForm.company} onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })} required />
                                </div>
                                <div className="field">
                                    <label>{t("positionLabel")}</label>
                                    <input type="text" placeholder={t("positionPh")} value={manualForm.position} onChange={(e) => setManualForm({ ...manualForm, position: e.target.value })} required />
                                </div>
                            </div>
                            <div className="field-row">
                                <div className="field">
                                    <label>{t("locationLabel")}</label>
                                    <input type="text" placeholder={t("locationPh")} value={manualForm.location} onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>{t("dateLabel")}</label>
                                    <input type="date" value={manualForm.appliedDate} onChange={(e) => setManualForm({ ...manualForm, appliedDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="field">
                                <label>{t("notesLabel")}</label>
                                <textarea rows={3} placeholder={t("notesPh")} value={manualForm.notes} onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-outline" onClick={() => setIsManualModalOpen(false)}>{t("cancel")}</button>
                                <button type="submit" className="btn-stamp" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="w-[14px] h-[14px] animate-spin" /> {t("saving")}</> : t("saveBtn")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* AI ADD MODAL */}
            {isAiModalOpen && (
                <div className="modal-overlay">
                    <div className="modal ai animate-in zoom-in-95 duration-200">
                        <div className="modal-head">
                            <h3><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/></svg>{t("modalAiTitle")}</h3>
                            <button type="button" className="modal-close" onClick={() => setIsAiModalOpen(false)}>
                                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ width: '16px', height: '16px' }}><path d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <p className="sub">{t("modalAiDesc")}</p>
                        <form onSubmit={handleAiSubmit}>
                            <div className="field">
                                <label>{t("urlLabel")}</label>
                                <textarea rows={4} placeholder={t("urlPh")} value={aiForm.urlOrText} onChange={(e) => setAiForm({ ...aiForm, urlOrText: e.target.value })} required></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-outline" onClick={() => setIsAiModalOpen(false)}>{t("cancel")}</button>
                                <button type="submit" className="btn-ai-solid" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="w-[14px] h-[14px] animate-spin" /> {t("analyzing")}</> : t("analyzeBtn")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
