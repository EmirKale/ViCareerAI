import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

// Mock job postings - fallback when API key is not available
function getMockJobs(locale: string) {
    const isTr = locale === "tr";
    return [
        {
            id: "j1",
            title: "Frontend Developer",
            company: "Trendyol",
            location: isTr ? "İstanbul (Hibrit)" : "Istanbul (Hybrid)",
            description: isTr ? "React, TypeScript ve Next.js deneyimi olan Frontend geliştiriciler arıyoruz." : "Looking for Frontend developers with React, TypeScript, and Next.js experience.",
            type: "Full-time",
            matchScore: 94,
            skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
            source: "mock",
            postedAt: formatPostedDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), locale),
            applyLink: "#"
        },
        {
            id: "j2",
            title: "React Native Developer",
            company: "Getir",
            location: isTr ? "Uzaktan" : "Remote",
            description: isTr ? "Mobil uygulama geliştirme alanında React Native deneyimi olan mühendisler arıyoruz." : "Looking for engineers with React Native experience in mobile app development.",
            type: "Full-time",
            matchScore: 88,
            skills: ["React Native", "TypeScript", "Redux", "REST API"],
            source: "mock",
            postedAt: formatPostedDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), locale),
            applyLink: "#"
        },
        {
            id: "j3",
            title: "Full Stack Developer",
            company: "Hepsiburada",
            location: "Istanbul",
            description: isTr ? "Node.js ve React deneyimli, çevik metodolojilere hakim yazılımcılar arıyoruz." : "Looking for software engineers experienced in Node.js and React, familiar with agile methodologies.",
            type: "Full-time",
            matchScore: 82,
            skills: ["Node.js", "React", "PostgreSQL", "Docker"],
            source: "mock",
            postedAt: formatPostedDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), locale),
            applyLink: "#"
        },
        {
            id: "j4",
            title: "Senior UI/UX Developer",
            company: "Insider",
            location: isTr ? "Uzaktan" : "Remote",
            description: isTr ? "Design sistemleri ve kullanıcı deneyimi konusunda uzmanlaşmış geliştiriciler." : "Developers specialized in design systems and user experience.",
            type: "Full-time",
            matchScore: 78,
            skills: ["Figma", "React", "CSS", "A/B Testing"],
            source: "mock",
            postedAt: formatPostedDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), locale),
            applyLink: "#"
        },
        {
            id: "j5",
            title: "Next.js Developer",
            company: "Loodos",
            location: isTr ? "Ankara (Uzaktan)" : "Ankara (Remote)",
            description: isTr ? "Next.js App Router ile yüksek performanslı web uygulamaları geliştirecek mühendis." : "Engineer to develop high-performance web applications using Next.js App Router.",
            type: "Contract",
            matchScore: 90,
            skills: ["Next.js", "Vercel", "TypeScript", "Supabase"],
            source: "mock",
            postedAt: formatPostedDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), locale),
            applyLink: "#"
        },
    ];
}

interface JSearchJob {
    job_id: string;
    job_title: string;
    employer_name: string;
    job_city?: string;
    job_country?: string;
    job_description?: string;
    job_apply_link?: string;
    job_posted_at_datetime_utc?: string;
    job_employment_type?: string;
}

function formatPostedDate(dateString?: string, locale: string = "tr"): string {
    const isTr = locale === "tr";
    if (!dateString) return isTr ? "Bilinmiyor" : "Unknown";
    
    try {
        const posted = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - posted.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return isTr ? "Bugün" : "Today";
        if (diffDays === 1) return isTr ? "1 gün önce" : "1 day ago";
        if (diffDays < 7) return isTr ? `${diffDays} gün önce` : `${diffDays} days ago`;
        if (diffDays < 30) return isTr ? `${Math.floor(diffDays / 7)} hafta önce` : `${Math.floor(diffDays / 7)} weeks ago`;
        return isTr ? `${Math.floor(diffDays / 30)} ay önce` : `${Math.floor(diffDays / 30)} months ago`;
    } catch {
        return isTr ? "Bilinmiyor" : "Unknown";
    }
}

function extractSkills(description?: string): string[] {
    if (!description) return [];
    
    const commonSkills = [
        "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java",
        "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Redis",
        "Next.js", "Vue.js", "Angular", "GraphQL", "REST API", "Git",
        "TailwindCSS", "CSS", "HTML", "SQL", "NoSQL", "Agile", "Scrum"
    ];
    
    const foundSkills = commonSkills.filter(skill => 
        description.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills.slice(0, 6); // Max 6 skills
}

function calculateMatchScore(): number {
    // Random score between 70-95 for demo purposes
    return Math.floor(Math.random() * 26) + 70;
}

import { z } from "zod";

const jobsSearchSchema = z.object({
    query: z.string().trim().max(100).optional().default(""),
    location: z.string().trim().max(100).optional().default(""),
    page: z.number().int().min(1).max(100).optional().default(1),
    locale: z.string().optional().default("tr"),
});

export async function POST(req: NextRequest) {
    try {
        const workType = req.nextUrl.searchParams.get("workType") || "all";
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
        }

        // Rate limit: 60 requests per hour per user
        const limitRes = rateLimit(`jobs-search:${user.id}`, {
            limit: 60,
            windowMs: 60 * 60 * 1000 // 1 hour
        });
        if (!limitRes.success) {
            return NextResponse.json(
                { error: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const parseResult = jobsSearchSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: "Arama parametreleri geçersiz." }, { status: 400 });
        }

        const { query, location, page, locale } = parseResult.data;
        const rapidApiKey = process.env.RAPIDAPI_KEY;

        const mockJobListings = getMockJobs(locale);

        // If no API key, use mock data
        if (!rapidApiKey) {
            let filtered = mockJobListings;
            if (query) {
                const queryWords = query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 0);
                filtered = mockJobListings.filter(job => {
                    const text = (job.title + " " + job.company + " " + job.skills.join(" ")).toLowerCase();
                    return queryWords.some((word: string) => text.includes(word));
                });
            }

            if (workType !== "all") {
                filtered = filtered.filter(job => {
                    const text = (job.title + " " + job.description + " " + job.location).toLowerCase();
                    if (workType === "remote") return text.includes("remote") || text.includes("uzaktan");
                    if (workType === "hybrid") return text.includes("hybrid") || text.includes("hibrit");
                    if (workType === "onsite") return !text.includes("remote") && !text.includes("uzaktan") && !text.includes("hybrid") && !text.includes("hibrit");
                    return true;
                });
            }

            return NextResponse.json({ 
                jobs: filtered,
                source: "mock",
                total: filtered.length 
            });
        }

        // Call JSearch API
        const searchQuery = query || "developer";
        const searchLocation = location || "Turkey";
        const searchPage = page || 1;

        const countryCodeMap: Record<string, string> = {
            'Turkey': 'tr',
            'United States': 'us',
            'United Kingdom': 'gb',
            'Germany': 'de',
            'Netherlands': 'nl'
        };
        const countryCode = countryCodeMap[searchLocation] || 'us';

        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=${searchPage}&num_pages=1&country=${countryCode}`;
        
        const headers = {
            "X-RapidAPI-Key": rapidApiKey,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        };
        
        console.log('REQUEST URL:', url);
        // hide key partially in logs just in case, but follow user instructions
        console.log('REQUEST HEADERS:', { ...headers, "X-RapidAPI-Key": rapidApiKey ? rapidApiKey.substring(0, 5) + "..." : "missing" });

        const response = await fetch(url, {
            method: "GET",
            headers
        });

        const rawText = await response.text();
        console.log('RAW RESPONSE STATUS:', response.status);
        console.log('RAW RESPONSE BODY:', rawText);

        if (!response.ok) {
            console.error(`[JSearch] API Error: ${response.status} ${response.statusText}`);
            // Fallback to mock data on API error
            return NextResponse.json({ 
                jobs: mockJobListings,
                source: "mock_fallback",
                error: "API araması başarısız oldu, örnek ilanlar gösteriliyor."
            });
        }

        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            console.error("JSON parse error on JSearch response:", e);
            data = {};
        }
        const jobs: JSearchJob[] = data.data || [];

        let transformedJobs = jobs.map((job: JSearchJob) => ({
            id: job.job_id,
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city && job.job_country 
                ? `${job.job_city}, ${job.job_country}` 
                : job.job_country || "Remote",
            description: job.job_description?.substring(0, 200) || "No description available",
            type: job.job_employment_type || "Full-time",
            matchScore: calculateMatchScore(),
            skills: extractSkills(job.job_description),
            source: "jsearch",
            postedAt: formatPostedDate(job.job_posted_at_datetime_utc, locale),
            applyLink: job.job_apply_link || "#"
        }));

        if (workType !== "all") {
            transformedJobs = transformedJobs.filter(job => {
                const text = (job.title + " " + job.description + " " + job.location).toLowerCase();
                if (workType === "remote") return text.includes("remote") || text.includes("uzaktan");
                if (workType === "hybrid") return text.includes("hybrid") || text.includes("hibrit");
                if (workType === "onsite") return !text.includes("remote") && !text.includes("uzaktan") && !text.includes("hybrid") && !text.includes("hibrit");
                return true;
            });
        }

        return NextResponse.json({ 
            jobs: transformedJobs,
            source: "jsearch",
            total: transformedJobs.length 
        });

    } catch (error: unknown) {
        console.error("[JSearch] Error:", error);
        
        const mockJobListings = getMockJobs("tr"); // Safe fallback
        // Fallback to mock data on any error
        return NextResponse.json({ 
            jobs: mockJobListings,
            source: "mock_fallback",
            error: "Arama sırasında bir hata oluştu, örnek ilanlar gösteriliyor."
        });
    }
}
