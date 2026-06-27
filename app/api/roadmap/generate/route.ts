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
        const { cvId, fileContent, targetPosition, locale } = body;

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
        const languageOutput = isTr ? 'TURKISH' : 'ENGLISH';

        const prompt = `You are an expert Career Advisor.
CRITICAL REQUIREMENT: You MUST generate all human-readable text in the final JSON (titles, descriptions, categories, insights) in ${languageOutput}.
DO NOT output in any other language.

User's current profile/CV:
${textToAnalyze}

Target position: ${targetPosition || "Not specified (guess based on CV)"}

Create a 4-step career development roadmap for this user. Each step: title, 1 sentence description, status (completed/in_progress/locked), and progress percentage if in progress.
Also provide: an overall skill score (0-100), readiness percentage for 3 sub-categories tailored to the role, and 2 AI insights (1 critical priority, 1 growth opportunity).

Return ONLY in this JSON format:
{
  "overallScore": 84,
  "readiness": {"<Category 1>": 92, "<Category 2>": 68, "<Category 3>": 45},
  "steps": [
    {"title": "...", "description": "...", "status": "completed", "progress": 100},
    {"title": "...", "description": "...", "status": "in_progress", "progress": 65},
    {"title": "...", "description": "...", "status": "locked", "progress": 0},
    {"title": "...", "description": "...", "status": "locked", "progress": 0}
  ],
  "insights": [
    {"type": "critical", "title": "...", "description": "..."},
    {"type": "growth", "title": "...", "description": "..."}
  ]
}

REMEMBER: All text content (inside the placeholders "..." and "<Category N>") MUST be in ${languageOutput}.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.5,
        });

        const resultContent = completion.choices[0]?.message?.content || "{}";
        const parsedData = JSON.parse(resultContent);

        // Save to roadmap_analysis
        const { data: analysisResult, error: insertError } = await supabase.from("roadmap_analysis").insert({
            user_id: user.id,
            target_position: targetPosition || "Tahmini Pozisyon",
            overall_score: parsedData.overallScore,
            readiness: parsedData.readiness,
            steps: parsedData.steps,
            insights: parsedData.insights,
            source: source
            // language: locale || 'tr'
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
        console.error("Roadmap Generate Error:", error);
        return NextResponse.json({ error: "Analiz sırasında hata oluştu." }, { status: 500 });
    }
}
