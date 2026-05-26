import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized. Please login." },
                { status: 401 }
            );
        }

        // Quota check for free plan users
        const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();
        
        if (profile?.plan === 'free') {
            let { data: quota } = await supabase
                .from('usage_quotas')
                .select('cover_letter_count')
                .eq('user_id', user.id)
                .single();
            
            if (!quota) {
                // Create quota record if doesn't exist
                await supabase.from('usage_quotas').insert({ user_id: user.id });
                quota = { cover_letter_count: 0 };
            }
            
            if (quota.cover_letter_count >= 3) {
                return NextResponse.json(
                    { 
                        error: "Cover letter limitinize ulaştınız. Pro plana geçerek sınırsız mektup oluşturabilirsiniz.",
                        code: "QUOTA_EXCEEDED" 
                    },
                    { status: 429 }
                );
            }
        }

        const body = await request.json();
        const { position, company, industry, tone, language, userSummary } = body;

        if (!position || !company) {
            return NextResponse.json(
                { error: "Pozisyon ve şirket adı zorunludur." },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API anahtarı yapılandırılmamış." },
                { status: 503 }
            );
        }

        const toneMap: Record<string, string> = {
            professional: "profesyonel ve resmi",
            friendly: "samimi ve içten",
            confident: "özgüvenli ve iddialı",
            creative: "yaratıcı ve özgün",
        };

        const selectedTone = toneMap[tone] || "profesyonel";
        const selectedLanguage = language === "en" ? "English" : "Türkçe";

        const systemPrompt = `Sen deneyimli bir kariyer koçu ve profesyonel yazarsın. 
Kullanıcılara ATS uyumlu, ikna edici ve özgün motivasyon mektupları yazıyorsun. 
Mektuplar ${selectedLanguage} olmalı, üslubu ${selectedTone} olmalı.
Klinik ifadelerden kaçın, gerçekçi ve insan sesi taşıyan metinler yaz.
Mektubun yapısı: Açılış paragrafı (dikkat çekici), Orta paragraflar (deneyim+değer önerisi), Kapanış (CTA).`;

        const userPrompt = `Aşağıdaki bilgileri kullanarak bir motivasyon mektubu yaz:
- Hedef Pozisyon: ${position}
- Şirket Adı: ${company}
- Sektör: ${industry || "belirtilmedi"}
- Hakkımda (kullanıcı notları): ${userSummary || "belirtilmedi"}

Mektup ${selectedLanguage} dilinde ve ${selectedTone} bir üslupla yazılmalı. 
Sadece mektubu yaz, başlık veya açıklama ekleme.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const letter = completion.choices[0]?.message?.content;

        if (!letter) {
            return NextResponse.json(
                { error: "Mektup üretilemedi." },
                { status: 500 }
            );
        }

        // Increment quota for free users
        if (profile?.plan === 'free') {
            const { data: quota } = await supabase
                .from('usage_quotas')
                .select('cover_letter_count')
                .eq('user_id', user.id)
                .single();
            
            if (quota) {
                await supabase
                    .from('usage_quotas')
                    .update({ cover_letter_count: (quota.cover_letter_count || 0) + 1 })
                    .eq('user_id', user.id);
            }
        }

        return NextResponse.json({ letter });
    } catch (error: unknown) {
        console.error("Cover letter generation error:", error);
        return NextResponse.json(
            { error: "Mektup oluşturulurken hata oluştu." },
            { status: 500 }
        );
    }
}
