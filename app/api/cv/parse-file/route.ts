import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OpenAI from "openai";
import mammoth from "mammoth";

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

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string; // 'certificate' or 'project' or 'raw'

        if (!file || !type) {
            return NextResponse.json({ error: "File and type are required" }, { status: 400 });
        }

        let extractedText = "";
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
            const PDFParser = require("pdf2json");
            extractedText = await new Promise<string>((resolve, reject) => {
                const pdfParser = new PDFParser(null, 1);
                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", () => {
                    resolve(pdfParser.getRawTextContent());
                });
                pdfParser.parseBuffer(buffer);
            });
        } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
            extractedText = buffer.toString("utf-8");
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer: buffer });
            extractedText = result.value;
        } else {
            return NextResponse.json({ error: "Sadece PDF, DOCX ve TXT dosyaları desteklenir." }, { status: 400 });
        }

        if (!extractedText || extractedText.trim() === "") {
            return NextResponse.json({ error: "Dosyadan metin çıkarılamadı." }, { status: 400 });
        }

        // Limit text length to avoid token limits
        const textToAnalyze = extractedText.slice(0, 15000);

        if (type === "raw") {
            return NextResponse.json({ success: true, text: textToAnalyze });
        }

        let systemPrompt = "";
        let jsonFormat = "";

        if (type === "certificate") {
            systemPrompt = `You are an AI that extracts certificate information from text.
Extract the following fields and return as JSON:
- name: The name or title of the certificate
- issuer: The organization or institution that issued the certificate
- date: The date of issue (e.g., "Aralık 2023" or "2023")
If a field is missing, leave it empty ("").`;
            jsonFormat = `{"name": "", "issuer": "", "date": ""}`;
        } else if (type === "project") {
            systemPrompt = `You are an AI that extracts software/work project information from text.
Extract the following fields and return as JSON:
- name: The name of the project
- technologies: Technologies, languages, or tools used (comma separated)
- description: A short description of the project and what was done
If a field is missing, leave it empty ("").`;
            jsonFormat = `{"name": "", "technologies": "", "description": ""}`;
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt + "\nOutput MUST be strictly JSON format: " + jsonFormat },
                { role: "user", content: "Extract information from this text:\n\n" + textToAnalyze }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
        });

        const resultContent = completion.choices[0]?.message?.content || "{}";
        const parsedData = JSON.parse(resultContent);

        return NextResponse.json({ success: true, data: parsedData });

    } catch (error: unknown) {
        console.error("Parse Error:", error);
        return NextResponse.json({ 
            error: "Dosya parse edilirken hata oluştu.", 
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}
