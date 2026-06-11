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
            toast.error("Şirket adı ve Pozisyon alanları zorunludur.");
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

            toast.success("İş ilanı başarıyla kaydedildi!");
            setIsManualModalOpen(false);
            setManualForm({
                company: "",
                position: "",
                location: "",
                appliedDate: new Date().toISOString().split("T")[0],
                notes: "",
            });
            fetchJobs();
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiForm.urlOrText || aiForm.urlOrText.trim().length < 5) {
            toast.error("Lütfen geçerli bir iş ilanı metni veya URL girin.");
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

            toast.success("İlan AI tarafından başarıyla analiz edildi ve kaydedildi!");
            setIsAiModalOpen(false);
            setAiForm({ urlOrText: "" });
            fetchJobs();
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto p-4 md:p-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("desc")}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={() => setIsAiModalOpen(true)}
                        variant="outline" 
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900 dark:text-purple-400"
                    >
                        <Sparkles className="mr-2 h-4 w-4" /> {t("aiAdd")}
                    </Button>
                    <Button 
                        onClick={() => setIsManualModalOpen(true)}
                        className="gradient-brand text-white shadow-md shadow-blue-500/20"
                    >
                        <Plus className="mr-2 h-4 w-4" /> {t("manualAdd")}
                    </Button>
                </div>
            </div>

            {/* AI Add Modal */}
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            AI ile İlan Ekle
                        </DialogTitle>
                        <DialogDescription>
                            İş ilanının URL bağlantısını veya ilan detay metnini yapıştırın. Yapay zeka şirket, pozisyon ve konum bilgilerini otomatik çıkarıp panonuza ekleyecektir.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAiSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="urlOrText">İlan URL veya Detay Metni</Label>
                            <Textarea
                                id="urlOrText"
                                value={aiForm.urlOrText}
                                onChange={(e) => setAiForm({ ...aiForm, urlOrText: e.target.value })}
                                placeholder="Örn: linkedin.com/jobs/view/... veya ilan açıklaması..."
                                rows={6}
                                required
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAiModalOpen(false)}>İptal</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                AI ile Analiz Et & Ekle
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Manual Add Modal */}
            <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-blue-600" />
                            Manuel İlan Ekle
                        </DialogTitle>
                        <DialogDescription>
                            Başvurmak istediğiniz veya takip ettiğiniz iş ilanının detaylarını girin.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleManualSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Şirket Adı *</Label>
                                <Input
                                    id="company"
                                    value={manualForm.company}
                                    onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
                                    placeholder="Örn: Google"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Pozisyon / Rol *</Label>
                                <Input
                                    id="position"
                                    value={manualForm.position}
                                    onChange={(e) => setManualForm({ ...manualForm, position: e.target.value })}
                                    placeholder="Örn: Frontend Developer"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasyon</Label>
                                <Input
                                    id="location"
                                    value={manualForm.location}
                                    onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                                    placeholder="Örn: İstanbul / Uzaktan"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appliedDate">Uygulama Tarihi</Label>
                                <Input
                                    id="appliedDate"
                                    type="date"
                                    value={manualForm.appliedDate}
                                    onChange={(e) => setManualForm({ ...manualForm, appliedDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notlar</Label>
                            <Textarea
                                id="notes"
                                value={manualForm.notes}
                                onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                                placeholder="İlan detayları, mülakat notları veya önemli detaylar..."
                                rows={3}
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsManualModalOpen(false)}>İptal</Button>
                            <Button type="submit" disabled={isSubmitting} className="gradient-brand text-white border-0">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                İlanı Kaydet
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex-1 overflow-x-auto pb-4 mt-6">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-h-[60rem] lg:min-h-[auto] items-start">
                        {COLUMNS.map(status => {
                            const columnJobs = getJobsByStatus(status);
                            return (
                                <div key={status} className="flex-shrink-0 w-80 flex flex-col bg-zinc-100/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 h-full min-h-[500px]">
                                    <div className="p-4 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`${statusColors[status]}`}>
                                                {t(`columns.${status}`)}
                                            </Badge>
                                            <span className="text-xs font-semibold text-muted-foreground bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                                {columnJobs.length}
                                            </span>
                                        </div>
                                    </div>

                                    <Droppable droppableId={status}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors rounded-b-xl ${snapshot.isDraggingOver ? "bg-zinc-200/50 dark:bg-zinc-800/50" : ""}`}
                                            >
                                                {columnJobs.map((job, index) => (
                                                    <Draggable key={job.id} draggableId={job.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={{...provided.draggableProps.style}}
                                                                className={`mb-3 shadow-sm border-zinc-200 dark:border-zinc-800 transition-all ${snapshot.isDragging ? "shadow-xl rotate-2 scale-105 z-50 cursor-grabbing border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20" : "cursor-grab hover:border-blue-300 dark:hover:border-blue-700"}`}
                                                            >
                                                                <CardContent className="p-4">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div className="font-semibold text-sm leading-tight text-zinc-900 dark:text-zinc-100 flex items-start" {...provided.dragHandleProps}>
                                                                            <GripVertical className="inline-block h-4 w-4 text-zinc-400 mr-1.5 -ml-1 mt-0.5 cursor-grab hover:text-zinc-600" />
                                                                            {job.position}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-xs font-medium text-muted-foreground flex items-center mb-4 pl-5">
                                                                        <Building2 className="h-3 w-3 mr-1.5" /> {job.company}
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                                                                        <div className="text-[10px] text-muted-foreground flex items-center bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                                                                            <Calendar className="h-3 w-3 mr-1" /> {job.appliedDate}
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md border border-green-100 dark:border-green-900/50">
                                                                            <Sparkles className="h-3 w-3 text-green-600 dark:text-green-500" />
                                                                            <span className="text-[10px] font-bold text-green-700 dark:text-green-400">{job.matchScore}%</span>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
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
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
