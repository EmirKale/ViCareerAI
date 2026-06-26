"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
                .bp-card{position:relative;background:var(--dashboard-paper);border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);padding:26px;}
                .bp-card svg.corners{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
                .bp-card svg.corners path{stroke:var(--dashboard-cyan);stroke-width:1.3;fill:none;}
                .bp-card h3{font-size:16px;display:flex;align-items:center;gap:9px;margin-bottom:20px;font-family:'Space Grotesk',sans-serif;font-weight:600;}
                .bp-card h3 svg{width:18px;height:18px;color:var(--dashboard-cyan);}
                .bp-card.danger svg.corners path{stroke:var(--dashboard-stamp);}
                .bp-card.danger h3 svg{color:var(--dashboard-stamp);}
                .bp-card.danger{background:rgba(232,84,60,.03);border:1px solid rgba(232,84,60,.18);}

                .form-group{margin-bottom:16px;}
                .form-group label{display:block;font-size:12px;color:var(--dashboard-mono-label);font-family:'JetBrains Mono',monospace;margin-bottom:6px;letter-spacing:.03em;}
                .form-group input{width:100%;background:rgba(255,255,255,.02);border:1px solid var(--dashboard-paper-border);color:var(--dashboard-text);padding:11px 14px;border-radius:var(--dashboard-radius);font-family:'Inter',sans-serif;font-size:14px;outline:none;}
                .form-group input:focus{border-color:var(--dashboard-cyan);}
                .form-group input:disabled{opacity:.5;cursor:not-allowed;}

                .btn-stamp{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.03em;background:var(--dashboard-cyan);color:#0A1628;padding:11px 18px;border-radius:var(--dashboard-radius);border:none;}
                .btn-outline{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.03em;background:transparent;color:var(--dashboard-text);padding:11px 18px;border-radius:var(--dashboard-radius);border:1px solid var(--dashboard-paper-border);}
                .btn-outline:hover{border-color:var(--dashboard-cyan);}
                .btn-outline.danger{color:var(--dashboard-stamp);border-color:rgba(232,84,60,.3);}
                .btn-outline.danger:hover{border-color:var(--dashboard-stamp);background:rgba(232,84,60,.05);}

                .plan-box{display:flex;align-items:center;justify-content:space-between;padding:16px;border:1px solid var(--dashboard-paper-border);border-radius:var(--dashboard-radius);background:rgba(255,255,255,.015);margin-bottom:16px;}
                .plan-box .pb-title{font-size:14.5px;font-weight:600;margin-bottom:4px;}
                .plan-box .pb-desc{font-size:13px;color:var(--dashboard-text-dim);}
                .plan-badge{font-family:'JetBrains Mono',monospace;font-size:10px;padding:3px 8px;border-radius:var(--dashboard-radius);}
                .plan-badge.pro{background:rgba(232,184,94,.15);color:var(--dashboard-amber);border:1px solid rgba(232,184,94,.3);}
                .plan-badge.free{background:rgba(255,255,255,.05);color:var(--dashboard-text-dim);border:1px solid var(--dashboard-paper-border);}
            `}} />

            <div className="page-head" style={{ marginBottom: '28px' }}>
                <div className="peyebrow">HESAP AYARLARI</div>
                <h1 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '8px' }}>{t("title")}</h1>
                <p style={{ color: 'var(--dashboard-text-dim)', fontSize: '14px' }}>{t("desc")}</p>
            </div>

            <div className="space-y-6">
                {/* Profile Info */}
                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3><User /> {t("personalInfo")}</h3>
                    <div className="form-group">
                        <label>{t("fullName")}</label>
                        <input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label>{t("email")}</label>
                        <input value={profile.email} disabled />
                        <p style={{ fontSize: '12px', color: 'var(--dashboard-text-dim)', marginTop: '6px' }}>{t("emailNote")}</p>
                    </div>
                    <button className="btn-stamp" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {t("saveButton")}
                    </button>
                </div>

                {/* Plan Info */}
                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3 style={{ color: 'var(--dashboard-amber)' }}>
                        <Crown style={{ color: 'var(--dashboard-amber)', width: '18px', height: '18px' }} /> 
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
                        <button className="btn-stamp" style={{ width: '100%', justifyContent: 'center', background: 'var(--dashboard-amber)', color: '#0A1628' }}>
                            <Crown className="w-4 h-4" />
                            {t("upgradeToPro")} — {tIndex("proPrice")}{tIndex("perMonth")}
                        </button>
                    )}
                </div>

                {/* Password */}
                <div className="bp-card">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3 style={{ color: 'var(--dashboard-text)' }}><Lock /> {t("passwordChange")}</h3>
                    <button className="btn-outline" onClick={handlePasswordReset}>
                        {t("sendResetEmail")}
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="bp-card danger">
                    <svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>
                    <h3 style={{ color: 'var(--dashboard-stamp)' }}>
                        <ShieldAlert style={{ color: 'var(--dashboard-stamp)' }} /> 
                        {t("dangerZone")}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--dashboard-text-dim)', marginBottom: '20px' }}>{t("dangerZoneDesc")}</p>
                    <button className="btn-outline danger" onClick={() => setShowDeleteDialog(true)}>
                        {t("deleteAccount")}
                    </button>
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="border-red-900/50 bg-zinc-950 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="h-5 w-5" />
                            Hesabınızı silmek istediğinize emin misiniz?
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-zinc-400">
                            Bu işlem geri alınamaz. Tüm verileriniz (CV&apos;leriniz, motivasyon mektuplarınız ve ilan takipleriniz) <strong>kalıcı olarak silinecektir</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex sm:justify-between gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} className="border-zinc-800 hover:bg-zinc-900 text-zinc-300">
                            İptal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Evet, Hesabımı Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
