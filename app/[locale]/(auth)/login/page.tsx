"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();
    const t = useTranslations("Auth");
    const locale = useLocale();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleEmailLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
            return;
        }

        toast.success(t("successLogin"));
        router.push("/dashboard");
        setIsLoading(false);
    }

    async function handleGoogleLogin() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/${locale}/callback`,
            },
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[#131315] text-white">
            <Card className="w-full max-w-sm bg-[#1c1b1d] border-white/[0.06] shadow-2xl rounded-lg">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold">{t("loginTitle")}</CardTitle>
                    <CardDescription className="text-[#A1A1AA]">{t("loginDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-[#131315] border-white/[0.06] rounded-lg text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t("password")}</Label>
                                <Link href="#" className="text-sm text-[#2563EB] hover:underline">
                                    {t("forgotPassword")}
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-[#131315] border-white/[0.06] rounded-lg text-white"
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-lg bg-[#2563EB] hover:bg-[#1E40AF] text-white" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("loginButton")}
                        </Button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/[0.06]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#1c1b1d] px-2 text-[#A1A1AA]">{t("or")}</span>
                        </div>
                    </div>

                    <Button variant="outline" type="button" className="w-full rounded-lg bg-[#131315] border-white/[0.06] text-white hover:bg-white/5" onClick={handleGoogleLogin}>
                        {t("googleContinue")}
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm text-[#A1A1AA]">
                    <p>
                        {t("noAccount")}{" "}
                        <Link href="/register" className="text-[#2563EB] hover:underline font-medium">
                            {t("registerButton")}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
