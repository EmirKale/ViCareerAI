import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const coverLetterSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(1, "Başlık boş olamaz").max(200, "Başlık çok uzun").optional(),
    position: z.string().trim().min(1, "Pozisyon boş olamaz").max(100),
    company: z.string().trim().min(1, "Şirket boş olamaz").max(100),
    language: z.string().trim().min(1).max(10),
    tone: z.string().trim().min(1).max(50),
    content: z.string().trim().min(1, "İçerik boş olamaz"),
});

export async function POST(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: "Supabase anahtarları eksik. Lütfen ortam değişkenlerini ayarlayın." },
                { status: 503 }
            );
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
        }

        const body = await request.json();
        const parseResult = coverLetterSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
        }

        const { id, title, position, company, language, tone, content } = parseResult.data;

        if (id) {
            const { error } = await supabase
                .from("cover_letters")
                .update({ title, position, company, language, tone, content, updated_at: new Date().toISOString() })
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) throw error;
            return NextResponse.json({ success: true, id });
        } else {
            const { data: newLetter, error } = await supabase
                .from("cover_letters")
                .insert({
                    user_id: user.id,
                    title: title || `${company} - ${position}`,
                    position,
                    company,
                    language,
                    tone,
                    content
                })
                .select("id")
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, id: newLetter.id });
        }
    } catch (error: unknown) {
        console.error("Save Cover Letter Error:", error);
        return NextResponse.json({ error: "Mektup kaydedilirken hata oluştu." }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) return NextResponse.json([], { status: 200 });

        const cookieStore = await cookies();
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { /* ... */ }
            },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json([], { status: 401 });

        const { data, error } = await supabase
            .from("cover_letters")
            .select("id, title, position, company, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Mektuplar getirilemedi." }, { status: 500 });
    }
}
