import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText, breakLongWords } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto',
    },
    sidebar: {
        width: '30%',
        backgroundColor: '#1E293B',
        padding: 25,
        color: '#ffffff',
        height: '100%',
    },
    main: {
        width: '70%',
        padding: 30,
        backgroundColor: '#ffffff',
    },
    name: {
        fontSize: 22,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#ffffff',
        lineHeight: 1.2,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 11,
        color: '#94A3B8',
        marginBottom: 20,
    },
    sidebarSection: {
        marginBottom: 20,
    },
    sidebarTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#ffffff',
        textTransform: 'uppercase',
        borderBottom: '2pt solid #2563EB',
        paddingBottom: 4,
        marginBottom: 10,
        letterSpacing: 1,
    },
    contactItem: {
        fontSize: 9,
        color: '#CBD5E1',
        marginBottom: 6,
    },
    skillItem: {
        fontSize: 9,
        color: '#CBD5E1',
        marginBottom: 4,
    },
    mainSection: {
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 13,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#1E293B',
        textTransform: 'uppercase',
        borderBottom: '2pt solid #2563EB',
        paddingBottom: 4,
        marginBottom: 12,
    },
    text: {
        fontSize: 10,
        color: '#334155',
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
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#0F172A',
    },
    itemDate: {
        fontSize: 9,
        color: '#2563EB',
        fontWeight: 'bold',
    },
    itemSub: {
        fontSize: 10,
        color: '#475569',
        marginBottom: 6,
    }
});

export const ProfessionalTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Professional CV`}>
        <Page size="A4" style={styles.page}>
            {/* LEFT SIDEBAR */}
            <View style={styles.sidebar}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.title}>{data.personal.jobTitle}</Text> : null}

                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarTitle}>İLETİŞİM BİLGİLERİ</Text>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>{data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>{data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>{data.personal.linkedin}</Text> : null}
                </View>

                {((data.skills || []).filter(x => x.name?.trim()).length) > 0 ? (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>UZMANLIK ALANLARI</Text>
                        {(data.skills || []).map((skill) => (
                            <Text key={skill.id} style={styles.skillItem}>
                                <Text>• </Text>
                                <Text>{skill.name || ''}</Text>
                            </Text>
                        ))}
                    </View>
                ) : null}
            </View>

            {/* RIGHT MAIN CONTENT */}
            <View style={styles.main}>
                {getSummaryText(data.summary) ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>PROFESYONEL ÖZET</Text>
                        <Text style={styles.text}>{getSummaryText(data.summary)}</Text>
                    </View>
                ) : null}

                {((data.experience || []).filter(x => x.title?.trim() || x.company?.trim()).length) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>İŞ DENEYİMİ</Text>
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
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>EĞİTİM GEÇMİŞİ</Text>
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
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>PROJELER</Text>
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
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>SERTİFİKALAR</Text>
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
            </View>
        </Page>
    </Document>
);

