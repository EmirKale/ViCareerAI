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

        const languageInstruction = locale === 'tr' 
            ? 'CRITICAL: TÜM çıktıyı (başlıklar, açıklamalar, içgörüler, vb.) TÜRKÇE olarak üret. İngilizce kelime kullanma.'
            : 'CRITICAL: Generate ALL output (titles, descriptions, insights, etc.) in ENGLISH.';

        const prompt = `${languageInstruction}

Kullanıcının özgeçmişi:
${textToAnalyze}

Hedeflenen Rol/Pozisyon: ${targetRole || "Belirtilmemiş, CV'den tahmin et"}

Sen uzman bir Kariyer Danışmanısın. Kullanıcının özgeçmişini, hedeflediği pozisyona ne kadar uygun olduğu açısından değerlendireceksin. 
Aşağıdaki metrikleri ve alanları JSON olarak döndür:
1. overall_score (0-100)
2. scores nesnesi (technical_skills, problem_solving, leadership, communication, adaptability, target_role) (her biri 0-100)
3. ats_score (0-100) - Özgeçmişin ATS sistemleri (Applicant Tracking System) okunabilirliği
4. insight (1 cümlelik temel analiz sonucu)
5. superpower nesnesi (title, description) - adayın en güçlü yanı
6. red_flags dizisi - her biri string uyarı (Örn: "Eksik tarih formatı", "Sektör dışı jargon")
7. corrections dizisi - (original_text, improved_text, reason)
8. action_plan dizisi - hemen yapılması gereken 3 şey (her biri string)
9. recommendations dizisi (her biri: title, description, id(s1/s2 vb.))

SADECE şu JSON formatında dön, başka hiçbir metin ekleme:
{
  "scores": {
    "technical_skills": 85, "communication": 70, "adaptability": 75, "problem_solving": 90, "leadership": 60
  },
  "overall_score": 78,
  "insight": "...",
  "superpower": {"title": "...", "description": "..."},
  "ats_score": 85,
  "action_plan": ["Hemen bugün React yeteneklerini GitHub'da sergile", "Özgeçmişindeki x projesini daha detaylandır", "A firmasına uygun bir ön yazı hazırla"],
  "cv_corrections": [
    {
      "original": "Projeyi yönettim",
      "improved": "10 kişilik ekibi Agile metodolojisiyle yöneterek ürünün teslim süresini %20 hızlandırdım",
      "reason": "Etki ve metrik eksikliği"
    }
  ],
  "recommendations": [
    {"title": "Docker Öğren", "description": "Mikroservis mimarisini anlamak için Docker öğren.", "category": "Teknik"}
  ]
}

CV Verisi:
${textToAnalyze}

${languageInstruction}
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
