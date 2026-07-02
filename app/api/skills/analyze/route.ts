import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: "Supabase configuration missing" }, { status: 503 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { cvId, fileContent, targetRole, locale } = body;

        if (!cvId && !fileContent) {
            return NextResponse.json({ error: "cvId or fileContent is required" }, { status: 400 });
        }

        // Check plan and quota
        const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        const isFree = profile?.plan === "free" || !profile?.plan;

        if (isFree) {
            const { data: quota } = await supabase.from("usage_quotas").select("analysis_count").eq("user_id", user.id).single();
            if (quota && quota.analysis_count >= 1) {
                return NextResponse.json({ error: "Aylık analiz limitinizi doldurdunuz. Sınırsız analiz için Pro plana geçin." }, { status: 403 });
            }
        }

        let textToAnalyze = "";
        let source: "cv" | "upload" = "cv";

        if (cvId) {
            const { data: cv } = await supabase.from("cvs").select("data").eq("id", cvId).eq("user_id", user.id).single();
            if (!cv) {
                return NextResponse.json({ error: "CV not found" }, { status: 404 });
            }
            textToAnalyze = JSON.stringify(cv.data);
            source = "cv";
        } else {
            textToAnalyze = fileContent;
            source = "upload";
        }

        // Limit text length
        textToAnalyze = textToAnalyze.slice(0, 15000);

        const isTr = locale === 'tr';

        const turkishEnforcement = isTr
            ? `ÖNEMLİ: Bu yanıtın TAMAMINI (tüm başlıklar, açıklamalar, kategori isimleri, içgörüler, kırmızı bayraklar, aksiyon planları, CV düzeltmeleri) SADECE TÜRKÇE olarak yaz. Tek bir İngilizce kelime bile kullanma. İngilizce teknoloji isimleri (React, Python, AWS, Docker gibi) ve platform/kurs isimlerini (Udemy, Coursera, freeCodeCamp vb.) özel isim olduğu için çevirmeden OLDUĞU GİBİ bırak, geri kalan her şey Türkçe olsun.\n\n`
            : `NOTE: Keep platform/course names (Udemy, Coursera, freeCodeCamp etc.) and technology names in their original terms. Do not translate them.\n\n`;

        const languageOutput = isTr ? 'TURKISH' : 'ENGLISH';

        const prompt = `${turkishEnforcement}You are an expert Career Advisor and CV Analyst.
CRITICAL REQUIREMENT: You MUST generate all human-readable text in the final JSON in ${languageOutput}.
DO NOT output in any other language.

User's CV:
${textToAnalyze}

Target Role/Position: ${targetRole || "Not specified, guess from CV"}

Evaluate the user's CV thoroughly. Provide a comprehensive, deeply specific analysis.

IMPORTANT DISTINCTIONS:
- "ats_feedback": ONLY ATS-specific technical issues (missing keywords, formatting problems, lack of quantified metrics, section naming issues)
- "red_flags": ONLY career/content concerns (experience gaps, project depth issues, role progression, missing certifications, weak positioning)
These two lists must NOT overlap or repeat similar points.

- "insights": Provide 3-4 SEPARATE insight objects. Each focuses on a DIFFERENT finding from the CV. Include at least 1 "strength", 1 "weakness", and 1 "opportunity". Reference SPECIFIC details from the CV.

- "competency_reasoning": For each of the 6 radar chart categories, provide a 1-sentence explanation of WHY that score was given, referencing specific CV content.

- "action_plan": Each item must have a title, a description explaining WHY this step is a priority (tied to a specific CV gap), and a concrete resource recommendation.

Return ONLY in this JSON format:
{
  "scores": {
    "technical_skills": 85,
    "communication": 70,
    "adaptability": 75,
    "problem_solving": 90,
    "collaboration": 65,
    "leadership": 60
  },
  "competency_reasoning": {
    "technical_skills": "${isTr ? 'Neden bu puan...' : 'Why this score...'}",
    "communication": "...",
    "adaptability": "...",
    "problem_solving": "...",
    "collaboration": "...",
    "leadership": "..."
  },
  "overall_score": 78,
  "insights": [
    {"type": "strength", "title": "...", "description": "..."},
    {"type": "weakness", "title": "...", "description": "..."},
    {"type": "opportunity", "title": "...", "description": "..."},
    {"type": "critical", "title": "...", "description": "..."}
  ],
  "superpower": {"title": "...", "description": "..."},
  "ats_score": 65,
  "ats_feedback": ["...", "...", "..."],
  "red_flags": ["...", "...", "..."],
  "action_plan": [
    {"title": "...", "description": "...", "resource": "..."},
    {"title": "...", "description": "...", "resource": "..."},
    {"title": "...", "description": "...", "resource": "..."}
  ],
  "cv_corrections": [
    {"original": "...", "improved": "...", "reason": "..."}
  ],
  "recommendations": [
    {"title": "...", "description": "...", "category": "..."}
  ]
}

REMEMBER: All text content MUST be in ${languageOutput}. Be deeply specific — reference actual CV content, not generic advice.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.5,
            max_tokens: 3000,
        });

        const resultContent = completion.choices[0]?.message?.content || "{}";
        const parsedData = JSON.parse(resultContent);

        const extendedScores = {
            ...parsedData.scores,
            target_role: targetRole || null,
            superpower: parsedData.superpower || null,
            ats_score: parsedData.ats_score || null,
            ats_feedback: parsedData.ats_feedback || [],
            red_flags: parsedData.red_flags || [],
            action_plan: parsedData.action_plan || [],
            cv_corrections: parsedData.cv_corrections || [],
            competency_reasoning: parsedData.competency_reasoning || {}
        };

        // Support both new array format and legacy single string for insight
        const insightValue = Array.isArray(parsedData.insights) 
            ? JSON.stringify(parsedData.insights)
            : parsedData.insight || parsedData.insights || '';

        // Save to skills_analysis
        const { data: analysisResult, error: insertError } = await supabase.from("skills_analysis").insert({
            user_id: user.id,
            scores: extendedScores,
            overall_score: parsedData.overall_score,
            insight: insightValue,
            recommendations: parsedData.recommendations,
            source: source
        }).select().single();

        if (insertError) {
            console.error("Insert Error:", insertError);
            return NextResponse.json({ error: "Veritabanına kaydedilirken hata oluştu." }, { status: 500 });
        }

        // Increment quota if free
        if (isFree) {
            const { data: quota } = await supabase.from("usage_quotas").select("analysis_count").eq("user_id", user.id).single();
            if (quota) {
                await supabase.from("usage_quotas").update({ analysis_count: quota.analysis_count + 1 }).eq("user_id", user.id);
            }
        }

        return NextResponse.json({ success: true, data: analysisResult });

    } catch (error: unknown) {
        console.error("Skills Analyze Error:", error);
        return NextResponse.json({ error: "Analiz sırasında hata oluştu." }, { status: 500 });
    }
}
