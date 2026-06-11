import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const aiSuggestSchema = z.object({
    rawText: z.string().trim().min(1, "Geliştirilecek metin boş olamaz").max(2000, "Geliştirilecek metin çok uzun"),
    sectionType: z.string().trim().max(100).optional(),
    targetPosition: z.string().trim().max(100).optional(),
});

// Dışarıdan enjecte edilen OpenAI key. Eğer yoksa mock data döneceğiz veya hata vereceğiz.
const openaiApiKey = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll() { /* Ignore */ },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate limit: 20 requests per hour per user
        const limitRes = rateLimit(`ai-suggest:${user.id}`, {
            limit: 20,
            windowMs: 60 * 60 * 1000 // 1 hour
        });
        if (!limitRes.success) {
            return NextResponse.json(
                { error: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const parseResult = aiSuggestSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
        }

        const { rawText, sectionType, targetPosition } = parseResult.data;

        // Quota check
        const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
        if (profile?.plan === 'free') {
            let { data: quota } = await supabase.from('usage_quotas').select('analysis_count').eq('user_id', user.id).single();
            if (!quota) {
                await supabase.from('usage_quotas').insert({ user_id: user.id });
                quota = { analysis_count: 0 };
            }
            if (quota.analysis_count >= 5) {
                return NextResponse.json({ error: "Ücretsiz plan AI kullanım hakkınızı (5 defa) doldurdunuz. Sınırsız kullanım için Pro plana geçin." }, { status: 403 });
            }
        }

        const isSummary = sectionType === "Profesyonel Özet" || sectionType === "summary";

        if (!openaiApiKey) {
            // Mock response if OPENAI_API_KEY is not set (for developmental testing)
            console.warn("OPENAI_API_KEY is not set. Returning mock data.");
            await new Promise(r => setTimeout(r, 1500)); // simulate delay
            
            // Increment quota mock
            if (profile?.plan === 'free') {
                const { data: quota } = await supabase.from('usage_quotas').select('analysis_count').eq('user_id', user.id).single();
                if (quota) {
                    await supabase.from('usage_quotas').update({ analysis_count: quota.analysis_count + 1 }).eq('user_id', user.id);
                }
            }

            if (isSummary) {
                return NextResponse.json({
                    suggestion: `Yapay zeka tarafından optimize edilmiş, profesyonel tek paragraf özet metni. Adayın ${targetPosition || 'sektör'} alanındaki yetkinliklerini vurgular.`
                });
            }

            return NextResponse.json({
                suggestion: `${targetPosition || 'Uzman'} rolüne uygun şekilde yeniden yazıldı: ${rawText}`
            });
        }

        const openai = new OpenAI({ apiKey: openaiApiKey });

        const systemPrompt = "Sen profesyonel bir CV danışmanısın. Kullanıcının girdiği ham metni daha profesyonel, IK tarafında dikkat çekici ve etkili bir dille yeniden yazacaksın. Çıktı olarak SADECE ve DOĞRUDAN iyileştirilmiş metni ver. Herhangi bir JSON, dizi, açıklama, ek metin veya markdown biçimlendirmesi kullanma.";

        let userPrompt = `Lütfen şu metni profesyonelleştir:\n\n"${rawText}"\n\nBölüm: ${sectionType || 'Bilinmiyor'}\n`;
        if (targetPosition) {
            userPrompt += `Hedef başvuru pozisyonu: ${targetPosition}. Lütfen bu metni bu pozisyona özel olarak vurgularla iyileştir.`;
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-4o-mini", // Faster and cheaper
            temperature: 0.7
        });

        let resultText = completion.choices[0].message.content?.trim() || rawText;
        
        // Temizleme: Eğer AI hala tırnak içinde verdiyse baştaki sondaki tırnakları al
        if (resultText.startsWith('"') && resultText.endsWith('"')) {
            resultText = resultText.slice(1, -1);
        }

        // Increment quota
        if (profile?.plan === 'free') {
            const { data: quota } = await supabase.from('usage_quotas').select('analysis_count').eq('user_id', user.id).single();
            if (quota) {
                await supabase.from('usage_quotas').update({ analysis_count: quota.analysis_count + 1 }).eq('user_id', user.id);
            }
        }

        return NextResponse.json({ suggestion: resultText });

    } catch (error) {
        console.error("AI Suggest API Error:", error);
        return NextResponse.json(
            { error: "İçerik önerisi oluşturulurken bir hata meydana geldi." },
            { status: 500 }
        );
    }
}
