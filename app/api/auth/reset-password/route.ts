import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ error: "E-posta adresi gerekli." }, { status: 400 });
        }

        const supabase = await createClient();

        // Get the NEXT_PUBLIC_APP_URL, clean it up if it ends with /en or /tr
        let appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
        if (appUrl) {
            // Strip trailing locale or slashes
            appUrl = appUrl.replace(/\/(en|tr)\/?$/, "");
            appUrl = appUrl.replace(/\/$/, "");
        } else {
            // fallback if not set
            appUrl = "http://localhost:3000";
        }

        // Redirect URL format: appUrl + callback
        // The middleware and callback endpoint will redirect the user to profile page or login
        const redirectUrl = `${appUrl}/tr/callback?next=/profile`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Password reset error:", error);
        return NextResponse.json({ error: error?.message || "E-posta gönderilirken hata oluştu." }, { status: 500 });
    }
}
