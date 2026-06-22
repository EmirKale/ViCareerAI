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

        const { jobText } = await request.json();

        if (!jobText || jobText.length < 30) {
            return NextResponse.json(
                { error: "İlan metni çok kısa veya boş." },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API anahtarı yapılandırılmamış." },
                { status: 503 }
            );
        }

        const prompt = `Aşağıdaki iş ilanını analiz et ve JSON formatında döndür.

İlan Metni:
${jobText}

Yanıtı SADECE geçerli JSON olarak döndür, başka açıklama ekleme:
{
  "title": "pozisyon adı",
  "company": "şirket adı veya null",
  "location": "konum veya null",
  "type": "tam zamanlı / yarı zamanlı / uzaktan / hibrit",
  "requiredSkills": ["beceri1", "beceri2"],
  "niceToHaveSkills": ["beceri1"],
  "experience": "deneyim süresi",
  "education": "eğitim gereksinimi veya null",
  "responsibilities": ["Sorumluluk 1", "Sorumluluk 2"],
  "summary": "İlanın 2-3 cümlelik kısa özeti",
  "atsKeywords": ["anahtar1", "anahtar2", "anahtar3"]
}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 1000,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("API yanıt vermedi.");

        const parsed = JSON.parse(content);
        return NextResponse.json(parsed);
    } catch (error: unknown) {
        console.error("Job analyze error:", error);
        return NextResponse.json(
            { error: "İlan analiz edilirken hata oluştu." },
            { status: 500 }
        );
    }
}
