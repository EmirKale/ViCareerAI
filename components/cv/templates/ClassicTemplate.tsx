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

export interface CVData {
    personal: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        website: string;
        linkedin: string;
        location?: string;
    };
    summary: string | Record<string, unknown>;
    experience: Array<{
        id: string;
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        isCurrent: boolean;
        description: string;
        location?: string;
    }>;
    education: Array<{
        id: string;
        degree: string;
        school: string;
        startDate: string;
        endDate: string;
        location?: string;
    }>;
    skills: Array<{ id: string; name: string }>;
    projects?: Array<{
        id: string;
        name: string;
        description: string;
        url?: string;
        technologies?: string;
    }>;
    certificates?: Array<{
        id: string;
        name: string;
        issuer: string;
        date: string;
        url?: string;
    }>;
}

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Roboto',
    },
    header: {
        marginBottom: 16,
        textAlign: 'center',
    },
    name: {
        fontSize: 22,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 4,
    },
    contactItem: {
        fontSize: 10,
        color: '#000000',
    },
    section: {
        marginTop: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#000000',
        textTransform: 'uppercase',
        borderBottom: '1pt solid #000000',
        paddingBottom: 2,
        marginBottom: 8,
    },
    text: {
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.4,
        textAlign: 'justify',
    },
    itemBlock: {
        marginBottom: 10,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    itemTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#000000',
    },
    itemDate: {
        fontSize: 10,
        color: '#000000',
    },
    itemSub: {
        fontSize: 10,
        color: '#000000',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillText: {
        fontSize: 10,
        color: '#000000',
    }
});

export const ClassicTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Classic CV`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                <View style={styles.contactRow}>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>• {data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>• {data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>• {data.personal.linkedin}</Text> : null}
                </View>
            </View>

            {getSummaryText(data.summary) ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PROFESYONEL ÖZET</Text>
                    <Text style={styles.text}>{getSummaryText(data.summary)}</Text>
                </View>
            ) : null}

            {(data.experience?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>İŞ DENEYİMİ</Text>
                    {(data.experience || []).map((exp) => (
                        <View key={exp.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{exp.title || ''}</Text>
                                <Text style={styles.itemDate}>{exp.startDate || ''} — {exp.isCurrent ? "Devam Ediyor" : (exp.endDate || '')}</Text>
                            </View>
                            <Text style={styles.itemSub}>{exp.company || ''}{exp.location ? `, ${exp.location}` : ''}</Text>
                            {exp.description ? <Text style={styles.text}>{exp.description}</Text> : null}
                        </View>
                    ))}
                </View>
            ) : null}

            {(data.education?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>EĞİTİM</Text>
                    {(data.education || []).map((edu) => (
                        <View key={edu.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{edu.school || ''}</Text>
                                <Text style={styles.itemDate}>{edu.startDate || ''} — {edu.endDate || ''}</Text>
                            </View>
                            <Text style={styles.itemSub}>{edu.degree || ''}</Text>
                        </View>
                    ))}
                </View>
            ) : null}

            {(data.projects?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PROJELER</Text>
                    {(data.projects || []).map((proj) => (
                        <View key={proj.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{proj.name || ''}</Text>
                                {proj.url ? <Text style={styles.itemDate}>{proj.url}</Text> : null}
                            </View>
                            {proj.technologies ? <Text style={styles.itemSub}>{proj.technologies}</Text> : null}
                            {proj.description ? <Text style={styles.text}>{proj.description}</Text> : null}
                        </View>
                    ))}
                </View>
            ) : null}

            {(data.certificates?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SERTİFİKALAR</Text>
                    {(data.certificates || []).map((cert) => (
                        <View key={cert.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{cert.name || ''}</Text>
                                <Text style={styles.itemDate}>{cert.date || ''}</Text>
                            </View>
                            <Text style={styles.itemSub}>{cert.issuer || ''}</Text>
                        </View>
                    ))}
                </View>
            ) : null}

            {(data.skills?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>YETENEKLER</Text>
                    <View style={styles.skillsRow}>
                        {(data.skills || []).map((skill, index) => (
                            <Text key={skill.id} style={styles.skillText}>
                                {skill.name || ''}{index < data.skills.length - 1 ? ' • ' : ''}
                            </Text>
                        ))}
                    </View>
                </View>
            ) : null}
        </Page>
    </Document>
);
