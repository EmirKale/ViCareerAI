import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 50,
        fontFamily: 'Roboto',
    },
    header: {
        marginBottom: 30,
        textAlign: 'left',
    },
    name: {
        fontSize: 32,
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: 2,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 6,
    },
    contactItem: {
        fontSize: 9,
        color: '#6B7280',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: 'Roboto',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        borderBottom: '0.5pt solid #E5E7EB',
        paddingBottom: 4,
        marginBottom: 12,
    },
    text: {
        fontSize: 10,
        color: '#4B5563',
        lineHeight: 1.6,
    },
    itemBlock: {
        marginBottom: 14,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        color: '#111827',
    },
    itemDate: {
        fontSize: 9,
        color: '#9CA3AF',
    },
    itemSub: {
        fontSize: 10,
        color: '#4B5563',
        marginBottom: 6,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillItem: {
        fontSize: 9,
        color: '#4B5563',
        backgroundColor: '#F3F4F6',
        padding: '4px 8px',
        borderRadius: 4,
    }
});

export const MinimalTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Minimal CV`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                <View style={styles.contactRow}>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>| {data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>| {data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>| {data.personal.linkedin}</Text> : null}
                </View>
            </View>

            {getSummaryText(data.summary) ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profil</Text>
                    <Text style={styles.text}>{getSummaryText(data.summary)}</Text>
                </View>
            ) : null}

            {((data.experience || []).filter(x => x.title?.trim() || x.company?.trim()).length) > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Deneyim</Text>
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
                    <Text style={styles.sectionTitle}>Beceriler</Text>
                    <View style={styles.skillsRow}>
                        {(data.skills || []).map((skill) => (
                            <Text key={skill.id} style={styles.skillItem}>
                                {skill.name || ''}
                            </Text>
                        ))}
                    </View>
                </View>
            ) : null}
        </Page>
    </Document>
);

