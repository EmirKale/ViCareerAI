import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data, error } = await supabase
            .from("usage_quotas")
            .select("cv_count, letter_count, analysis_count, cover_letter_count")
            .eq("user_id", user.id)
            .single();

        if (error && error.code === "PGRST116") {
            // Row doesn't exist yet, return zeros
            return NextResponse.json({ 
                cv_count: 0, 
                letter_count: 0, 
                analysis_count: 0,
                cover_letter_count: 0 
            });
        }

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
