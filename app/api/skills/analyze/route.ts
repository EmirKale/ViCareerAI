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
        const languageOutput = isTr ? 'TURKISH' : 'ENGLISH';

        const prompt = `You are an expert Career Advisor.
CRITICAL REQUIREMENT: You MUST generate all human-readable text in the final JSON (insight, superpower descriptions, red_flags, corrections, recommendations, action_plan) in ${languageOutput}.
DO NOT output in any other language.

User's CV:
${textToAnalyze}

Target Role/Position: ${targetRole || "Not specified, guess from CV"}

Evaluate the user's CV based on their suitability for the target position.
Return ONLY in this JSON format, exactly matching these keys (values should be translated to ${languageOutput}):
{
  "scores": {
    "technical_skills": 85, "communication": 70, "adaptability": 75, "problem_solving": 90, "leadership": 60
  },
  "overall_score": 78,
  "insight": "...",
  "superpower": {"title": "...", "description": "..."},
  "ats_score": 85,
  "action_plan": ["...", "...", "..."],
  "cv_corrections": [
    {
      "original": "...",
      "improved": "...",
      "reason": "..."
    }
  ],
  "recommendations": [
    {"title": "...", "description": "...", "category": "..."}
  ]
}

REMEMBER: All human-readable text content (inside the placeholders "...") MUST be in ${languageOutput}.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.5,
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
            cv_corrections: parsedData.cv_corrections || []
        };

        // Save to skills_analysis
        const { data: analysisResult, error: insertError } = await supabase.from("skills_analysis").insert({
            user_id: user.id,
            scores: extendedScores,
            overall_score: parsedData.overallScore,
            insight: parsedData.insight,
            recommendations: parsedData.recommendations,
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
        console.error("Skills Analyze Error:", error);
        return NextResponse.json({ error: "Analiz sırasında hata oluştu." }, { status: 500 });
    }
}
