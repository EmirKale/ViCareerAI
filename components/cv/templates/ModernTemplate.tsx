import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText, breakLongWords } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto',
    },
    headerBar: {
        backgroundColor: '#1E3A5F',
        padding: 30,
        paddingBottom: 20,
        color: '#ffffff',
    },
    name: {
        fontSize: 24,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#ffffff',
    },
    title: {
        fontSize: 12,
        color: '#60A5FA',
        marginBottom: 10,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    contactItem: {
        fontSize: 9,
        color: '#E5E7EB',
    },
    body: {
        padding: 30,
        paddingTop: 20,
    },
    section: {
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#1E3A5F',
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingBottom: 3,
        borderBottom: '2pt solid #60A5FA',
    },
    text: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.4,
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
        color: '#111827',
    },
    itemDate: {
        fontSize: 10,
        color: '#1E3A5F',
        fontWeight: 'bold',
    },
    itemSub: {
        fontSize: 10,
        color: '#4B5563',
        marginBottom: 4,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillItem: {
        fontSize: 9,
        color: '#1E3A5F',
        border: '1pt solid #1E3A5F',
        padding: '3px 7px',
        borderRadius: 3,
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
                    {data.personal?.phone ? <Text style={styles.contactItem}><Text>{'• '}</Text><Text>{data.personal.phone}</Text></Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}><Text>{'• '}</Text><Text>{data.personal.location}</Text></Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}><Text>{'• '}</Text><Text>{data.personal.linkedin}</Text></Text> : null}
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
                                {exp.description ? <Text style={styles.text}>{breakLongWords(exp.description)}</Text> : null}
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
                                    <Text>{skill.name || ''}</Text>
                                </Text>
                            ))}
                        </View>
                    </View>
                ) : null}
            </View>
        </Page>
    </Document>
);
