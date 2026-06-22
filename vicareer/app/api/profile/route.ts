import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const profilePatchSchema = z.object({
    full_name: z.string().trim().min(1, "Ad Soyad boş olamaz").max(200, "Ad Soyad çok uzun"),
});

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data, error } = await supabase
            .from("profiles")
            .select("full_name, email, plan, subscription_status")
            .eq("id", user.id)
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error("[PROFILE_GET_ERROR]", error);
        return NextResponse.json({ error: "Profil bilgileri alınamadı." }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const parseResult = profilePatchSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
        }

        const { full_name } = parseResult.data;

        const { error } = await supabase
            .from("profiles")
            .update({ full_name, updated_at: new Date().toISOString() })
            .eq("id", user.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("[PROFILE_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Profil güncellenemedi." }, { status: 500 });
    }
}

