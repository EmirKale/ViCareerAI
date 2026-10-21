"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Lock, Crown, ShieldAlert, Save, Loader2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/routing";

export default function ProfilePage() {
    const t = useTranslations("Profile");
    const tIndex = useTranslations("Index");
    const [profile, setProfile] = useState({ fullName: "", email: "" });
    const [plan, setPlan] = useState("free");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/profile")
            .then(r => r.json())
            .then(data => {
                if (data?.email) {
                    setProfile({
                        fullName: data.full_name || "",
                        email: data.email || "",
                    });
                    setPlan(data.plan || "free");
                }
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ full_name: profile.fullName }),
            });
            if (res.ok) {
                toast.success(t("profileUpdated"));
            } else {
                toast.error(t("updateFailed"));
            }
        } catch {
            // Error logged if needed
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordReset = async () => {
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: profile.email }),
            });
            if (res.ok) {
                toast.success(t("resetEmailSent"));
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.error || t("resetEmailFailed"));
            }
        } catch {
            toast.error(t("errorOccurred"));
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch("/api/auth/delete-account", {
                method: "POST"
            });
            if (res.ok) {
                toast.success("Hesabınız başarıyla silindi.");
                router.push("/login");
            } else {
                toast.error("Hesap silinirken bir hata oluştu.");
                setIsDeleting(false);
            }
        } catch {
            toast.error(t("errorOccurred"));
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4 md:p-8">
            <style dangerouslySetInnerHTML={{__html: `
                .page-head h1{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:clamp(26px,3vw,32px);text-transform:uppercase;color:#111111;margin-bottom:6px;letter-spacing:-0.01em;}
                .page-head p{font-size:14.5px;color:#4A4742;}
                .peyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#757169;margin-bottom:6px;}
                .bp-card{position:relative;background:#FFFFFF;border:1.5px solid #111111;box-shadow:2px 2px 0px #D3CDC2;border-radius:0px;padding:26px;}
                .bp-card svg.corners{display:none;}
                .bp-card h3{font-size:17px;display:flex;align-items:center;gap:9px;margin-bottom:20px;font-family:'Archivo Narrow',sans-serif;font-weight:700;text-transform:uppercase;color:#111111;}
                .bp-card h3 svg{width:18px;height:18px;color:#1849A9;}
                .bp-card.danger{background:#FFF9F8;border:1.5px solid #A32020;box-shadow:2px 2px 0px rgba(163,32,32,0.2);}
                .bp-card.danger h3{color:#A32020;}
                .bp-card.danger h3 svg{color:#A32020;}

                .form-group{margin-bottom:16px;}
                .form-group label{display:block;font-size:11px;color:#757169;font-family:'JetBrains Mono',monospace;font-weight:700;text-transform:uppercase;margin-bottom:6px;letter-spacing:.04em;}
                .form-group input{width:100%;background:#FFFFFF;border:1.5px solid #111111;color:#111111;padding:11px 14px;border-radius:0px;font-size:14px;outline:none;}
                .form-group input:focus{border-color:#1849A9;box-shadow:0 0 0 2px rgba(24,73,169,0.2);}
                .form-group input:disabled{background:#FAF8F5;border-color:#D3CDC2;color:#757169;cursor:not-allowed;}

                .btn-stamp{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;background:#1849A9;color:#FFFFFF;padding:11px 18px;border-radius:0px;border:1.5px solid #111111;cursor:pointer;}
                .btn-stamp:hover{background:#123782;}
                .btn-outline{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;background:#FFFFFF;color:#111111;padding:11px 18px;border-radius:0px;border:1.5px solid #111111;cursor:pointer;}
                .btn-outline:hover{background:#EAE6DC;}
                .btn-outline.danger{color:#A32020;border-color:#A32020;background:#FFFFFF;}
                .btn-outline.danger:hover{background:rgba(163,32,32,.08);}

                .plan-box{display:flex;align-items:center;justify-content:space-between;padding:16px;border:1px solid #D3CDC2;border-radius:0px;background:#FAF8F5;margin-bottom:16px;}
                .plan-box .pb-title{font-size:15px;font-weight:700;color:#111111;margin-bottom:4px;}
                .plan-box .pb-desc{font-size:13px;color:#4A4742;}
                .plan-badge{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;padding:3px 8px;border-radius:0px;}
                .plan-badge.pro{background:rgba(24,73,169,.1);color:#1849A9;border:1px solid #1849A9;}
                .plan-badge.free{background:#FFFFFF;color:#757169;border:1px solid #D3CDC2;}
            `}} />

            <div className="page-head" style={{ marginBottom: '28px' }}>
                <div className="peyebrow">HESAP AYARLARI</div>
                <h1>{t("title")}</h1>
                <p>{t("desc")}</p>
            </div>

            <div className="space-y-6">
                {/* Profile Info */}
                <div className="bp-card">
                    <h3><User /> {t("personalInfo")}</h3>
                    <div className="form-group">
                        <label>{t("fullName")}</label>
                        <input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label>{t("email")}</label>
                        <input value={profile.email} disabled />
                        <p style={{ fontSize: '12px', color: '#757169', marginTop: '6px' }}>{t("emailNote")}</p>
                    </div>
                    <button className="btn-stamp" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {t("saveButton")}
                    </button>
                </div>

                {/* Plan Info */}
                <div className="bp-card">
                    <h3>
                        <Crown style={{ width: '18px', height: '18px' }} /> 
                        {t("planInfo")}
                    </h3>
                    <div className="plan-box">
                        <div>
                            <div className="pb-title">{plan === "pro" ? t("proPlan") : t("freePlan")}</div>
                            <div className="pb-desc">{plan === "pro" ? t("proDesc") : t("freeDesc")}</div>
                        </div>
                        <div className={`plan-badge ${plan === "pro" ? "pro" : "free"}`}>
                            {plan === "pro" ? t("proBadge") : t("freeBadge")}
                        </div>
                    </div>
                    {plan !== "pro" && (
                        <button className="btn-stamp" style={{ width: '100%', justifyContent: 'center' }}>
                            <Crown className="w-4 h-4" />
                            {t("upgradeToPro")} — {tIndex("proPrice")}{tIndex("perMonth")}
                        </button>
                    )}
                </div>

                {/* Password */}
                <div className="bp-card">
                    <h3><Lock /> {t("passwordChange")}</h3>
                    <button className="btn-outline" onClick={handlePasswordReset}>
                        {t("sendResetEmail")}
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="bp-card danger">
                    <h3>
                        <ShieldAlert /> 
                        {t("dangerZone")}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#4A4742', marginBottom: '20px' }}>{t("dangerZoneDesc")}</p>
                    <button className="btn-outline danger" onClick={() => setShowDeleteDialog(true)}>
                        {t("deleteAccount")}
                    </button>
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="border-2 border-[#111111] bg-white text-[#111111] shadow-[4px_4px_0px_#111111] rounded-[0px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#A32020] font-['Archivo_Narrow'] text-xl uppercase font-bold">
                            <AlertTriangle className="h-5 w-5 text-[#A32020]" />
                            Hesabınızı silmek istediğinize emin misiniz?
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-[#4A4742]">
                            Bu işlem geri alınamaz. Tüm verileriniz (CV&apos;leriniz, motivasyon mektuplarınız ve ilan takipleriniz) <strong>kalıcı olarak silinecektir</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex sm:justify-between gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} className="border-1.5 border-[#111111] bg-white hover:bg-[#EAE6DC] text-[#111111] rounded-[0px] font-['JetBrains_Mono'] text-xs uppercase font-bold">
                            İptal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting} className="bg-[#A32020] hover:bg-[#831818] text-white rounded-[0px] font-['JetBrains_Mono'] text-xs uppercase font-bold border-1.5 border-[#111111]">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Evet, Hesabımı Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
