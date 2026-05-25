import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Mock job postings - fallback when API key is not available
const mockJobListings = [
    {
        id: "j1",
        title: "Frontend Developer",
        company: "Trendyol",
        location: "İstanbul (Hibrit)",
        description: "React, TypeScript ve Next.js deneyimi olan Frontend geliştiriciler arıyoruz.",
        type: "Full-time",
        matchScore: 94,
        skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
        source: "mock",
        postedAt: "2 gün önce",
        applyLink: "#"
    },
    {
        id: "j2",
        title: "React Native Developer",
        company: "Getir",
        location: "Uzaktan",
        description: "Mobil uygulama geliştirme alanında React Native deneyimi olan mühendisler arıyoruz.",
        type: "Full-time",
        matchScore: 88,
        skills: ["React Native", "TypeScript", "Redux", "REST API"],
        source: "mock",
        postedAt: "1 gün önce",
        applyLink: "#"
    },
    {
        id: "j3",
        title: "Full Stack Developer",
        company: "Hepsiburada",
        location: "İstanbul",
        description: "Node.js ve React deneyimli, çevik metodolojilere hakim yazılımcılar arıyoruz.",
        type: "Full-time",
        matchScore: 82,
        skills: ["Node.js", "React", "PostgreSQL", "Docker"],
        source: "mock",
        postedAt: "3 gün önce",
        applyLink: "#"
    },
    {
        id: "j4",
        title: "Senior UI/UX Developer",
        company: "Insider",
        location: "Uzaktan",
        description: "Design sistemleri ve kullanıcı deneyimi konusunda uzmanlaşmış geliştiriciler.",
        type: "Full-time",
        matchScore: 78,
        skills: ["Figma", "React", "CSS", "A/B Testing"],
        source: "mock",
        postedAt: "5 gün önce",
        applyLink: "#"
    },
    {
        id: "j5",
        title: "Next.js Developer",
        company: "Loodos",
        location: "Ankara (Uzaktan)",
        description: "Next.js App Router ile yüksek performanslı web uygulamaları geliştirecek mühendis.",
        type: "Contract",
        matchScore: 90,
        skills: ["Next.js", "Vercel", "TypeScript", "Supabase"],
        source: "mock",
        postedAt: "1 gün önce",
        applyLink: "#"
    },
];

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

function formatPostedDate(dateString?: string): string {
    if (!dateString) return "Bilinmiyor";
    
    try {
        const posted = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - posted.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Bugün";
        if (diffDays === 1) return "1 gün önce";
        if (diffDays < 7) return `${diffDays} gün önce`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
        return `${Math.floor(diffDays / 30)} ay önce`;
    } catch {
        return "Bilinmiyor";
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

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        void user; // auth available for future Pro plan gating

        const { query, location, page } = await req.json();
        const rapidApiKey = process.env.RAPIDAPI_KEY;

        // If no API key, use mock data
        if (!rapidApiKey) {
            console.log("[JSearch] No RAPIDAPI_KEY found, using mock data");
            
            const filtered = query
                ? mockJobListings.filter(job =>
                    job.title.toLowerCase().includes(query.toLowerCase()) ||
                    job.skills.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
                    job.company.toLowerCase().includes(query.toLowerCase())
                )
                : mockJobListings;

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

        console.log(`[JSearch] Searching: query="${searchQuery}", location="${searchLocation}", page=${searchPage}`);

        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=${searchPage}&num_pages=1&country=${encodeURIComponent(searchLocation)}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": rapidApiKey,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
            }
        });

        if (!response.ok) {
            console.error(`[JSearch] API Error: ${response.status} ${response.statusText}`);
            // Fallback to mock data on API error
            return NextResponse.json({ 
                jobs: mockJobListings,
                source: "mock_fallback",
                error: "API request failed, showing mock data"
            });
        }

        const data = await response.json();
        const jobs: JSearchJob[] = data.data || [];

        console.log(`[JSearch] Found ${jobs.length} jobs`);

        // Transform JSearch response to our format
        const transformedJobs = jobs.map((job: JSearchJob) => ({
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
            postedAt: formatPostedDate(job.job_posted_at_datetime_utc),
            applyLink: job.job_apply_link || "#"
        }));

        return NextResponse.json({ 
            jobs: transformedJobs,
            source: "jsearch",
            total: transformedJobs.length 
        });

    } catch (error: unknown) {
        console.error("[JSearch] Error:", error);
        
        // Fallback to mock data on any error
        return NextResponse.json({ 
            jobs: mockJobListings,
            source: "mock_fallback",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
