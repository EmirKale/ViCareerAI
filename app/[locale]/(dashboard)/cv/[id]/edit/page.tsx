"use client";
import React, { useState, useRef, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Sparkles, Plus, Trash2, Download, List, Edit3, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pdf } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';
const CVPreview = dynamic(() => import("@/components/cv/CVPreview"), { ssr: false });
import { ClassicTemplate, CVData } from "@/components/cv/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/cv/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/cv/templates/MinimalTemplate";
import { ExecutiveTemplate } from "@/components/cv/templates/ExecutiveTemplate";
import { CreativeTemplate } from "@/components/cv/templates/CreativeTemplate";
import { ProfessionalTemplate } from "@/components/cv/templates/ProfessionalTemplate";
import AIEnhanceModal from "@/components/cv/AIEnhanceModal";

const ENHANCED_TECH_LIST = [
    { name: "JavaScript", aliases: ["js", "es6", "vanilla js"] },
    { name: "TypeScript", aliases: ["ts"] },
    { name: "React", aliases: ["reactjs", "react.js"] },
    { name: "Next.js", aliases: ["next", "nextjs"] },
    { name: "Vue.js", aliases: ["vue", "vuejs"] },
    { name: "Nuxt.js", aliases: ["nuxt", "nuxtjs"] },
    { name: "Angular", aliases: ["angularjs"] },
    { name: "Svelte", aliases: ["sveltejs"] },
    { name: "HTML", aliases: ["html5"] },
    { name: "CSS", aliases: ["css3"] },
    { name: "Tailwind CSS", aliases: ["tailwind", "tw", "tailwindcss"] },
    { name: "Bootstrap", aliases: ["bs"] },
    { name: "Material UI", aliases: ["mui", "material"] },
    { name: "Chakra UI", aliases: ["chakra"] },
    { name: "Node.js", aliases: ["node", "nodejs"] },
    { name: "Express.js", aliases: ["express", "expressjs"] },
    { name: "NestJS", aliases: ["nest"] },
    { name: "Python", aliases: ["py"] },
    { name: "Django", aliases: ["dj"] },
    { name: "Flask", aliases: [] },
    { name: "FastAPI", aliases: [] },
    { name: "Java", aliases: ["java 8", "java 11", "java 17"] },
    { name: "Spring Boot", aliases: ["spring"] },
    { name: "C#", aliases: ["csharp", "c sharp"] },
    { name: "ASP.NET Core", aliases: ["aspnet core", ".net core"] },
    { name: "ASP.NET MVC", aliases: ["aspnet mvc", ".net mvc"] },
    { name: "Entity Framework", aliases: ["ef", "ef core", "entity framework core"] },
    { name: "PHP", aliases: [] },
    { name: "Laravel", aliases: [] },
    { name: "Go", aliases: ["golang"] },
    { name: "Rust", aliases: ["rs"] },
    { name: "Ruby on Rails", aliases: ["ror", "rails", "ruby"] },
    { name: "C++", aliases: ["cpp"] },
    { name: "C", aliases: [] },
    { name: "Swift", aliases: [] },
    { name: "Kotlin", aliases: [] },
    { name: "Dart", aliases: [] },
    { name: "Flutter", aliases: [] },
    { name: "React Native", aliases: ["rn"] },
    { name: "SQL", aliases: [] },
    { name: "MySQL", aliases: [] },
    { name: "PostgreSQL", aliases: ["postgres", "psql"] },
    { name: "SQL Server", aliases: ["mssql", "microsoft sql server"] },
    { name: "Oracle", aliases: [] },
    { name: "MongoDB", aliases: ["mongo", "mongodb"] },
    { name: "Redis", aliases: [] },
    { name: "Elasticsearch", aliases: ["es", "elastic"] },
    { name: "Docker", aliases: [] },
    { name: "Kubernetes", aliases: ["k8s"] },
    { name: "AWS", aliases: ["amazon web services"] },
    { name: "Azure", aliases: ["microsoft azure"] },
    { name: "Google Cloud", aliases: ["gcp", "google cloud platform"] },
    { name: "Vercel", aliases: [] },
    { name: "Heroku", aliases: [] },
    { name: "DigitalOcean", aliases: ["do"] },
    { name: "Git", aliases: [] },
    { name: "GitHub", aliases: [] },
    { name: "GitLab", aliases: [] },
    { name: "Bitbucket", aliases: [] },
    { name: "CI/CD", aliases: ["continuous integration", "continuous deployment"] },
    { name: "Jenkins", aliases: [] },
    { name: "GitHub Actions", aliases: ["actions"] },
    { name: "Linux", aliases: ["ubuntu", "debian", "centos"] },
    { name: "Bash", aliases: ["shell", "sh"] },
    { name: "PowerShell", aliases: ["ps"] },
    { name: "GraphQL", aliases: ["gql"] },
    { name: "REST API", aliases: ["restful", "rest"] },
    { name: "Firebase", aliases: [] },
    { name: "Supabase", aliases: [] },
    { name: "Prisma", aliases: [] },
    { name: "Figma", aliases: [] },
    { name: "Adobe XD", aliases: ["xd"] },
    { name: "Photoshop", aliases: ["ps"] },
    { name: "Illustrator", aliases: ["ai"] },
    { name: "Jira", aliases: [] },
    { name: "Trello", aliases: [] },
    { name: "Scrum", aliases: ["agile"] },
    { name: "Kanban", aliases: [] }
];

function ProjectTechInput({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedTechs = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];
    const filteredTechs = ENHANCED_TECH_LIST.filter(t => {
        const query = inputValue.toLowerCase();
        if (selectedTechs.includes(t.name)) return false;
        return t.name.toLowerCase().includes(query) || t.aliases.some(a => a.includes(query));
    }).map(t => t.name);
    
    const handleAdd = (tech: string) => {
        const newTechs = [...selectedTechs, tech];
        onChange(newTechs.join(', '));
        setInputValue("");
        setIsOpen(false);
    };
    
    const handleRemove = (tech: string) => {
        const newTechs = selectedTechs.filter(t => t !== tech);
        onChange(newTechs.join(', '));
    };
    
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTechs.map(tech => (
                    <div key={tech} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1 dark:bg-blue-900/30 dark:text-blue-300">
                        {tech}
                        <button onClick={(e) => { e.preventDefault(); handleRemove(tech); }} className="hover:text-red-500 font-bold">&times;</button>
                    </div>
                ))}
            </div>
            <div className="relative">
                <Input 
                    value={inputValue} 
                    onChange={e => { setInputValue(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    placeholder="Teknoloji ara ve seç (Örn: React, Node, EF...)"
                    onKeyDown={(e) => { 
                        if (e.key === 'Enter' && inputValue) { 
                            e.preventDefault(); 
                            if (filteredTechs.length > 0) {
                                handleAdd(filteredTechs[0]);
                            } else {
                                handleAdd(inputValue);
                            }
                        } 
                    }}
                />
                {isOpen && inputValue && filteredTechs.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto dark:bg-zinc-900 dark:border-zinc-800">
                        {filteredTechs.map(tech => (
                            <div key={tech} onMouseDown={(e) => { e.preventDefault(); handleAdd(tech); }} className="px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm">
                                {tech}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SkillsTechInput({ skills, onChange }: { skills: Array<{id: string, name: string}>, onChange: (skills: Array<{id: string, name: string}>) => void }) {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedNames = skills.map(s => s.name);
    
    const filteredTechs = ENHANCED_TECH_LIST.filter(t => {
        const query = inputValue.toLowerCase();
        if (selectedNames.includes(t.name)) return false;
        return t.name.toLowerCase().includes(query) || t.aliases.some(a => a.includes(query));
    }).map(t => t.name);
    
    const handleAdd = (tech: string) => {
        const newSkills = [...skills, { id: crypto.randomUUID(), name: tech }];
        onChange(newSkills);
        setInputValue("");
        setIsOpen(false);
    };
    
    const handleRemove = (id: string) => {
        const newSkills = skills.filter(s => s.id !== id);
        onChange(newSkills);
    };
    
    return (
        <div className="space-y-4">
            <div className="relative">
                <Input 
                    value={inputValue} 
                    onChange={e => { setInputValue(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    placeholder="Beceri ara ve seç (Örn: React, EF, TS, Node...)"
                    onKeyDown={(e) => { 
                        if (e.key === 'Enter' && inputValue) { 
                            e.preventDefault(); 
                            if (filteredTechs.length > 0) {
                                handleAdd(filteredTechs[0]);
                            } else {
                                handleAdd(inputValue);
                            }
                        } 
                    }}
                />
                {isOpen && inputValue && filteredTechs.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto dark:bg-zinc-900 dark:border-zinc-800">
                        {filteredTechs.map(tech => (
                            <div key={tech} onMouseDown={(e) => { e.preventDefault(); handleAdd(tech); }} className="px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm">
                                {tech}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <div key={skill.id} className="bg-blue-50 border border-blue-200 text-blue-800 text-sm px-3 py-1.5 rounded-full flex items-center gap-2 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                        {skill.name}
                        <button onClick={(e) => { e.preventDefault(); handleRemove(skill.id); }} className="hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full w-5 h-5 flex items-center justify-center transition-colors">&times;</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CVEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();

    const getStoredData = (key: string) => {
        if (typeof window === 'undefined') return null;
        try { return localStorage.getItem(key); } catch { return null; }
    };
    const setStoredData = (key: string, value: string) => {
        if (typeof window !== 'undefined') {
            try { localStorage.setItem(key, value); } catch {}
        }
    };
    const removeStoredData = (key: string) => {
        if (typeof window !== 'undefined') {
            try { localStorage.removeItem(key); } catch {}
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const projFileRef = useRef<HTMLInputElement>(null);
    const certFileRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isParsing, setIsParsing] = useState<{type: string, active: boolean}>({type: "", active: false});
    const [activeTab, setActiveTab] = useState("personal");
    const [mobileTab, setMobileTab] = useState<"sections" | "edit" | "preview">("sections");
    const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional'>('classic');
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
        certificates: [],
    });
    
    const [isLoadingData, setIsLoadingData] = useState(id !== "new");

    useEffect(() => {
        if (id === "new") {
            // Yeni CV sayfasında localStorage'dan eski veriyi yükleme,
            // tamamen sıfırdan başlasın.
            removeStoredData(`cvData_${id}`);
            return;
        }

        const fetchCV = async () => {
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
                const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
                const supabase = createBrowserClient(supabaseUrl, supabaseKey);
                
                const { data, error } = await supabase
                    .from('cvs')
                    .select('*')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                if (data && data.data) {
                    const localData = getStoredData(`cvData_${id}`);
                    const localTemplate = getStoredData(`selectedTemplate_${id}`);
                    
                    if (localData) {
                        try {
                            setCvData(JSON.parse(localData));
                        } catch {
                            // JSON parse error, fallback to db
                            setCvData(prev => ({
                                personal: data.data.personal || prev.personal,
                                summary: data.data.summary || "",
                                experience: data.data.experience || [],
                                education: data.data.education || [],
                                skills: data.data.skills || [],
                                projects: data.data.projects || [],
                                certificates: data.data.certificates || [],
                            }));
                        }
                    } else {
                        setCvData(prev => ({
                            personal: data.data.personal || prev.personal,
                            summary: data.data.summary || "",
                            experience: data.data.experience || [],
                            education: data.data.education || [],
                            skills: data.data.skills || [],
                            projects: data.data.projects || [],
                            certificates: data.data.certificates || [],
                        }));
                    }

                    if (localTemplate) {
                        setTemplate(localTemplate as 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional');
                    } else if (data.template) {
                        setTemplate(data.template as 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional');
                    }
                }
            } catch (err) {
                console.error("Error fetching CV:", err);
                toast.error("CV verisi yüklenirken bir hata oluştu.");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchCV();
    }, [id]);

    useEffect(() => {
        if (!isLoadingData) {
            setStoredData(`cvData_${id}`, JSON.stringify(cvData));
            setStoredData(`selectedTemplate_${id}`, template);
        }
    }, [cvData, template, id, isLoadingData]);

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvData({
            ...cvData,
            personal: { ...cvData.personal, [e.target.id]: e.target.value }
        });
    };

    // --- EXPERIENCE HANDLERS ---
    const handleAddExperience = () => {
        setCvData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: crypto.randomUUID(), title: "", company: "", startDate: "", endDate: "", isCurrent: false, description: "" }
            ]
        }));
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
        setCvData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { id: crypto.randomUUID(), degree: "", school: "", startDate: "", endDate: "" }
            ]
        }));
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

    // --- PROJECT HANDLERS ---
    const handleAddProject = () => {
        setCvData(prev => ({
            ...prev,
            projects: [
                ...(prev.projects || []),
                { id: crypto.randomUUID(), name: "", description: "", url: "", technologies: "" }
            ]
        }));
    };

    const handleUpdateProject = (id: string, field: string, value: string) => {
        setCvData({
            ...cvData,
            projects: (cvData.projects || []).map(p => p.id === id ? { ...p, [field]: value } : p)
        });
    };

    const handleDeleteProject = (id: string) => {
        setCvData({
            ...cvData,
            projects: (cvData.projects || []).filter(p => p.id !== id)
        });
    };

    // --- CERTIFICATE HANDLERS ---
    const handleAddCertificate = () => {
        setCvData(prev => ({
            ...prev,
            certificates: [
                ...(prev.certificates || []),
                { id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "" }
            ]
        }));
    };

    const handleUpdateCertificate = (id: string, field: string, value: string) => {
        setCvData({
            ...cvData,
            certificates: (cvData.certificates || []).map(c => c.id === id ? { ...c, [field]: value } : c)
        });
    };

    const handleDeleteCertificate = (id: string) => {
        setCvData({
            ...cvData,
            certificates: (cvData.certificates || []).filter(c => c.id !== id)
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'certificate' | 'project') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing({ type, active: true });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
            const res = await fetch("/api/cv/parse-file", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            
            if (res.ok && result.data) {
                if (type === 'certificate') {
                    setCvData(prev => ({
                        ...prev,
                        certificates: [
                            ...(prev.certificates || []),
                            {
                                id: Date.now().toString(),
                                name: result.data.name || "",
                                issuer: result.data.issuer || "",
                                date: result.data.date || "",
                                url: ""
                            }
                        ]
                    }));
                } else if (type === 'project') {
                    setCvData(prev => ({
                        ...prev,
                        projects: [
                            ...(prev.projects || []),
                            {
                                id: Date.now().toString(),
                                name: result.data.name || "",
                                technologies: result.data.technologies || "",
                                description: result.data.description || "",
                                url: ""
                            }
                        ]
                    }));
                }
                toast.success("Dosyadan bilgiler başarıyla çıkarıldı!");
            } else {
                toast.error(result.error || "Dosya okunamadı.");
            }
        } catch {
            toast.error("Dosya yükleme hatası.");
        } finally {
            setIsParsing({ type: "", active: false });
            if (e.target) e.target.value = '';
        }
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
                } else if (result.error && result.error.includes("Pro plana geçin")) {
                    toast.error(result.error, {
                        action: {
                            label: "Pro'ya Yükselt →",
                            onClick: () => router.push('/pricing')
                        }
                    });
                } else {
                    toast.error(result.error || "CV kaydedilemedi.");
                }
            } else {
                toast.success("CV başarıyla kaydedildi!");
                removeStoredData(`cvData_${id}`);
                removeStoredData(`selectedTemplate_${id}`);
                if (id === "new" && result.id) {
                    router.replace(`/cv/${result.id}/edit`);
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
            const TemplateComponent = 
                template === 'modern' ? ModernTemplate : 
                template === 'minimal' ? MinimalTemplate :
                template === 'executive' ? ExecutiveTemplate :
                template === 'creative' ? CreativeTemplate :
                template === 'professional' ? ProfessionalTemplate :
                ClassicTemplate;
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

    if (isLoadingData) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">CV yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="builder-shell grid grid-cols-1 md:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr_380px] min-h-[calc(100vh-64px)] relative z-[1] w-full text-[var(--dashboard-text)]">

            {/* Sidebar / Wizard Tabs */}
            <aside className={`step-rail ${mobileTab === "sections" ? "block" : "hidden"} md:block bg-[var(--dashboard-bg-2)] border-r border-[var(--dashboard-paper-border)] p-6 shrink-0 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto`}>
                <button onClick={() => router.push('/cv/new')} className="back-link flex items-center gap-2 text-[13px] text-[var(--dashboard-text-dim)] mb-6 hover:text-[var(--dashboard-cyan)] transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Şablonlara Dön
                </button>
                <input type="file" multiple accept=".csv" ref={fileInputRef} className="hidden" onChange={handleLinkedInImport} />
                <button 
                    className="import-btn w-full flex items-center justify-center gap-2 font-['JetBrains_Mono'] text-[11.5px] tracking-[0.02em] bg-[rgba(111,214,232,0.08)] text-[var(--dashboard-cyan)] border border-[var(--dashboard-cyan-dim)] p-[11px] rounded-[var(--dashboard-radius)] mb-6 hover:bg-[rgba(111,214,232,0.15)] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                >
                    {isImporting ? <div className="h-3.5 w-3.5 animate-spin border-2 border-current border-t-transparent rounded-full" /> : <svg className="icon w-[14px] h-[14px] stroke-current fill-none stroke-[1.6px]" viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>}
                    LinkedIn CSV Aktar
                </button>

                <div className="rail-eyebrow font-['JetBrains_Mono'] text-[11px] tracking-[0.1em] text-[var(--dashboard-mono-label)] mb-1">CV BÖLÜMLERİ</div>
                <div className="rail-sub text-[12px] text-[var(--dashboard-text-dim)] mb-[18px]">İlerlemeyi sağda görebilirsin</div>

                <div className="steps relative flex flex-col before:content-[''] before:absolute before:left-[9px] before:top-[6px] before:bottom-[6px] before:w-[1px] before:bg-[var(--dashboard-paper-border)]">
                    {['Kişisel Bilgiler', 'Profesyonel Özet', 'İş Deneyimi', 'Eğitim', 'Beceriler', 'Projeler', 'Sertifikalar'].map((tab, i) => {
                        const tabId = ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certificates'][i];
                        const isActive = activeTab === tabId;
                        return (
                            <div
                                key={tabId}
                                onClick={() => { setActiveTab(tabId); setMobileTab("edit"); }}
                                className={`step relative flex items-center gap-[14px] py-[11px] pl-[30px] pr-0 text-[14px] cursor-pointer transition-colors before:content-[''] before:absolute before:left-[4px] before:top-1/2 before:-translate-y-1/2 before:w-[9px] before:h-[9px] before:rounded-full before:border-[1.5px] ${
                                    isActive 
                                    ? 'active text-[var(--dashboard-text)] font-medium before:bg-[var(--dashboard-stamp)] before:border-[var(--dashboard-stamp)]' 
                                    : 'text-[var(--dashboard-text-dim)] before:bg-[var(--dashboard-bg)] before:border-[var(--dashboard-paper-border)] hover:text-[#EAF3F7]'
                                }`}
                            >
                                {tab}
                            </div>
                        )
                    })}
                </div>
            </aside>

            {/* Main Editor Form Area */}
            <main className={`form-area ${mobileTab === "edit" ? "block" : "hidden md:block"} py-9 px-5 sm:px-11 pb-16 max-w-[680px] w-full`}>
                {/* Dynamic Header based on active tab */}
                <div className="form-head mb-7">
                    <div className="feyebrow font-['JetBrains_Mono'] text-[11px] tracking-[0.12em] text-[var(--dashboard-mono-label)] mb-2 uppercase">
                        ADIM 0{['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certificates'].indexOf(activeTab) + 1} / 07
                    </div>
                    <h1 className="text-[clamp(22px,3vw,28px)] font-['Space_Grotesk'] font-semibold tracking-tight mb-2">
                        {activeTab === 'personal' && 'Kişisel Bilgiler'}
                        {activeTab === 'summary' && 'Profesyonel Özet'}
                        {activeTab === 'experience' && 'İş Deneyimi'}
                        {activeTab === 'education' && 'Eğitim'}
                        {activeTab === 'skills' && 'Beceriler'}
                        {activeTab === 'projects' && 'Projeler'}
                        {activeTab === 'certificates' && 'Sertifikalar'}
                    </h1>
                    <p className="text-[var(--dashboard-text-dim)] text-[14px]">
                        {activeTab === 'personal' && 'İşverenlerin seninle iletişim kurabilmesi için temel bilgilerini gir.'}
                        {activeTab === 'summary' && 'Kariyer geçmişini ve hedeflerini özetleyen kısa bir yazı.'}
                        {activeTab === 'experience' && 'Geriye dönük olarak tüm iş deneyimlerini ekle.'}
                        {activeTab === 'education' && 'Okuduğun okulları ve dereceleri gir.'}
                        {activeTab === 'skills' && 'Sahip olduğun teknik becerileri, araçları ve teknolojileri ekle.'}
                        {activeTab === 'projects' && 'Geliştirdiğin projeleri ve kullandığın teknolojileri ekle.'}
                        {activeTab === 'certificates' && 'Kazandığın sertifikaları ve lisansları ekle.'}
                    </p>
                </div>

                {/* Tab Contents */}
                {activeTab === "personal" && (
                    <div className="bp-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="relative z-10 px-2 sm:px-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="field m-0">
                                    <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Ad Soyad</label>
                                    <input type="text" id="fullName" value={cvData.personal.fullName} onChange={handlePersonalChange} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: Emir Kale" />
                                </div>
                                <div className="field m-0">
                                    <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Hedef Pozisyon</label>
                                    <input type="text" id="jobTitle" value={cvData.personal.jobTitle} onChange={handlePersonalChange} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: Software Developer" />
                                </div>
                                <div className="field m-0">
                                    <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">E-posta</label>
                                    <input type="email" id="email" value={cvData.personal.email} onChange={handlePersonalChange} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="emirkale@..." />
                                </div>
                                <div className="field m-0">
                                    <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Telefon Numarası</label>
                                    <input type="text" id="phone" value={cvData.personal.phone} onChange={handlePersonalChange} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="+90..." />
                                </div>
                                <div className="field m-0">
                                    <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">LinkedIn URL</label>
                                    <input type="text" id="linkedin" value={cvData.personal.linkedin} onChange={handlePersonalChange} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="linkedin.com/in/..." />
                                </div>
                                <div className="field m-0">
                                    <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Kişisel Web Sitesi</label>
                                    <input type="text" id="website" value={cvData.personal.website} onChange={handlePersonalChange} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="vicareer.vercel.app" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "summary" && (
                    <div className="bp-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="relative z-10 px-2 sm:px-3">
                            <div className="flex justify-between items-center mb-5 mt-2">
                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] m-0">Özet Bölümü</label>
                                <button 
                                    onClick={() => setAiModalState({
                                        isOpen: true,
                                        initialText: typeof cvData.summary === 'string' ? cvData.summary : String((cvData.summary as Record<string, unknown>)?.['Profesyonel Özet'] || (cvData.summary as Record<string, unknown>)?.profesyonel_ozet || (cvData.summary as Record<string, unknown>)?.summary || ''),
                                        sectionType: "Profesyonel Özet",
                                        onApply: (text) => setCvData({ ...cvData, summary: text })
                                    })}
                                    className="flex items-center gap-[7px] font-['JetBrains_Mono'] text-[11.5px] text-[var(--dashboard-purple)] border border-[rgba(167,139,250,0.4)] bg-[rgba(167,139,250,0.06)] px-[13px] py-[7px] rounded-[var(--dashboard-radius)] hover:bg-[rgba(167,139,250,0.12)] transition-colors">
                                    ✦ AI ile Yaz
                                </button>
                            </div>
                            <div className="field m-0">
                                <textarea 
                                    rows={6} 
                                    className="w-full py-[11px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all resize-y leading-[1.5]"
                                    value={typeof cvData.summary === 'string' ? cvData.summary : String((cvData.summary as Record<string, unknown>)?.['Profesyonel Özet'] || (cvData.summary as Record<string, unknown>)?.profesyonel_ozet || (cvData.summary as Record<string, unknown>)?.summary || '')}
                                    onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                                    placeholder="Kariyer geçmişini ve hedeflerini özetleyen kısa bir yazı..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "experience" && (
                    <div className="space-y-5">
                        <div className="flex justify-end">
                            <button onClick={handleAddExperience} className="btn-outline !text-[var(--dashboard-cyan)] !border-[var(--dashboard-cyan-dim)] hover:!bg-[rgba(111,214,232,0.1)]">
                                + Deneyim Ekle
                            </button>
                        </div>
                        {cvData.experience.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text-dim)]">
                                Henüz deneyim eklenmedi.
                            </div>
                        ) : (
                            cvData.experience.map((exp) => (
                                <div key={exp.id} className="bp-card">
                                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                                    <div className="relative z-10 px-2 sm:px-3">
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex-1"></div>
                                            <button onClick={() => handleDeleteExperience(exp.id)} className="text-[var(--dashboard-stamp)] opacity-60 hover:opacity-100 transition-opacity ml-4 mt-2 mr-2">
                                                <Trash2 className="h-[15px] w-[15px]" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Pozisyon</label>
                                                <input type="text" value={exp.title} onChange={(e) => handleUpdateExperience(exp.id, 'title', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: Yazılım Geliştirici" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Şirket</label>
                                                <input type="text" value={exp.company} onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: Tech A.Ş." />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Başlangıç</label>
                                                <input type="text" value={exp.startDate} onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: 2020" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Bitiş</label>
                                                <input type="text" value={exp.endDate} onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: 2023 veya Devam Ediyor" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-3.5">
                                            <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] m-0">Açıklama / Sorumluluklar</label>
                                            <button 
                                                onClick={() => setAiModalState({
                                                    isOpen: true,
                                                    initialText: exp.description,
                                                    sectionType: "İş Deneyimi",
                                                    onApply: (text) => handleUpdateExperience(exp.id, 'description', text)
                                                })}
                                                className="flex items-center gap-[7px] font-['JetBrains_Mono'] text-[10px] text-[var(--dashboard-purple)] hover:opacity-80 transition-opacity">
                                                ✦ AI ile İyileştir
                                            </button>
                                        </div>
                                        <div className="field m-0">
                                            <textarea 
                                                rows={3} 
                                                className="w-full py-[11px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all resize-y leading-[1.5]"
                                                value={exp.description}
                                                onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                                                placeholder="Neler yaptınız?"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "education" && (
                    <div className="space-y-5">
                        <div className="flex justify-end">
                            <button onClick={handleAddEducation} className="btn-outline !text-[var(--dashboard-cyan)] !border-[var(--dashboard-cyan-dim)] hover:!bg-[rgba(111,214,232,0.1)]">
                                + Eğitim Ekle
                            </button>
                        </div>
                        {cvData.education.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text-dim)]">
                                Henüz eğitim eklenmedi.
                            </div>
                        ) : (
                            cvData.education.map((edu) => (
                                <div key={edu.id} className="bp-card">
                                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                                    <div className="relative z-10 px-2 sm:px-3">
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex-1"></div>
                                            <button onClick={() => handleDeleteEducation(edu.id)} className="text-[var(--dashboard-stamp)] opacity-60 hover:opacity-100 transition-opacity ml-4 mt-2 mr-2">
                                                <Trash2 className="h-[15px] w-[15px]" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Derece / Bölüm</label>
                                                <input type="text" value={edu.degree} onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: Bilgisayar Mühendisliği" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Okul</label>
                                                <input type="text" value={edu.school} onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: İTÜ" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Başlangıç</label>
                                                <input type="text" value={edu.startDate} onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: 2018" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Bitiş</label>
                                                <input type="text" value={edu.endDate} onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: 2022" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "skills" && (
                    <div className="bp-card">
                        <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                        <div className="relative z-10 px-2 sm:px-3">
                            <SkillsTechInput 
                                skills={cvData.skills} 
                                onChange={(newSkills) => setCvData({ ...cvData, skills: newSkills })} 
                            />
                        </div>
                    </div>
                )}

                {activeTab === "projects" && (
                    <div className="space-y-5">
                        <div className="flex flex-wrap justify-end gap-2">
                            <input type="file" accept=".pdf,.txt" ref={projFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'project')} />
                            <button onClick={() => projFileRef.current?.click()} disabled={isParsing.active && isParsing.type === 'project'} className="btn-outline !text-[var(--dashboard-cyan)] !border-[var(--dashboard-cyan-dim)] hover:!bg-[rgba(111,214,232,0.1)]">
                                {isParsing.active && isParsing.type === 'project' ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" /> : <Download className="mr-1 h-4 w-4" />} Dosyadan Ekle
                            </button>
                            <button onClick={handleAddProject} className="btn-outline !text-[var(--dashboard-cyan)] !border-[var(--dashboard-cyan-dim)] hover:!bg-[rgba(111,214,232,0.1)]">
                                + Proje Ekle
                            </button>
                        </div>
                        {(!cvData.projects || cvData.projects.length === 0) ? (
                            <div className="text-center py-10 border border-dashed border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text-dim)]">
                                Henüz proje eklenmedi.
                            </div>
                        ) : (
                            cvData.projects.map((proj) => (
                                <div key={proj.id} className="bp-card">
                                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                                    <div className="relative z-10 px-2 sm:px-3">
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex-1"></div>
                                            <button onClick={() => handleDeleteProject(proj.id)} className="text-[var(--dashboard-stamp)] opacity-60 hover:opacity-100 transition-opacity ml-4 mt-2 mr-2">
                                                <Trash2 className="h-[15px] w-[15px]" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-5 mt-2">
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Proje Adı</label>
                                                <input type="text" value={proj.name} onChange={(e) => handleUpdateProject(proj.id, 'name', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: E-Ticaret Uygulaması" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Kullanılan Teknolojiler</label>
                                                <ProjectTechInput value={proj.technologies || ""} onChange={(val) => handleUpdateProject(proj.id, 'technologies', val)} />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Proje URL</label>
                                                <input type="text" value={proj.url || ""} onChange={(e) => handleUpdateProject(proj.id, 'url', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: github.com/..." />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Açıklama</label>
                                                <textarea 
                                                    rows={3} 
                                                    className="w-full py-[11px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all resize-y leading-[1.5]"
                                                    value={proj.description}
                                                    onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)}
                                                    placeholder="Projede neler yaptınız?"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "certificates" && (
                    <div className="space-y-5">
                        <div className="flex flex-wrap justify-end gap-2">
                            <input type="file" accept=".pdf,.txt" ref={certFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'certificate')} />
                            <button onClick={() => certFileRef.current?.click()} disabled={isParsing.active && isParsing.type === 'certificate'} className="btn-outline !text-[var(--dashboard-cyan)] !border-[var(--dashboard-cyan-dim)] hover:!bg-[rgba(111,214,232,0.1)]">
                                {isParsing.active && isParsing.type === 'certificate' ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" /> : <Download className="mr-1 h-4 w-4" />} Dosyadan Ekle
                            </button>
                            <button onClick={handleAddCertificate} className="btn-outline !text-[var(--dashboard-cyan)] !border-[var(--dashboard-cyan-dim)] hover:!bg-[rgba(111,214,232,0.1)]">
                                + Sertifika Ekle
                            </button>
                        </div>
                        {(!cvData.certificates || cvData.certificates.length === 0) ? (
                            <div className="text-center py-10 border border-dashed border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text-dim)]">
                                Henüz sertifika eklenmedi.
                            </div>
                        ) : (
                            cvData.certificates.map((cert) => (
                                <div key={cert.id} className="bp-card">
                                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                                    <div className="relative z-10 px-2 sm:px-3">
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex-1"></div>
                                            <button onClick={() => handleDeleteCertificate(cert.id)} className="text-[var(--dashboard-stamp)] opacity-60 hover:opacity-100 transition-opacity ml-4 mt-2 mr-2">
                                                <Trash2 className="h-[15px] w-[15px]" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Sertifika Adı</label>
                                                <input type="text" value={cert.name} onChange={(e) => handleUpdateCertificate(cert.id, 'name', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: AWS Certified..." />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Veren Kurum</label>
                                                <input type="text" value={cert.issuer} onChange={(e) => handleUpdateCertificate(cert.id, 'issuer', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: Amazon Web Services" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Tarih</label>
                                                <input type="text" value={cert.date} onChange={(e) => handleUpdateCertificate(cert.id, 'date', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: 2023" />
                                            </div>
                                            <div className="field m-0">
                                                <label className="block font-['JetBrains_Mono'] text-[10.5px] tracking-[0.08em] uppercase text-[var(--dashboard-mono-label)] mb-2">Sertifika URL</label>
                                                <input type="text" value={cert.url || ""} onChange={(e) => handleUpdateCertificate(cert.id, 'url', e.target.value)} className="w-full h-[46px] px-[13px] bg-white/[0.02] border border-[var(--dashboard-paper-border)] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] font-['Inter'] text-[14.5px] focus:outline-none focus:border-[var(--dashboard-cyan)] focus:bg-[rgba(111,214,232,0.04)] placeholder-white/25 transition-all" placeholder="Örn: credly.com/..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Save Bar */}
                <div className="save-bar flex justify-end mt-7">
                    <button className="btn-stamp" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" /> : null}
                        KAYDET →
                    </button>
                </div>
            </main>

            {/* Preview Panel */}
            <aside className={`preview-panel hidden xl:block bg-[var(--dashboard-bg-2)] border-l border-[var(--dashboard-paper-border)] p-6 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto ${mobileTab === 'preview' ? '!block !static !w-full' : ''}`}>
                <div className="preview-controls flex justify-between items-center mb-[18px] gap-[10px]">
                    <select 
                        className="tmpl-select font-['JetBrains_Mono'] text-[11.5px] bg-transparent border border-[var(--dashboard-paper-border)] text-[var(--dashboard-text)] px-[10px] py-[8px] rounded-[var(--dashboard-radius)] focus:outline-none focus:border-[var(--dashboard-cyan)]"
                        value={template} 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e) => setTemplate(e.target.value as any)}
                    >
                        <option value="classic" className="text-black">Classic</option>
                        <option value="modern" className="text-black">Modern</option>
                        <option value="minimal" className="text-black">Minimal</option>
                        <option value="executive" className="text-black">Executive</option>
                        <option value="creative" className="text-black">Creative</option>
                        <option value="professional" className="text-black">Professional</option>
                    </select>
                    <button className="pdf-btn flex items-center gap-[6px] font-['JetBrains_Mono'] text-[11.5px] border border-[var(--dashboard-paper-border)] px-[12px] py-[8px] rounded-[var(--dashboard-radius)] text-[var(--dashboard-text)] hover:border-[var(--dashboard-cyan-dim)] hover:text-[var(--dashboard-cyan)] transition-colors" onClick={handleDownloadPDF}>
                        <svg className="icon w-[14px] h-[14px] stroke-current fill-none stroke-[1.6px]" viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
                        PDF İndir
                    </button>
                </div>
                
                <div className="ats-readout flex justify-between items-center font-['JetBrains_Mono'] text-[11px] tracking-[0.06em] py-[9px] px-[12px] border border-dashed border-[var(--dashboard-cyan-dim)] rounded-[var(--dashboard-radius)] mb-[16px] text-[var(--dashboard-mono-label)]">
                    <span>ATS SKORU</span>
                    <span className="val text-[var(--dashboard-cyan)] text-[14px] font-semibold">85</span>
                </div>

                <div className="sheet bg-[#0e1626] border border-[var(--dashboard-paper-border)] rounded-[2px] p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                    {/* Render actual React PDF viewer */}
                    <div className="w-full h-[600px] overflow-y-auto custom-scrollbar bg-white">
                        <CVPreview data={cvData} template={template} />
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar */}
            <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[var(--dashboard-bg-2)] border-t border-[var(--dashboard-paper-border)] flex items-center justify-around p-2 pb-safe">
                <button 
                    onClick={() => setMobileTab("sections")} 
                    className={`flex flex-col items-center p-2 rounded-lg ${mobileTab === 'sections' ? 'text-[var(--dashboard-cyan)]' : 'text-[var(--dashboard-text-dim)]'}`}
                >
                    <List className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">Bölümler</span>
                </button>
                <button 
                    onClick={() => setMobileTab("edit")} 
                    className={`flex flex-col items-center p-2 rounded-lg ${mobileTab === 'edit' ? 'text-[var(--dashboard-cyan)]' : 'text-[var(--dashboard-text-dim)]'}`}
                >
                    <Edit3 className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">Düzenle</span>
                </button>
                <button 
                    onClick={() => setMobileTab("preview")} 
                    className={`flex flex-col items-center p-2 rounded-lg ${mobileTab === 'preview' ? 'text-[var(--dashboard-cyan)]' : 'text-[var(--dashboard-text-dim)]'}`}
                >
                    <FileText className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">Önizleme</span>
                </button>
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
