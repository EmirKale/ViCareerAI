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
import { ArrowLeft, Save, Sparkles, Plus, Trash2, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pdf } from '@react-pdf/renderer';
import CVPreview from "@/components/cv/CVPreview";
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
            const localData = getStoredData(`cvData_${id}`);
            const localTemplate = getStoredData(`selectedTemplate_${id}`);
            if (localData) {
                try { setCvData(JSON.parse(localData)); } catch {}
            }
            if (localTemplate) {
                setTemplate(localTemplate as 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional');
            }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">

            {/* Sidebar / Wizard Tabs */}
            <div className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col h-full shrink-0">
                <div className="p-4 border-b space-y-3">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/templates')} className="text-muted-foreground w-full justify-start -ml-2">
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
                                        initialText: typeof cvData.summary === 'string' ? cvData.summary : String((cvData.summary as Record<string, unknown>)?.['Profesyonel Özet'] || (cvData.summary as Record<string, unknown>)?.profesyonel_ozet || (cvData.summary as Record<string, unknown>)?.summary || ''),
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
                                            value={typeof cvData.summary === 'string' ? cvData.summary : String((cvData.summary as Record<string, unknown>)?.['Profesyonel Özet'] || (cvData.summary as Record<string, unknown>)?.profesyonel_ozet || (cvData.summary as Record<string, unknown>)?.summary || '')}
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
                                    <p className="text-muted-foreground mt-1">Sahip olduğunuz teknik becerileri, araçları ve teknolojileri ekleyin.</p>
                                </div>
                            </div>

                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <SkillsTechInput 
                                        skills={cvData.skills} 
                                        onChange={(newSkills) => setCvData({ ...cvData, skills: newSkills })} 
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === "projects" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Projeler</h1>
                                    <p className="text-muted-foreground mt-1">Geliştirdiğiniz projeleri ve kullandığınız teknolojileri ekleyin.</p>
                                </div>
                                <div className="flex gap-2">
                                    <input type="file" accept=".pdf,.txt" ref={projFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'project')} />
                                    <Button onClick={() => projFileRef.current?.click()} size="sm" variant="outline" disabled={isParsing.active && isParsing.type === 'project'}>
                                        {isParsing.active && isParsing.type === 'project' ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mr-2" /> : <Download className="mr-2 h-4 w-4" />}
                                        Dosyadan Ekle
                                    </Button>
                                    <Button onClick={handleAddProject} size="sm" className="gradient-brand text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Proje Ekle
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {!cvData.projects || cvData.projects.length === 0 ? (
                                    <div className="text-center py-10 border-2 border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <p className="text-muted-foreground">Henüz proje eklenmedi.</p>
                                    </div>
                                ) : (
                                    cvData.projects.map((proj) => (
                                        <Card key={proj.id} className="relative mt-2">
                                            <Button
                                                variant="ghost" size="icon"
                                                className="absolute right-2 top-2 text-red-500 opacity-60 hover:opacity-100"
                                                onClick={() => handleDeleteProject(proj.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <CardContent className="p-6 space-y-4 pt-10">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Proje Adı</Label>
                                                        <Input value={proj.name} onChange={(e) => handleUpdateProject(proj.id, 'name', e.target.value)} placeholder="Örn: E-Ticaret Uygulaması" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Kullanılan Teknolojiler</Label>
                                                        <ProjectTechInput value={proj.technologies || ""} onChange={(val) => handleUpdateProject(proj.id, 'technologies', val)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Proje URL</Label>
                                                        <Input value={proj.url || ""} onChange={(e) => handleUpdateProject(proj.id, 'url', e.target.value)} placeholder="Örn: github.com/kullanici/proje" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Açıklama</Label>
                                                        <Textarea rows={3} value={proj.description} onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)} placeholder="Projede neler yaptınız?" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Certificates Tab */}
                    {activeTab === "certificates" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Sertifikalar</h1>
                                    <p className="text-muted-foreground mt-1">Kazandığınız sertifikaları ve lisansları ekleyin.</p>
                                </div>
                                <div className="flex gap-2">
                                    <input type="file" accept=".pdf,.txt" ref={certFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'certificate')} />
                                    <Button onClick={() => certFileRef.current?.click()} size="sm" variant="outline" disabled={isParsing.active && isParsing.type === 'certificate'}>
                                        {isParsing.active && isParsing.type === 'certificate' ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mr-2" /> : <Download className="mr-2 h-4 w-4" />}
                                        Dosyadan Ekle
                                    </Button>
                                    <Button onClick={handleAddCertificate} size="sm" className="gradient-brand text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Sertifika Ekle
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {!cvData.certificates || cvData.certificates.length === 0 ? (
                                    <div className="text-center py-10 border-2 border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <p className="text-muted-foreground">Henüz sertifika eklenmedi.</p>
                                    </div>
                                ) : (
                                    cvData.certificates.map((cert) => (
                                        <Card key={cert.id} className="relative mt-2">
                                            <Button
                                                variant="ghost" size="icon"
                                                className="absolute right-2 top-2 text-red-500 opacity-60 hover:opacity-100"
                                                onClick={() => handleDeleteCertificate(cert.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <CardContent className="p-6 space-y-4 pt-10">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Sertifika Adı</Label>
                                                        <Input value={cert.name} onChange={(e) => handleUpdateCertificate(cert.id, 'name', e.target.value)} placeholder="Örn: AWS Certified Solutions Architect" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Veren Kurum</Label>
                                                        <Input value={cert.issuer} onChange={(e) => handleUpdateCertificate(cert.id, 'issuer', e.target.value)} placeholder="Örn: Amazon Web Services" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Tarih</Label>
                                                        <Input value={cert.date} onChange={(e) => handleUpdateCertificate(cert.id, 'date', e.target.value)} placeholder="Örn: 2023 veya Aralık 2022" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Sertifika URL</Label>
                                                        <Input value={cert.url || ""} onChange={(e) => handleUpdateCertificate(cert.id, 'url', e.target.value)} placeholder="Örn: credly.com/..." />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* PDF Real-time Preview Pane */}
            <div className="hidden lg:flex flex-col w-[500px] border-l bg-zinc-100/50 dark:bg-zinc-950 p-4">
                <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                        <Select value={template} onValueChange={(v: 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional') => setTemplate(v)}>
                            <SelectTrigger className="h-8 w-[140px] text-xs">
                                <SelectValue placeholder="Şablon" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
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
                <div className="flex-1 w-full h-full min-h-0 overflow-y-auto rounded-lg shadow-sm">
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
