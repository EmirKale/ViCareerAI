import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText, breakLongWords, truncateUrl } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row-reverse',
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto',
    },
    sidebar: {
        width: '38%',
        backgroundColor: '#6B21A8',
        padding: 22,
        color: '#ffffff',
        height: '100%',
    },
    main: {
        width: '62%',
        padding: 28,
        backgroundColor: '#ffffff',
    },
    name: {
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#ffffff',
        lineHeight: 1.2,
    },
    title: {
        fontSize: 11,
        color: '#D8B4FE',
        marginBottom: 18,
    },
    sidebarSection: {
        marginBottom: 16,
    },
    sidebarTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#ffffff',
        textTransform: 'uppercase',
        borderBottom: '1pt solid #9333EA',
        paddingBottom: 3,
        marginBottom: 8,
        letterSpacing: 1,
    },
    contactItem: {
        fontSize: 9,
        color: '#E9D5FF',
        marginBottom: 5,
    },
    skillItem: {
        fontSize: 9,
        color: '#E9D5FF',
        marginBottom: 3,
    },
    mainSection: {
        marginBottom: 16,
    },
    mainTitle: {
        fontSize: 13,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#6B21A8',
        textTransform: 'uppercase',
        borderBottom: '2pt solid #D8B4FE',
        paddingBottom: 3,
        marginBottom: 10,
    },
    text: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.4,
    },
    itemBlock: {
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 3,
    },
    itemTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    itemDate: {
        fontSize: 9,
        color: '#6B21A8',
        fontWeight: 'bold',
    },
    itemSub: {
        fontSize: 10,
        color: '#4B5563',
        marginBottom: 4,
    }
});

export const CreativeTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Creative CV`}>
        <Page size="A4" style={styles.page}>
            {/* MAIN CONTENT — rendered first in DOM for ATS text order */}
            <View style={styles.main}>
                {getSummaryText(data.summary) ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Hakkımda</Text>
                        <Text style={styles.text}>{getSummaryText(data.summary)}</Text>
                    </View>
                ) : null}

                {((data.experience || []).filter(x => x.title?.trim() || x.company?.trim()).length) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Deneyim</Text>
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
                        <Text style={styles.mainTitle}>Eğitim</Text>
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
                        <Text style={styles.mainTitle}>Projeler</Text>
                        {(data.projects || []).map((proj) => (
                            <View key={proj.id} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{proj.name || ''}</Text>
                                </View>
                                {proj.technologies ? <Text style={styles.itemSub}>{proj.technologies}</Text> : null}
                                {proj.description ? <Text style={styles.text}>{proj.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                ) : null}

                {((data.certificates || []).filter(x => x.name?.trim()).length) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Sertifikalar</Text>
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

            {/* LEFT SIDEBAR — rendered second in DOM but visually on left via row-reverse */}
            <View style={styles.sidebar}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.title}>{data.personal.jobTitle}</Text> : null}

                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarTitle}>İLETİŞİM</Text>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>{data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>{data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>{truncateUrl(data.personal.linkedin)}</Text> : null}
                    {data.personal?.website ? <Text style={styles.contactItem}>{truncateUrl(data.personal.website)}</Text> : null}
                </View>

                {((data.skills || []).filter(x => x.name?.trim()).length) > 0 ? (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>BECERİLER</Text>
                        {(data.skills || []).map((skill) => (
                            <Text key={skill.id} style={styles.skillItem}>
                                <Text>{'• '}</Text>
                                <Text>{skill.name || ''}</Text>
                            </Text>
                        ))}
                    </View>
                ) : null}
            </View>
        </Page>
    </Document>
);
