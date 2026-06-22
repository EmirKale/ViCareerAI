import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const results: Record<string, unknown> = {
            experience: [],
            education: [],
            skills: []
        };

        for (const [, value] of formData.entries()) {
            if (value instanceof File && value.name.endsWith('.csv')) {
                const text = await value.text();
                const records: Record<string, string>[] = parse(text, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                });

                if (records.length === 0) continue;

                const headers = Object.keys(records[0]);

                if (headers.includes('Company Name') && headers.includes('Title')) {
                    // Positions.csv
                    results.experience = records.map((record: Record<string, unknown>) => ({
                        id: crypto.randomUUID(),
                        title: record['Title'] as string,
                        company: record['Company Name'] as string,
                        location: (record['Location'] as string) || '',
                        startDate: (record['Started On'] as string) || '',
                        endDate: (record['Finished On'] as string) || '',
                        isCurrent: !record['Finished On'],
                        description: (record['Description'] as string) || ''
                    }));
                } 
                else if (headers.includes('School Name') && headers.includes('Degree Name')) {
                    // Education.csv
                    results.education = records.map((record: Record<string, unknown>) => ({
                        id: crypto.randomUUID(),
                        degree: (record['Degree Name'] as string) || 'Derece Belirtilmemiş',
                        school: record['School Name'] as string,
                        startDate: (record['Started On'] as string) || '',
                        endDate: (record['Finished On'] as string) || '',
                        description: (record['Notes'] as string) || ''
                    }));
                }
                else if (headers.includes('Name')) {
                    // Skills.csv
                    results.skills = records.map((record: Record<string, unknown>) => ({
                        id: crypto.randomUUID(),
                        name: record['Name'] as string
                    }));
                }
            }
        }

        return NextResponse.json(results);
    } catch (error: unknown) {
        console.error("LinkedIn CSV Import Error:", error);
        return NextResponse.json({ error: "Dosya okuma veya ayrıştırma hatası: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}
