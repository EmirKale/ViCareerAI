import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto',
    },
    headerBar: {
        backgroundColor: '#1E3A5F',
        padding: 40,
        paddingBottom: 30,
        color: '#ffffff',
    },
    name: {
        fontSize: 28,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#ffffff',
    },
    title: {
        fontSize: 14,
        color: '#60A5FA',
        marginBottom: 16,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    contactItem: {
        fontSize: 10,
        color: '#E5E7EB',
    },
    body: {
        padding: 40,
        paddingTop: 30,
    },
    section: {
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#1E3A5F',
        textTransform: 'uppercase',
        marginBottom: 12,
        paddingBottom: 4,
        borderBottom: '2pt solid #60A5FA',
    },
    text: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.5,
    },
    itemBlock: {
        marginBottom: 14,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    itemDate: {
        fontSize: 10,
        color: '#1E3A5F',
        fontWeight: 'bold',
    },
    itemSub: {
        fontSize: 11,
        color: '#4B5563',
        marginBottom: 6,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillItem: {
        fontSize: 10,
        color: '#1E3A5F',
        border: '1pt solid #1E3A5F',
        padding: '4px 8px',
        borderRadius: 4,
    }
});

export const ModernTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Modern CV`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.headerBar}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.title}>{data.personal.jobTitle}</Text> : null}
                <View style={styles.contactRow}>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>• {data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>• {data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>• {data.personal.linkedin}</Text> : null}
                </View>
            </View>

            <View style={styles.body}>
                {getSummaryText(data.summary) ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Profil</Text>
                        <Text style={styles.text}>{getSummaryText(data.summary)}</Text>
                    </View>
                ) : null}

                {((data.experience || []).filter(x => x.title?.trim() || x.company?.trim()).length) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>İş Deneyimi</Text>
                        {(data.experience || []).map((exp) => (
                            <View key={exp.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{exp.title || ''}</Text>
                                    <Text style={styles.itemDate}>{exp.startDate || ''} — {exp.isCurrent ? "Devam" : (exp.endDate || '')}</Text>
                                </View>
                                <Text style={styles.itemSub}>{exp.company || ''}{exp.location ? `, ${exp.location}` : ''}</Text>
                                {exp.description ? <Text style={styles.text}>{exp.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                ) : null}

                {((data.education || []).filter(x => x.school?.trim() || x.degree?.trim()).length) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Eğitim</Text>
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

                {((data.projects || []).filter(x => x.name?.trim()).length) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projeler</Text>
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

                {((data.certificates || []).filter(x => x.name?.trim()).length) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sertifikalar</Text>
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

                {((data.skills || []).filter(x => x.name?.trim()).length) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Yetenekler</Text>
                        <View style={styles.skillsRow}>
                            {(data.skills || []).map((skill) => (
                                <Text key={skill.id} style={styles.skillItem}>
                                    {skill.name || ''}
                                </Text>
                            ))}
                        </View>
                    </View>
                ) : null}
            </View>
        </Page>
    </Document>
);

