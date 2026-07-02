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
                .head-actions{display:flex;gap:12px;flex-wrap:wrap;}
                .btn-ai-solid{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12.5px;background:var(--dashboard-purple);color:#0A1628;padding:11px 18px;border-radius:var(--dashboard-radius);border:none;}

                .kanban-board{display:flex;gap:16px;overflow-x:auto;padding-bottom:16px;}
                .kcol{flex:0 0 280px;background:var(--dashboard-paper);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);padding:16px;min-height:420px;display:flex;flex-direction:column;}
                .kcol-head{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
                .kcol-tag{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.05em;padding:4px 9px;border-radius:var(--dashboard-radius);}
                .kcol-count{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--dashboard-mono-label);}
                .kcard{
                    position:relative;background:var(--dashboard-bg-2);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);
                    padding:14px;margin-bottom:10px;
                }
                .kcard .kgrip{position:absolute;top:12px;left:10px;color:var(--dashboard-mono-label);}
                .kcard-title{font-size:14px;font-weight:500;margin-bottom:6px;padding-left:14px;}
                .kcard-co{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--dashboard-text-dim);margin-bottom:12px;padding-left:14px;}
                .kcard-foot{display:flex;justify-content:space-between;align-items:center;padding-left:14px;}
                .kcard-date{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--dashboard-mono-label);display:flex;align-items:center;gap:5px;}
                .kcard-match{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--dashboard-green);background:rgba(111,232,168,.1);padding:3px 7px;border-radius:var(--dashboard-radius);}

                .modal-overlay{position:fixed;inset:0;background:rgba(6,12,22,.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
                .modal{position:relative;background:var(--dashboard-bg-2);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);padding:30px;max-width:440px;width:100%;}
                .modal svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
                .modal svg.corners path{stroke:var(--dashboard-cyan);stroke-width:1.3;fill:none;}
                .modal.ai svg.corners path{stroke:var(--dashboard-purple);}
                .modal-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
                .modal-head h3{font-size:17px;display:flex;align-items:center;gap:9px;}
                .modal-head h3 svg{width:18px;height:18px;color:var(--dashboard-cyan);}
                .modal.ai .modal-head h3 svg{color:var(--dashboard-purple);}
                .modal-close{width:28px;height:28px;border-radius:50%;border:1px solid var(--dashboard-paper-border);background:transparent;color:var(--dashboard-text-dim);display:flex;align-items:center;justify-content:center;}
                .modal p.sub{font-size:13px;color:var(--dashboard-text-dim);margin-bottom:22px;line-height:1.55;}
                .field{margin-bottom:18px;}
                .field label{display:block;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--dashboard-mono-label);margin-bottom:9px;}
                .field input, .field textarea{width:100%;height:46px;padding:0 13px;background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);color:var(--dashboard-text);font-size:14.5px;}
                .field textarea{height:auto;padding:11px 13px;resize:vertical;}
                .field input:focus, .field textarea:focus{outline:none;border-color:var(--dashboard-cyan);}
                .field input::placeholder, .field textarea::placeholder{color:rgba(234,243,247,0.25);}
                .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
                .modal-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:8px;}
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
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
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
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
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
