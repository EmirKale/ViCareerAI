import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    fonts: [
        { src: '/fonts/Roboto-Regular.ttf' },
        { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' }
    ]
});

export const getSummaryText = (summary: string | Record<string, unknown> | undefined): string => {
    if (!summary) return '';
    if (typeof summary === 'string') {
        try {
            const parsed = JSON.parse(summary);
            return parsed['Profesyonel Özet'] 
                || parsed['profesyonel_ozet'] 
                || parsed.summary 
                || summary;
        } catch {
            return summary;
        }
    }
    const obj = summary as Record<string, string>;
    return obj?.['Profesyonel Özet'] || obj?.profesyonel_ozet || obj?.summary || String(summary);
};

// --------------------------------
// Shared Data Types
// --------------------------------
export interface ExperienceItem {
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
}

export interface EducationItem {
    id: string;
    degree: string;
    school: string;
    location?: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface SkillItem {
    id: string;
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ProjectItem {
    id: string;
    name: string;
    description: string;
    url?: string;
    technologies?: string;
}

export interface CertificateItem {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
}

export interface CVData {
    personal: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        linkedin: string;
        website: string;
        location?: string;
        summary?: string;
    };
    summary: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    skills: SkillItem[];
    projects?: ProjectItem[];
    certificates?: CertificateItem[];
}

// --------------------------------
// Classic Template Styles
// --------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Roboto',
    },
    header: {
        marginBottom: 20,
        borderBottom: '1.5pt solid #2563EB',
        paddingBottom: 14,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    title: {
        fontSize: 13,
        color: '#2563EB',
        marginTop: 3,
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 12,
    },
    contactItem: {
        fontSize: 9,
        color: '#6b7280',
    },
    section: {
        marginTop: 14,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#1E3A5F',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        borderBottom: '0.5pt solid #DBEAFE',
        paddingBottom: 4,
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 9.5,
        color: '#374151',
        lineHeight: 1.6,
    },
    // Experience
    expItem: {
        marginBottom: 10,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    expTitle: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    expCompany: {
        fontSize: 9.5,
        color: '#2563EB',
        marginTop: 1,
    },
    expDate: {
        fontSize: 8.5,
        color: '#9CA3AF',
    },
    expDesc: {
        fontSize: 9,
        color: '#4B5563',
        lineHeight: 1.5,
        marginTop: 4,
    },
    // Education
    eduItem: {
        marginBottom: 8,
    },
    eduDegree: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    eduSchool: {
        fontSize: 9.5,
        color: '#6B7280',
        marginTop: 1,
    },
    // Skills
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        fontSize: 8.5,
        color: '#1D4ED8',
        backgroundColor: '#EFF6FF',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    projItem: {
        marginBottom: 8,
    },
    projTitle: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    projUrl: {
        fontSize: 8.5,
        color: '#2563EB',
        marginTop: 1,
    },
    projDesc: {
        fontSize: 9,
        color: '#4B5563',
        lineHeight: 1.5,
        marginTop: 2,
    },
    certItem: {
        marginBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    certName: {
        fontSize: 9.5,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    certIssuer: {
        fontSize: 9.5,
        color: '#4B5563',
    },
    certDate: {
        fontSize: 8.5,
        color: '#9CA3AF',
    },
});

// --------------------------------
// Classic Template Component
// --------------------------------
export const ClassicTemplate = ({ data }: { data: CVData }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.title}>{data.personal.jobTitle}</Text> : null}
                <View style={styles.contactInfo}>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>{'•'} {data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>{'•'} {data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>{'•'} {data.personal.linkedin}</Text> : null}
                    {data.personal?.website ? <Text style={styles.contactItem}>{'•'} {data.personal.website}</Text> : null}
                </View>
            </View>

            {/* Summary */}
            {getSummaryText(data.summary) ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profesyonel Ozet</Text>
                    <Text style={styles.summaryText}>{getSummaryText(data.summary)}</Text>
                </View>
            ) : null}

            {/* Experience */}
            {(data.experience?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Is Deneyimi</Text>
                    {(data.experience || []).map((exp) => (
                        <View key={exp.id} style={styles.expItem}>
                            <View style={styles.expHeader}>
                                <View>
                                    <Text style={styles.expTitle}>{exp.title || ''}</Text>
                                    <Text style={styles.expCompany}>{exp.company || ''}{exp.location ? ` · ${exp.location}` : ''}</Text>
                                </View>
                                <Text style={styles.expDate}>
                                    {exp.startDate || ''} — {exp.isCurrent ? 'Devam Ediyor' : (exp.endDate || '')}
                                </Text>
                            </View>
                            {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
                        </View>
                    ))}
                </View>
            ) : null}

            {/* Education */}
            {(data.education?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Egitim</Text>
                    {(data.education || []).map((edu) => (
                        <View key={edu.id} style={styles.eduItem}>
                            <View style={styles.expHeader}>
                                <View>
                                    <Text style={styles.eduDegree}>{edu.degree || ''}</Text>
                                    <Text style={styles.eduSchool}>{edu.school || ''}{edu.location ? ` · ${edu.location}` : ''}</Text>
                                </View>
                                <Text style={styles.expDate}>{edu.startDate || ''} — {edu.endDate || ''}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}

            {/* Skills */}
            {(data.skills?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Beceriler</Text>
                    <View style={styles.skillsGrid}>
                        {(data.skills || []).map((skill) => (
                            <Text key={skill.id} style={styles.skillBadge}>{skill.name || ''}</Text>
                        ))}
                    </View>
                </View>
            ) : null}

            {/* Projects */}
            {(data.projects?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projeler</Text>
                    {(data.projects || []).map((proj) => (
                        <View key={proj.id} style={styles.projItem}>
                            <Text style={styles.projTitle}>
                                {proj.name || ''} {proj.technologies ? ` | ${proj.technologies}` : ''}
                            </Text>
                            {proj.url ? <Text style={styles.projUrl}>{proj.url}</Text> : null}
                            {proj.description ? <Text style={styles.projDesc}>{proj.description}</Text> : null}
                        </View>
                    ))}
                </View>
            ) : null}

            {/* Certificates */}
            {(data.certificates?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sertifikalar</Text>
                    {(data.certificates || []).map((cert) => (
                        <View key={cert.id} style={styles.certItem}>
                            <Text style={styles.certName}>
                                {cert.name || ''} — <Text style={styles.certIssuer}>{cert.issuer || ''}</Text>
                            </Text>
                            <Text style={styles.certDate}>{cert.date || ''}</Text>
                        </View>
                    ))}
                </View>
            ) : null}

        </Page>
    </Document>
);
