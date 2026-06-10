"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Sparkles, LayoutDashboard, Plus, Trash2, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pdf } from '@react-pdf/renderer';
import CVPreview from "@/components/cv/CVPreview";
import { ClassicTemplate, CVData } from "@/components/cv/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/cv/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/cv/templates/MinimalTemplate";
import AIEnhanceModal from "@/components/cv/AIEnhanceModal";

export default function CVEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>('classic');
    const [isSaving, setIsSaving] = useState(false);
    
    const [aiModalState, setAiModalState] = useState<{
        isOpen: boolean;
        initialText: string;
        sectionType: string;
        onApply: (text: string) => void;
    }>({
        isOpen: false,
        initialText: "",
        sectionType: "",
        onApply: () => {}
    });

    // Stub data object for the form
    const [cvData, setCvData] = useState<CVData>({
        personal: {
            fullName: "",
            jobTitle: "",
            email: "",
            phone: "",
            website: "",
            linkedin: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
    });

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvData({
            ...cvData,
            personal: { ...cvData.personal, [e.target.id]: e.target.value }
        });
    };

    // --- EXPERIENCE HANDLERS ---
    const handleAddExperience = () => {
        setCvData({
            ...cvData,
            experience: [
                ...cvData.experience,
                { id: Date.now().toString(), title: "", company: "", startDate: "", endDate: "", isCurrent: false, description: "" }
            ]
        });
    };

    const handleUpdateExperience = (id: string, field: string, value: string | boolean) => {
        setCvData({
            ...cvData,
            experience: cvData.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
        });
    };

    const handleDeleteExperience = (id: string) => {
        setCvData({
            ...cvData,
            experience: cvData.experience.filter(e => e.id !== id)
        });
    };

    // --- EDUCATION HANDLERS ---
    const handleAddEducation = () => {
        setCvData({
            ...cvData,
            education: [
                ...cvData.education,
                { id: Date.now().toString(), degree: "", school: "", startDate: "", endDate: "" }
            ]
        });
    };

    const handleUpdateEducation = (id: string, field: string, value: string) => {
        setCvData({
            ...cvData,
            education: cvData.education.map(e => e.id === id ? { ...e, [field]: value } : e)
        });
    };

    const handleDeleteEducation = (id: string) => {
        setCvData({
            ...cvData,
            education: cvData.education.filter(e => e.id !== id)
        });
    };

    // --- SKILL HANDLERS ---
    const handleAddSkill = () => {
        setCvData({
            ...cvData,
            skills: [
                ...cvData.skills,
                { id: Date.now().toString(), name: "" }
            ]
        });
    };

    const handleUpdateSkill = (id: string, value: string) => {
        setCvData({
            ...cvData,
            skills: cvData.skills.map(s => s.id === id ? { ...s, name: value } : s)
        });
    };

    const handleDeleteSkill = (id: string) => {
        setCvData({
            ...cvData,
            skills: cvData.skills.filter(s => s.id !== id)
        });
    };

    const handleLinkedInImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsImporting(true);
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append(file.name, file);
        });

        try {
            const res = await fetch("/api/cv/import-linkedin", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            
            if (res.ok) {
                setCvData(prev => ({
                    ...prev,
                    experience: result.experience?.length ? result.experience : prev.experience,
                    education: result.education?.length ? result.education : prev.education,
                    skills: result.skills?.length ? result.skills : prev.skills,
                }));
                toast.success("LinkedIn verileri başarıyla içe aktarıldı!");
            } else {
                toast.error(result.error || "İçe aktarma başarısız.");
            }
        } catch {
            toast.error("Bir ağ hatası oluştu.");
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/cv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id !== "new" ? id : undefined,
                    title: `${cvData.personal.fullName || "Yeni"} - CV`,
                    template: template,
                    data: cvData
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 503 || res.status === 401) {
                    toast.info("Giriş yapmadığınız için çalışmalarınız tarayıcıda geçici tutulmaktadır.");
                } else {
                    toast.error(result.error || "CV kaydedilemedi.");
                }
            } else {
                toast.success("CV başarıyla kaydedildi!");
                if (id === "new" && result.id) {
                    // router.replace(`/cv/${result.id}/edit`);
                }
            }
        } catch {
            toast.error("Kaydetme işlemi sırasında hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            toast.info("PDF hazırlanıyor, lütfen bekleyin...");
            const TemplateComponent = template === 'modern' ? ModernTemplate : template === 'minimal' ? MinimalTemplate : ClassicTemplate;
            const blob = await pdf(<TemplateComponent data={cvData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${cvData.personal.fullName || 'Is_Basvurusu'}_CV.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF başarıyla indirildi!");
        } catch {
            toast.error("PDF oluşturulurken hata oluştu.");
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">

            {/* Sidebar / Wizard Tabs */}
            <div className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col h-full shrink-0">
                <div className="p-4 border-b space-y-3">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground w-full justify-start -ml-2">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Şablonlara Dön
                    </Button>
                    <input type="file" multiple accept=".csv" ref={fileInputRef} className="hidden" onChange={handleLinkedInImport} />
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 dark:border-blue-900 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isImporting}
                    >
                        {isImporting ? <div className="h-3.5 w-3.5 animate-spin border-2 border-current border-t-transparent rounded-full mr-2" /> : <Download className="mr-2 h-3.5 w-3.5" />}
                        LinkedIn CSV Aktar
                    </Button>
                </div>
                <div className="p-4 border-b pb-2 pt-3">
                    <h2 className="font-semibold mb-1">CV Bölümleri</h2>
                    <p className="text-xs text-muted-foreground">İlerlemeyi sağda görebilirsiniz</p>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto p-2">
                    {['Kişisel Bilgiler', 'Profesyonel Özet', 'İş Deneyimi', 'Eğitim', 'Beceriler', 'Projeler', 'Sertifikalar'].map((tab, i) => {
                        const tabId = ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certificates'][i];
                        const isActive = activeTab === tabId;
                        return (
                            <button
                                key={tabId}
                                onClick={() => setActiveTab(tabId)}
                                className={`text-left px-4 py-3 rounded-lg text-sm font-medium my-0.5 transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        )
                    })}
                </div>

                <div className="p-4 border-t">
                    <Button
                        className="w-full gradient-brand text-white"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Kaydet
                    </Button>
                </div>
            </div>

            {/* Main Editor Form Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* Personal Info Tab */}
                    {activeTab === "personal" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h1 className="text-2xl font-bold">Kişisel Bilgiler</h1>
                                <p className="text-muted-foreground mt-1">İşverenlerin sizinle iletişim kurabilmesi için temel bilgilerinizi girin.</p>
                            </div>

                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Ad Soyad</Label>
                                            <Input id="fullName" value={cvData.personal.fullName} onChange={handlePersonalChange} placeholder="Örn: Ahmet Yılmaz" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="jobTitle">Hedef Pozisyon</Label>
                                            <Input id="jobTitle" value={cvData.personal.jobTitle} onChange={handlePersonalChange} placeholder="Örn: Frontend Developer" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-posta</Label>
                                            <Input id="email" type="email" value={cvData.personal.email} onChange={handlePersonalChange} placeholder="ahmet@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefon Numarası</Label>
                                            <Input id="phone" type="tel" value={cvData.personal.phone} onChange={handlePersonalChange} placeholder="+90 555 123 4567" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                                            <Input id="linkedin" value={cvData.personal.linkedin} onChange={handlePersonalChange} placeholder="linkedin.com/in/ahmetyilmaz" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Kişisel Web Sitesi</Label>
                                            <Input id="website" value={cvData.personal.website} onChange={handlePersonalChange} placeholder="ahmetyilmaz.dev" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Summary Tab */}
                    {activeTab === "summary" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Profesyonel Özet</h1>
                                    <p className="text-muted-foreground mt-1">Kariyer geçmişinizi ve hedeflerinizi özetleyen kısa bir yazı.</p>
                                </div>
                                <Button 
                                    onClick={() => setAiModalState({
                                        isOpen: true,
                                        initialText: cvData.summary,
                                        sectionType: "Profesyonel Özet",
                                        onApply: (text) => setCvData({ ...cvData, summary: text })
                                    })}
                                    variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-300">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    AI ile Yaz
                                </Button>
                            </div>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="summary">Özet Bölümü</Label>
                                        <Textarea
                                            id="summary"
                                            rows={8}
                                            className="resize-none"
                                            value={cvData.summary}
                                            onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                                            placeholder="Şu anki yazdıklarınız yapay zeka tarafından iyileştirilecektir..."
                                        />
                                        <p className="text-xs text-muted-foreground pt-1">İpucu: Sadece anahtar kelimeler ve biraz geçmiş yazmanız yeterlidir. AI gerisini toparlar.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === "experience" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">İş Deneyimi</h1>
                                    <p className="text-muted-foreground mt-1">Geriye dönük olarak tüm iş deneyimlerinizi ekleyin.</p>
                                </div>
                                <Button onClick={handleAddExperience} size="sm" className="gradient-brand text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Deneyim Ekle
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {cvData.experience.length === 0 ? (
                                    <div className="text-center py-10 border-2 border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <p className="text-muted-foreground">Henüz deneyim eklenmedi.</p>
                                    </div>
                                ) : (
                                    cvData.experience.map((exp) => (
                                        <Card key={exp.id} className="relative mt-2">
                                            <Button
                                                variant="ghost" size="icon"
                                                className="absolute right-2 top-2 text-red-500 opacity-60 hover:opacity-100"
                                                onClick={() => handleDeleteExperience(exp.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <CardContent className="p-6 space-y-4 pt-10">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Pozisyon</Label>
                                                        <Input value={exp.title} onChange={(e) => handleUpdateExperience(exp.id, 'title', e.target.value)} placeholder="Örn: Yazılım Geliştirici" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Şirket</Label>
                                                        <Input value={exp.company} onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)} placeholder="Örn: Google" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Başlangıç</Label>
                                                        <Input value={exp.startDate} onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)} placeholder="Örn: 2020" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Bitiş</Label>
                                                        <Input value={exp.endDate} onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)} placeholder="Örn: 2023 veya Devam Ediyor" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Açıklama / Sorumluluklar</Label>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                            onClick={() => setAiModalState({
                                                                isOpen: true,
                                                                initialText: exp.description,
                                                                sectionType: "İş Deneyimi",
                                                                onApply: (text) => handleUpdateExperience(exp.id, 'description', text)
                                                            })}
                                                        >
                                                            <Sparkles className="mr-1 h-3 w-3" /> AI ile İyileştir
                                                        </Button>
                                                    </div>
                                                    <Textarea rows={3} value={exp.description} onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)} placeholder="Neler yaptınız?" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Education Tab */}
                    {activeTab === "education" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Eğitim</h1>
                                    <p className="text-muted-foreground mt-1">Okuduğunuz okulları ve dereceleri girin.</p>
                                </div>
                                <Button onClick={handleAddEducation} size="sm" className="gradient-brand text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Eğitim Ekle
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {cvData.education.length === 0 ? (
                                    <div className="text-center py-10 border-2 border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <p className="text-muted-foreground">Henüz eğitim eklenmedi.</p>
                                    </div>
                                ) : (
                                    cvData.education.map((edu) => (
                                        <Card key={edu.id} className="relative mt-2">
                                            <Button
                                                variant="ghost" size="icon"
                                                className="absolute right-2 top-2 text-red-500 opacity-60 hover:opacity-100"
                                                onClick={() => handleDeleteEducation(edu.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <CardContent className="p-6 space-y-4 pt-10">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Derece / Bölüm</Label>
                                                        <Input value={edu.degree} onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)} placeholder="Örn: Bilgisayar Mühendisliği" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Okul</Label>
                                                        <Input value={edu.school} onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)} placeholder="Örn: ODTÜ" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Başlangıç</Label>
                                                        <Input value={edu.startDate} onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)} placeholder="Örn: 2016" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Bitiş</Label>
                                                        <Input value={edu.endDate} onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)} placeholder="Örn: 2020" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === "skills" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Beceriler</h1>
                                    <p className="text-muted-foreground mt-1">Öne çıkan yeteneklerinizi kelime bazlı ekleyin.</p>
                                </div>
                                <Button onClick={handleAddSkill} size="sm" className="gradient-brand text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Beceri Ekle
                                </Button>
                            </div>

                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    {cvData.skills.length === 0 && (
                                        <p className="text-sm text-muted-foreground">Beceri eklemek için yukarıdaki butona tıklayın.</p>
                                    )}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {cvData.skills.map(skill => (
                                            <div key={skill.id} className="flex flex-row items-center gap-2 group">
                                                <Input value={skill.name} onChange={(e) => handleUpdateSkill(skill.id, e.target.value)} placeholder="Örn: React" />
                                                <Button size="icon" variant="ghost" onClick={() => handleDeleteSkill(skill.id)} className="h-9 w-9 text-red-500 opacity-60 group-hover:opacity-100 shrink-0 border border-transparent group-hover:border-red-200">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Temp Placeholder for others */}
                    {["projects", "certificates"].includes(activeTab) && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground">Bu bölüm (Sürükle-Bırak) yakında eklenecek...</h3>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* PDF Real-time Preview Pane */}
            <div className="hidden lg:flex flex-col w-[500px] border-l bg-zinc-100/50 dark:bg-zinc-950 p-4">
                <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                        <Select value={template} onValueChange={(v: 'classic' | 'modern' | 'minimal') => setTemplate(v)}>
                            <SelectTrigger className="h-8 w-[110px] text-xs">
                                <SelectValue placeholder="Şablon" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" variant="outline" className="h-8 px-2 text-xs" onClick={handleDownloadPDF}>
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            PDF İndir
                        </Button>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> ATS: 85
                    </span>
                </div>

                {/* Render actual React PDF viewer */}
                <div className="flex-1 overflow-hidden rounded-lg shadow-sm">
                    <CVPreview data={cvData} template={template} />
                </div>
            </div>

            <AIEnhanceModal
                isOpen={aiModalState.isOpen}
                onClose={() => setAiModalState(prev => ({ ...prev, isOpen: false }))}
                initialText={aiModalState.initialText}
                sectionType={aiModalState.sectionType}
                targetPosition={cvData.personal.jobTitle}
                onApply={aiModalState.onApply}
            />
        </div>
    );
}
