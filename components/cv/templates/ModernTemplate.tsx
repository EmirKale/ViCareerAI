import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

// Register Turkish-friendly fonts
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Regular.ttf'
});
Font.register({
  family: 'Roboto-Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Bold.ttf'
});

const styles = StyleSheet.create({
    page: { flexDirection: 'row', backgroundColor: '#ffffff', fontFamily: 'Roboto' },
    sidebar: { width: '35%', backgroundColor: '#1E3A8A', padding: 25, color: 'white', overflow: 'hidden' },
    main: { width: '65%', padding: 25, overflow: 'hidden' },
    name: { fontSize: 24, fontFamily: 'Roboto-Bold', marginBottom: 5, color: '#ffffff' },
    jobTitle: { fontSize: 12, color: '#93C5FD', marginBottom: 20 },
    sidebarSection: { marginBottom: 20 },
    sidebarTitle: { fontSize: 11, fontFamily: 'Roboto-Bold', marginBottom: 8, textTransform: 'uppercase', borderBottom: '1pt solid #3B82F6', paddingBottom: 4, color: '#ffffff' },
    contactItem: { fontSize: 9, marginBottom: 5, color: '#DBEAFE' },
    skillItem: { fontSize: 9, marginBottom: 4, backgroundColor: '#2563EB', padding: '3 6', borderRadius: 4, color: '#ffffff' },
    
    // Main Content
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 14, fontFamily: 'Roboto-Bold', color: '#1E3A8A', marginBottom: 8, textTransform: 'uppercase' },
    summary: { fontSize: 10, lineHeight: 1.5, color: '#374151' },
    
    itemBlock: { marginBottom: 12 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
    itemTitle: { fontSize: 11, fontFamily: 'Roboto-Bold', color: '#111827' },
    itemSubtitle: { fontSize: 10, color: '#2563EB' },
    itemDate: { fontSize: 9, color: '#6B7280' },
    itemDesc: { fontSize: 9.5, lineHeight: 1.5, color: '#4B5563', marginTop: 4 },
});

export const ModernTemplate = ({ data }: { data: CVData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.sidebar}>
                <Text style={styles.name}>{data.personal.fullName || 'Ad Soyad'}</Text>
                {data.personal.jobTitle && <Text style={styles.jobTitle}>{data.personal.jobTitle}</Text>}
                
                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarTitle}>İLETİŞİM</Text>
                    {data.personal.email && <Text style={styles.contactItem}>{data.personal.email}</Text>}
                    {data.personal.phone && <Text style={styles.contactItem}>{data.personal.phone}</Text>}
                    {data.personal.location && <Text style={styles.contactItem}>{data.personal.location}</Text>}
                    {data.personal.linkedin && <Text style={styles.contactItem}>{data.personal.linkedin}</Text>}
                    {data.personal.website && <Text style={styles.contactItem}>{data.personal.website}</Text>}
                </View>

                {data.skills?.length > 0 && (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>BECERİLER</Text>
                        <View style={{ gap: 4 }}>
                            {data.skills.map(s => <Text key={s.id} style={styles.skillItem}>{s.name}</Text>)}
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.main}>
                {data.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PROFESYONEL ÖZET</Text>
                        <Text style={styles.summary}>{getSummaryText(data.summary)}</Text>
                    </View>
                )}

                {data.experience?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>İŞ DENEYİMİ</Text>
                        {data.experience.map(exp => (
                            <View key={exp.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <View>
                                        <Text style={styles.itemTitle}>{exp.title}</Text>
                                        <Text style={styles.itemSubtitle}>{exp.company}</Text>
                                    </View>
                                    <Text style={styles.itemDate}>{exp.startDate} - {exp.isCurrent ? 'Devam Ediyor' : exp.endDate}</Text>
                                </View>
                                {exp.description && <Text style={styles.itemDesc}>{exp.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {data.education?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>EĞİTİM</Text>
                        {data.education.map(edu => (
                            <View key={edu.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <View>
                                        <Text style={styles.itemTitle}>{edu.degree}</Text>
                                        <Text style={styles.itemSubtitle}>{edu.school}</Text>
                                    </View>
                                    <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {data.projects && data.projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PROJELER</Text>
                        {data.projects.map(proj => (
                            <View key={proj.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <View>
                                        <Text style={styles.itemTitle}>{proj.name}</Text>
                                        {proj.technologies && <Text style={styles.itemSubtitle}>{proj.technologies}</Text>}
                                    </View>
                                    {proj.url && <Text style={styles.itemDate}>{proj.url}</Text>}
                                </View>
                                {proj.description && <Text style={styles.itemDesc}>{proj.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {data.certificates && data.certificates.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SERTİFİKALAR</Text>
                        {data.certificates.map(cert => (
                            <View key={cert.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <View>
                                        <Text style={styles.itemTitle}>{cert.name}</Text>
                                        <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                                    </View>
                                    <Text style={styles.itemDate}>{cert.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </Page>
    </Document>
);
