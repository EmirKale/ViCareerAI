import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
    header: { alignItems: 'center', marginBottom: 25 },
    name: { fontSize: 28, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 5 },
    jobTitle: { fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
    contactRow: { flexDirection: 'row', gap: 15, justifyContent: 'center', flexWrap: 'wrap' },
    contactItem: { fontSize: 9, color: '#4B5563' },
    
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', borderBottom: '1pt solid #E5E7EB', paddingBottom: 5, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#374151' },
    
    summary: { fontSize: 9.5, lineHeight: 1.6, color: '#4B5563', textAlign: 'justify' },
    
    itemBlock: { marginBottom: 12 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    itemTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' },
    itemCompany: { fontSize: 9.5, color: '#4B5563', fontStyle: 'italic' },
    itemDate: { fontSize: 9, color: '#9CA3AF' },
    itemDesc: { fontSize: 9.5, lineHeight: 1.5, color: '#4B5563', marginTop: 4 },
    
    skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillItem: { fontSize: 9, color: '#374151' },
});

export const MinimalTemplate = ({ data }: { data: CVData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.jobTitle}>{data.personal.jobTitle}</Text> : null}
                <View style={styles.contactRow}>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>{data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>{data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>{data.personal.linkedin}</Text> : null}
                    {data.personal?.website ? <Text style={styles.contactItem}>{data.personal.website}</Text> : null}
                </View>
            </View>

            {getSummaryText(data.summary) ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>OZET</Text>
                    <Text style={styles.summary}>{getSummaryText(data.summary)}</Text>
                </View>
            ) : null}

            {(data.experience?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DENEYIM</Text>
                    {(data.experience || []).map(exp => (
                        <View key={exp.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{exp.title || ''} — <Text style={styles.itemCompany}>{exp.company || ''}</Text></Text>
                                <Text style={styles.itemDate}>{exp.startDate || ''} / {exp.isCurrent ? 'Devam Ediyor' : (exp.endDate || '')}</Text>
                            </View>
                            {exp.description ? <Text style={styles.itemDesc}>{exp.description}</Text> : null}
                        </View>
                    ))}
                </View>
            ) : null}

            {(data.education?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>EGITIM</Text>
                    {(data.education || []).map(edu => (
                        <View key={edu.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{edu.degree || ''} — <Text style={styles.itemCompany}>{edu.school || ''}</Text></Text>
                                <Text style={styles.itemDate}>{edu.startDate || ''} / {edu.endDate || ''}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}

            {(data.skills?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>YETENEKLER</Text>
                    <View style={styles.skillsWrap}>
                        {(data.skills || []).map((s, i) => (
                            <Text key={s.id} style={styles.skillItem}>
                                {s.name || ''}{i !== (data.skills?.length ?? 0) - 1 ? ' • ' : ''}
                            </Text>
                        ))}
                    </View>
                </View>
            ) : null}

            {(data.projects?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PROJELER</Text>
                    {(data.projects || []).map(proj => (
                        <View key={proj.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>
                                    {proj.name || ''} {proj.technologies ? `— ${proj.technologies}` : ''}
                                </Text>
                                {proj.url ? <Text style={styles.itemDate}>{proj.url}</Text> : null}
                            </View>
                            {proj.description ? <Text style={styles.itemDesc}>{proj.description}</Text> : null}
                        </View>
                    ))}
                </View>
            ) : null}

            {(data.certificates?.length ?? 0) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SERTIFIKALAR</Text>
                    {(data.certificates || []).map(cert => (
                        <View key={cert.id} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{cert.name || ''} — <Text style={styles.itemCompany}>{cert.issuer || ''}</Text></Text>
                                <Text style={styles.itemDate}>{cert.date || ''}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}
        </Page>
    </Document>
);
