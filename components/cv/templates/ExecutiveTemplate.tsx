import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto',
    },
    header: {
        backgroundColor: '#111827',
        padding: 30,
        alignItems: 'center',
        color: '#ffffff',
    },
    name: {
        fontSize: 26,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    contactItem: {
        fontSize: 9,
        color: '#D1D5DB',
    },
    body: {
        padding: 40,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: 12,
    },
    separator: {
        borderBottom: '0.5pt solid #D1D5DB',
        width: 50,
        alignSelf: 'center',
        marginBottom: 16,
    },
    text: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.5,
        textAlign: 'center',
    },
    itemBlock: {
        marginBottom: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    itemDate: {
        fontSize: 9,
        color: '#6B7280',
    },
    itemSub: {
        fontSize: 10,
        color: '#111827',
        fontStyle: 'italic',
        marginBottom: 6,
    },
    itemDesc: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.4,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    skillItem: {
        fontSize: 10,
        color: '#111827',
    }
});

export const ExecutiveTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Executive CV`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.title}>{data.personal.jobTitle}</Text> : null}
                <View style={styles.contactRow}>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>| {data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>| {data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>| {data.personal.linkedin}</Text> : null}
                </View>
            </View>

            <View style={styles.body}>
                {getSummaryText(data.summary) ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>YÖNETİCİ ÖZETİ</Text>
                        <View style={styles.separator} />
                        <Text style={styles.text}>{getSummaryText(data.summary)}</Text>
                    </View>
                ) : null}

                {(data.experience?.length ?? 0) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>KARİYER GEÇMİŞİ</Text>
                        <View style={styles.separator} />
                        {(data.experience || []).map((exp) => (
                            <View key={exp.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{exp.title || ''}</Text>
                                    <Text style={styles.itemDate}>{exp.startDate || ''} — {exp.isCurrent ? "Devam" : (exp.endDate || '')}</Text>
                                </View>
                                <Text style={styles.itemSub}>{exp.company || ''}{exp.location ? `, ${exp.location}` : ''}</Text>
                                {exp.description ? <Text style={styles.itemDesc}>{exp.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                ) : null}

                {(data.education?.length ?? 0) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>EĞİTİM BİLGİLERİ</Text>
                        <View style={styles.separator} />
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
                        <Text style={styles.sectionTitle}>ÖNEMLİ PROJELER</Text>
                        <View style={styles.separator} />
                        {(data.projects || []).map((proj) => (
                            <View key={proj.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{proj.name || ''}</Text>
                                    {proj.url ? <Text style={styles.itemDate}>{proj.url}</Text> : null}
                                </View>
                                {proj.technologies ? <Text style={styles.itemSub}>{proj.technologies}</Text> : null}
                                {proj.description ? <Text style={styles.itemDesc}>{proj.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                ) : null}

                {(data.certificates?.length ?? 0) > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>LİSANS & SERTİFİKALAR</Text>
                        <View style={styles.separator} />
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
                        <Text style={styles.sectionTitle}>UZMANLIK ALANLARI</Text>
                        <View style={styles.separator} />
                        <View style={styles.skillsRow}>
                            {(data.skills || []).map((skill, index) => (
                                <Text key={skill.id} style={styles.skillItem}>
                                    {skill.name || ''}{index < data.skills.length - 1 ? '  •  ' : ''}
                                </Text>
                            ))}
                        </View>
                    </View>
                ) : null}
            </View>
        </Page>
    </Document>
);
