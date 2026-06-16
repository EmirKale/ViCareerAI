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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto p-4 md:p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                <p className="text-muted-foreground mt-1">{t("desc")}</p>
            </div>

            {/* Profile Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4 text-blue-500" />
                        {t("personalInfo")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">{t("fullName")}</Label>
                        <Input id="fullName" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input id="email" type="email" value={profile.email} disabled className="opacity-60" />
                        <p className="text-xs text-muted-foreground">{t("emailNote")}</p>
                    </div>
                    <Button className="gradient-brand text-white border-0" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {t("saveButton")}
                    </Button>
                </CardContent>
            </Card>

            {/* Plan Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        {t("planInfo")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-semibold">{plan === "pro" ? t("proPlan") : t("freePlan")}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {plan === "pro" ? t("proDesc") : t("freeDesc")}
                            </p>
                        </div>
                        <Badge variant={plan === "pro" ? "default" : "secondary"} className={plan === "pro" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0" : ""}>
                            {plan === "pro" ? t("proBadge") : t("freeBadge")}
                        </Badge>
                    </div>
                    {plan !== "pro" && (
                        <Button className="w-full gradient-brand text-white border-0 h-11">
                            <Crown className="mr-2 h-4 w-4" />
                            {t("upgradeToPro")} — {tIndex("proPrice")}{tIndex("perMonth")}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Lock className="h-4 w-4 text-zinc-500" />
                        {t("passwordChange")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={handlePasswordReset}>
                        {t("sendResetEmail")}
                    </Button>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-destructive">
                        <ShieldAlert className="h-4 w-4" />
                        {t("dangerZone")}
                    </CardTitle>
                    <CardDescription>{t("dangerZoneDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDialog(true)}>
                        {t("deleteAccount")}
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Hesabınızı silmek istediğinize emin misiniz?
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Bu işlem geri alınamaz. Tüm verileriniz (CV'leriniz, motivasyon mektuplarınız ve ilan takipleriniz) <strong>kalıcı olarak silinecektir</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex sm:justify-between gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            İptal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Evet, Hesabımı Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
