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

        const { jobText, locale } = await request.json();

        if (!jobText || jobText.length < 30) {
            return NextResponse.json(
                { error: "İlan metni çok kısa veya boş. / Job description is too short or empty." },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API anahtarı yapılandırılmamış." },
                { status: 503 }
            );
        }

        const isTr = locale === 'tr';
        const languageOutput = isTr ? 'TURKISH' : 'ENGLISH';

        const prompt = `You are an expert recruitment analyst. Analyze the following job description and return the result in JSON format.
CRITICAL REQUIREMENT: You MUST generate all human-readable text (summary, responsibilities, string lists) in ${languageOutput}.
DO NOT output in any other language.

Job Description:
${jobText}

Return ONLY valid JSON in this exact structure, with no markdown formatting:
{
  "title": "...",
  "company": "...",
  "location": "...",
  "type": "...",
  "requiredSkills": ["...", "..."],
  "niceToHaveSkills": ["..."],
  "experience": "...",
  "education": "...",
  "responsibilities": ["...", "..."],
  "summary": "...",
  "atsKeywords": ["...", "..."]
}
REMEMBER: All human-readable text content inside the placeholders "..." MUST be in ${languageOutput}.`;

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
