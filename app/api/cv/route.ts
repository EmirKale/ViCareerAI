import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const cvPostSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(1, "Başlık boş olamaz").max(200, "Başlık çok uzun").optional(),
    template: z.string().trim().min(1, "Şablon seçilmelidir").max(50).optional(),
    data: z.record(z.string(), z.any()).optional().default({}),
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
        const parseResult = cvPostSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
        }

        const { id, title, template, data } = parseResult.data;

        if (id) {
            // Update existing CV
            const { error } = await supabase
                .from("cvs")
                .update({ title, template, data, updated_at: new Date().toISOString() })
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) throw error;
            return NextResponse.json({ success: true, id });
        } else {
            // Create new CV (check Quotas for 'free' users first)
            const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
            
            if (profile?.plan === 'free') {
                let { data: quota } = await supabase.from('usage_quotas').select('cv_count').eq('user_id', user.id).single();
                if (!quota) {
                    await supabase.from('usage_quotas').insert({ user_id: user.id });
                    quota = { cv_count: 0 };
                }
                if (quota.cv_count >= 2) {
                    return NextResponse.json({ error: "Ücretsiz plan limitine (2 CV) ulaştınız. Lütfen Pro plana geçin." }, { status: 403 });
                }
            }

            const { data: newCv, error } = await supabase
                .from("cvs")
                .insert({
                    user_id: user.id,
                    title: title || "Yeni CV",
                    template: template || "classic",
                    data: data || {},
                })
                .select("id")
                .single();

            if (error) throw error;
            
            // Increment quota for free users
            if (profile?.plan === 'free') {
                const { data: quota } = await supabase.from('usage_quotas').select('cv_count').eq('user_id', user.id).single();
                if (quota) {
                    await supabase.from('usage_quotas').update({ cv_count: quota.cv_count + 1 }).eq('user_id', user.id);
                }
            }

            return NextResponse.json({ success: true, id: newCv.id });
        }
    } catch (error: unknown) {
        console.error("Save CV Error:", error);
        return NextResponse.json({ error: "CV kaydedilirken hata oluştu." }, { status: 500 });
    }
}

export async function GET() {
    // Get all CVs for the user
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
            .from("cvs")
            .select("id, title, template, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "CV'ler getirilemedi." }, { status: 500 });
    }
}
