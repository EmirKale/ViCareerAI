"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { pdf } from '@react-pdf/renderer';
import { CoverLetterPDF } from "@/components/cover-letter/templates/CoverLetterPDF";
import { Sparkles, Loader2, Copy, Download, RotateCcw, Save } from "lucide-react";

export default function NewCoverLetterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("id");
    const [form, setForm] = useState({
        position: "",
        company: "",
        industry: "",
        tone: "professional",
        language: "tr",
        userSummary: "",
    });

    const [letterId, setLetterId] = useState<string | null>(null);
    const [generatedLetter, setGeneratedLetter] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [quota, setQuota] = useState<{ cover_letter_count: number; plan: string } | null>(null);
    const [isLoadingQuota, setIsLoadingQuota] = useState<boolean>(true);

    useEffect(() => {
        fetchQuota();
        if (editId) {
            fetchLetter(editId);
        }
    }, [editId]);

    const fetchQuota = async () => {
        try {
            const res = await fetch("/api/quota");
            if (res.ok) {
                const data = await res.json();
                setQuota({ 
                    cover_letter_count: data.cover_letter_count || 0,
                    plan: "free" // TODO: Get actual plan from profile
                });
            }
        } catch {
            // Silently fail
        } finally {
            setIsLoadingQuota(false);
        }
    };

    const fetchLetter = async (id: string) => {
        try {
            const res = await fetch(`/api/cover-letter/${id}`);
            const data = await res.json();
            if (res.ok) {
                setForm({
                    position: data.position || "",
                    company: data.company || "",
                    industry: data.industry || "",
                    tone: data.tone || "professional",
                    language: data.language || "tr",
                    userSummary: data.user_summary || "",
                });
                setGeneratedLetter(data.content || "");
                setLetterId(data.id);
            }
        } catch {
            toast.error("Mektup yüklenemedi.");
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        if (!form.position || !form.company) {
            toast.error("Lütfen en azından pozisyon ve şirket adını girin.");
            return;
        }

        setIsLoading(true);
        setGeneratedLetter("");

        try {
            const res = await fetch("/api/cover-letter/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429 && data.code === "QUOTA_EXCEEDED") {
                    toast.error(data.error || "Cover letter limitinize ulaştınız.");
                } else {
                    toast.error(data.error || "Bir hata oluştu.");
                }
                return;
            }

            setGeneratedLetter(data.letter);
            if (data.id) {
                setLetterId(data.id);
            }
            toast.success("Mektup başarıyla oluşturuldu ve otomatik kaydedildi!");
            
            // Refresh quota after successful generation
            fetchQuota();
        } catch {
            // Error logged if needed
        } finally {
            // Loading handled
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        toast.success("Mektup panoya kopyalandı!");
    };

    const handleReset = () => {
        setGeneratedLetter("");
    };

    const handleDownloadPDF = async () => {
        try {
            toast.info("PDF hazırlanıyor, lütfen bekleyin...");
            const blob = await pdf(
                <CoverLetterPDF
                    fullName="Başvuru Sahibi"
                    company={form.company || "Şirket"}
                    position={form.position || "Pozisyon"}
                    content={generatedLetter}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${form.company || 'Sirket'}_Motivasyon_Mektubu.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF başarıyla indirildi!");
        } catch {
            toast.error("PDF oluşturulurken hata oluştu.");
        }
    };

    const handleSave = async () => {
        if (!generatedLetter) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: letterId,
                    position: form.position,
                    company: form.company,
                    language: form.language,
                    tone: form.tone,
                    content: generatedLetter
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 503 || res.status === 401) {
                    toast.info("Giriş yapmadığınız için çalışmalarınız tarayıcıda geçici tutulmaktadır.");
                } else {
                    toast.error(data.error || "Mektup kaydedilemedi.");
                }
            } else {
                toast.success("Mektup başarıyla güncellendi!");
                router.push("/cover-letter/history");
            }
        } catch {
            toast.error("Kaydetme işlemi sırasında hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .list-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:32px;}
                .letter-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;}
                .quota-pill{
                    font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.06em;color:var(--dashboard-mono-label);
                    border:1px dashed var(--dashboard-cyan-dim);border-radius:var(--dashboard-radius);padding:9px 14px;display:inline-flex;
                    align-items:center;gap:10px;
                }
                .quota-pill .val{color:var(--dashboard-cyan);font-size:15px;font-weight:600;}
                .field{margin-bottom:20px;}
                .field label{display:block;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--dashboard-mono-label);margin-bottom:9px;}
                .field input, .field textarea, .field select{
                    width:100%;height:46px;padding:0 13px;background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);
                    border-radius:var(--dashboard-radius);color:var(--dashboard-text);font-size:14.5px;
                }
                .field select{
                    appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236FD6E8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                    background-repeat:no-repeat;background-position:right 13px top 50%;background-size:10px auto;
                }
                .field select option{background:var(--dashboard-bg-2);color:var(--dashboard-text);}
                .field textarea{height:auto;padding:11px 13px;resize:vertical;line-height:1.5;}
                .field input:focus, .field textarea:focus, .field select:focus{outline:none;border-color:var(--dashboard-cyan);background:rgba(111,214,232,0.04);}
                .field input::placeholder, .field textarea::placeholder{color:rgba(234,243,247,0.25);}
                .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
                .output-empty{
                    display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
                    min-height:340px;color:var(--dashboard-text-dim);gap:14px;
                }
                .output-empty svg{width:38px;height:38px;color:var(--dashboard-cyan-dim);}
                .output-empty .o-title{color:var(--dashboard-text);font-size:15px;font-weight:500;}
                .output-empty .o-sub{font-size:13px;max-width:240px;}
                .output-actions{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;}
                .output-actions button{flex:1;justify-content:center;}
                .generated-textarea{
                    width:100%;height:340px;padding:16px;background:rgba(255,255,255,0.02);border:1px solid var(--dashboard-paper-border);
                    border-radius:var(--dashboard-radius);color:var(--dashboard-text);font-size:14.5px;resize:vertical;line-height:1.6;
                }
                .generated-textarea:focus{outline:none;border-color:var(--dashboard-cyan);background:rgba(111,214,232,0.04);}
                @media(max-width:900px){.letter-grid{grid-template-columns:1fr;}.field-row{grid-template-columns:1fr;}}
            `}} />

            <div className="list-head">
                <div className="page-head" style={{ marginBottom: 0 }}>
                    <div className="peyebrow">MOTİVASYON MEKTUBU</div>
                    <h1>GPT-4o ile dakikalar içinde mektup yaz</h1>
                    <p>Kişiselleştirilmiş ve ATS uyumlu mektubunu oluştur.</p>
                </div>
                {!isLoadingQuota && quota && (
                    <div className="quota-pill">
                        MEKTUP KOTASI <span className="val">{quota.cover_letter_count}/3</span>
                        {quota.cover_letter_count >= 3 && quota.plan === "free" && (
                            <button className="btn-stamp" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => window.location.href = "/tr/pricing"}>
                                PRO'YA GEÇ
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="letter-grid">
                {/* Left: Form */}
                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3 style={{ marginBottom: '22px' }}>Mektup Bilgileri</h3>
                    
                    <div className="field">
                        <label>Hedef Pozisyon *</label>
                        <input 
                            type="text" 
                            placeholder="Örn: Senior Frontend Developer" 
                            value={form.position}
                            onChange={(e) => handleChange("position", e.target.value)}
                        />
                    </div>
                    
                    <div className="field">
                        <label>Şirket Adı *</label>
                        <input 
                            type="text" 
                            placeholder="Örn: Google Türkiye" 
                            value={form.company}
                            onChange={(e) => handleChange("company", e.target.value)}
                        />
                    </div>
                    
                    <div className="field">
                        <label>Sektör (isteğe bağlı)</label>
                        <input 
                            type="text" 
                            placeholder="Örn: Teknoloji, Finans, E-ticaret" 
                            value={form.industry}
                            onChange={(e) => handleChange("industry", e.target.value)}
                        />
                    </div>
                    
                    <div className="field-row">
                        <div className="field">
                            <label>Dil</label>
                            <select value={form.language} onChange={(e) => handleChange("language", e.target.value)}>
                                <option value="tr">TR Türkçe</option>
                                <option value="en">EN English</option>
                            </select>
                        </div>
                        <div className="field">
                            <label>Ton / Üslup</label>
                            <select value={form.tone} onChange={(e) => handleChange("tone", e.target.value)}>
                                <option value="professional">Profesyonel</option>
                                <option value="friendly">Samimi</option>
                                <option value="confident">Özgüvenli</option>
                                <option value="creative">Yaratıcı</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="field">
                        <label>Hakkında Notlar <span style={{ textTransform: 'none', color: 'var(--dashboard-text-dim)' }}>(AI bu bilgileri kullanır)</span></label>
                        <textarea 
                            rows={3} 
                            placeholder="Örn: 5 yıl React deneyimi, startup çıkışlı, Agile ekiplerde çalıştım..."
                            value={form.userSummary}
                            onChange={(e) => handleChange("userSummary", e.target.value)}
                        />
                    </div>
                    
                    <button 
                        className="btn-stamp" 
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={handleGenerate}
                        disabled={isLoading || (quota?.plan === "free" && quota.cover_letter_count >= 3)}
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mektup Oluşturuluyor...</>
                        ) : quota?.plan === "free" && quota.cover_letter_count >= 3 ? (
                            <>Limit Doldu - Pro'ya Geçin</>
                        ) : (
                            <>✦ YAPAY ZEKA İLE OLUŞTUR</>
                        )}
                    </button>
                </div>

                {/* Right: Generated Letter */}
                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                        <h3 style={{ margin: 0 }}>Oluşturulan Mektup</h3>
                        {generatedLetter && (
                            <div style={{ fontSize: '11px', color: 'var(--dashboard-green)', fontFamily: "'JetBrains Mono', monospace" }}>
                                ✓ AI tarafından oluşturuldu
                            </div>
                        )}
                    </div>
                    
                    {!generatedLetter && !isLoading ? (
                        <div className="output-empty">
                            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" fill="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/></svg>
                            <div className="o-title">Mektubun burada görünecek</div>
                            <div className="o-sub">Bilgileri doldurup yapay zekayı çalıştır.</div>
                        </div>
                    ) : isLoading ? (
                        <div className="output-empty">
                            <Loader2 className="w-[38px] h-[38px] animate-spin" style={{ color: 'var(--dashboard-cyan)' }} />
                            <div className="o-title">AI mektubunuzu yazıyor...</div>
                            <div className="o-sub">Bu işlem 5-15 saniye sürebilir</div>
                        </div>
                    ) : (
                        <div>
                            <textarea 
                                className="generated-textarea"
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                            />
                            <div className="output-actions">
                                <button className="btn-outline" onClick={handleCopy}><Copy className="w-[14px] h-[14px] mr-1"/> Kopyala</button>
                                <button className="btn-outline" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="w-[14px] h-[14px] mr-1 animate-spin" /> : <Save className="w-[14px] h-[14px] mr-1"/>}
                                    Kaydet
                                </button>
                                <button className="btn-stamp" onClick={handleDownloadPDF}><Download className="w-[14px] h-[14px] mr-1"/> PDF İndir</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
