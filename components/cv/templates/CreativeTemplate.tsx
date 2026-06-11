import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto',
    },
    sidebar: {
        width: '35%',
        backgroundColor: '#6B21A8',
        padding: 25,
        color: '#ffffff',
        height: '100%',
    },
    main: {
        width: '65%',
        padding: 30,
        backgroundColor: '#ffffff',
    },
    name: {
        fontSize: 24,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#ffffff',
        lineHeight: 1.2,
    },
    title: {
        fontSize: 12,
        color: '#D8B4FE',
        marginBottom: 20,
    },
    sidebarSection: {
        marginBottom: 20,
    },
    sidebarTitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#ffffff',
        textTransform: 'uppercase',
        borderBottom: '1pt solid #9333EA',
        paddingBottom: 4,
        marginBottom: 10,
        letterSpacing: 1,
    },
    contactItem: {
        fontSize: 10,
        color: '#E9D5FF',
        marginBottom: 6,
    },
    skillItem: {
        fontSize: 10,
        color: '#E9D5FF',
        marginBottom: 4,
    },
    mainSection: {
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#6B21A8',
        textTransform: 'uppercase',
        borderBottom: '2pt solid #D8B4FE',
        paddingBottom: 4,
        marginBottom: 12,
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
        fontSize: 9,
        color: '#6B21A8',
        fontWeight: 'bold',
    },
    itemSub: {
        fontSize: 10,
        color: '#4B5563',
        marginBottom: 6,
        fontStyle: 'italic',
    }
});

export const CreativeTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Creative CV`}>
        <Page size="A4" style={styles.page}>
            {/* LEFT SIDEBAR */}
            <View style={styles.sidebar}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.title}>{data.personal.jobTitle}</Text> : null}

                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarTitle}>İLETİŞİM</Text>
                    {data.personal?.email ? <Text style={styles.contactItem}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.contactItem}>{data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.contactItem}>{data.personal.location}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.contactItem}>{data.personal.linkedin}</Text> : null}
                </View>

                {(data.skills?.length ?? 0) > 0 ? (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>BECERİLER</Text>
                        {(data.skills || []).map((skill) => (
                            <Text key={skill.id} style={styles.skillItem}>• {skill.name || ''}</Text>
                        ))}
                    </View>
                ) : null}
            </View>

            {/* RIGHT MAIN CONTENT */}
            <View style={styles.main}>
                {getSummaryText(data.summary) ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Hakkımda</Text>
                        <Text style={styles.text}>{getSummaryText(data.summary)}</Text>
                    </View>
                ) : null}

                {(data.experience?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Deneyim</Text>
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

                {(data.education?.length ?? 0) > 0 ? (
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

                {(data.projects?.length ?? 0) > 0 ? (
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

                {(data.certificates?.length ?? 0) > 0 ? (
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
        </Page>
    </Document>
);
