import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

Font.register({
    family: 'Roboto',
    fonts: [
        { src: '/fonts/Roboto-Regular.ttf' },
        { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' }
    ]
});

// --------------------------------
// Professional Template Styles
// --------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto',
    },
    sidebar: {
        width: '32%',
        backgroundColor: '#111827', // Very dark gray/black
        color: '#f9fafb',
        padding: 30,
        height: '100%',
    },
    main: {
        width: '68%',
        padding: 35,
        backgroundColor: '#ffffff',
    },
    name: {
        fontSize: 22,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#f9fafb',
    },
    title: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 25,
    },
    sidebarSection: {
        marginBottom: 25,
    },
    sidebarTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottom: '1pt solid #374151',
        paddingBottom: 4,
        marginBottom: 10,
        color: '#f9fafb',
        letterSpacing: 1,
    },
    sidebarText: {
        fontSize: 9.5,
        marginBottom: 6,
        color: '#d1d5db',
    },
    skillBadge: {
        fontSize: 9,
        backgroundColor: '#374151',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 6,
        color: '#e5e7eb',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    mainSection: {
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 13,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
        borderBottom: '2pt solid #111827',
        paddingBottom: 4,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    item: {
        marginBottom: 14,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    itemName: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#111827',
    },
    itemDate: {
        fontSize: 9,
        color: '#6b7280',
    },
    itemSub: {
        fontSize: 10,
        color: '#374151',
        marginTop: 2,
        marginBottom: 4,
        fontStyle: 'italic',
    },
    description: {
        fontSize: 9.5,
        color: '#4b5563',
        lineHeight: 1.5,
        textAlign: 'justify',
    }
});

export const ProfessionalTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Professional CV`}>
        <Page size="A4" style={styles.page}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                {data.personal?.jobTitle ? <Text style={styles.title}>{data.personal.jobTitle}</Text> : null}

                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarTitle}>İLETİŞİM</Text>
                    {data.personal?.email ? <Text style={styles.sidebarText}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.sidebarText}>{data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.sidebarText}>{data.personal.location}</Text> : null}
                    {data.personal?.website ? <Text style={styles.sidebarText}>{data.personal.website}</Text> : null}
                    {data.personal?.linkedin ? <Text style={styles.sidebarText}>{data.personal.linkedin}</Text> : null}
                </View>

                {(data.skills?.length ?? 0) > 0 ? (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>BECERİLER</Text>
                        <View style={styles.skillsContainer}>
                            {(data.skills || []).map((skill) => (
                                <Text key={skill.id} style={styles.skillBadge}>{skill.name || ''}</Text>
                            ))}
                        </View>
                    </View>
                ) : null}
            </View>

            {/* Main Content */}
            <View style={styles.main}>
                {getSummaryText(data.summary) ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>PROFESYONEL ÖZET</Text>
                        <Text style={styles.description}>{getSummaryText(data.summary)}</Text>
                    </View>
                ) : null}

                {(data.experience?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>İŞ DENEYİMİ</Text>
                        {(data.experience || []).map((exp) => (
                            <View key={exp.id} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{exp.title || ''}</Text>
                                    <Text style={styles.itemDate}>{exp.startDate || ''} — {exp.isCurrent ? "Devam Ediyor" : (exp.endDate || '')}</Text>
                                </View>
                                <Text style={styles.itemSub}>{exp.company || ''}{exp.location ? `, ${exp.location}` : ''}</Text>
                                {exp.description ? <Text style={styles.description}>{exp.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                ) : null}

                {(data.education?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>EĞİTİM</Text>
                        {(data.education || []).map((edu) => (
                            <View key={edu.id} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{edu.degree || ''}</Text>
                                    <Text style={styles.itemDate}>{edu.startDate || ''} — {edu.endDate || ''}</Text>
                                </View>
                                <Text style={styles.itemSub}>{edu.school || ''}{edu.location ? `, ${edu.location}` : ''}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {(data.projects?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>PROJELER</Text>
                        {(data.projects || []).map((proj) => (
                            <View key={proj.id} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{proj.name || ''}</Text>
                                    {proj.url ? <Text style={styles.itemDate}>{proj.url}</Text> : null}
                                </View>
                                {proj.technologies ? <Text style={styles.itemSub}>{proj.technologies}</Text> : null}
                                {proj.description ? <Text style={styles.description}>{proj.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                ) : null}

                {(data.certificates?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>SERTİFİKALAR</Text>
                        {(data.certificates || []).map((cert) => (
                            <View key={cert.id} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{cert.name || ''}</Text>
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
