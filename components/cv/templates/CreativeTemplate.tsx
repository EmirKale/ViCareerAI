import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData, getSummaryText } from './ClassicTemplate';

// --------------------------------
// Creative Template Styles
// --------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    sidebar: {
        width: '35%',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        padding: 30,
        height: '100%',
    },
    main: {
        width: '65%',
        padding: 35,
        backgroundColor: '#ffffff',
    },
    name: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5,
        color: '#f8fafc',
    },
    title: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 30,
    },
    sidebarSection: {
        marginBottom: 25,
    },
    sidebarTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 10,
        color: '#38bdf8',
    },
    sidebarText: {
        fontSize: 9,
        marginBottom: 5,
        color: '#cbd5e1',
    },
    skillItem: {
        marginBottom: 8,
    },
    skillName: {
        fontSize: 8.5,
        marginBottom: 2,
    },
    skillLevel: {
        height: 2,
        backgroundColor: '#334155',
        width: '100%',
    },
    skillLevelFill: {
        height: 2,
        backgroundColor: '#38bdf8',
        width: '80%',
    },
    mainSection: {
        marginBottom: 25,
    },
    mainTitle: {
        fontSize: 13,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    item: {
        marginBottom: 15,
        position: 'relative',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    itemName: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#1e293b',
    },
    itemDate: {
        fontSize: 8,
        color: '#64748b',
    },
    itemSub: {
        fontSize: 9,
        color: '#3b82f6',
        marginTop: 2,
        marginBottom: 5,
    },
    description: {
        fontSize: 9,
        color: '#475569',
        lineHeight: 1.5,
    }
});

export const CreativeTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal?.fullName || 'CV'} - Creative Portfolio CV`}>
        <Page size="A4" style={styles.page}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                <Text style={styles.name}>{data.personal?.fullName || 'Ad Soyad'}</Text>
                <Text style={styles.title}>{data.personal?.jobTitle || ''}</Text>

                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarTitle}>Contact</Text>
                    {data.personal?.email ? <Text style={styles.sidebarText}>{data.personal.email}</Text> : null}
                    {data.personal?.phone ? <Text style={styles.sidebarText}>{data.personal.phone}</Text> : null}
                    {data.personal?.location ? <Text style={styles.sidebarText}>{data.personal.location}</Text> : null}
                    {data.personal?.website ? <Text style={styles.sidebarText}>{data.personal.website}</Text> : null}
                </View>

                {(data.skills?.length ?? 0) > 0 ? (
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>Top Skills</Text>
                        {(data.skills || []).map((skill) => (
                            <View key={skill.id} style={styles.skillItem}>
                                <Text style={styles.skillName}>{skill.name || ''}</Text>
                                <View style={styles.skillLevel}>
                                    <View style={styles.skillLevelFill}></View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            {/* Main Content */}
            <View style={styles.main}>
                {getSummaryText(data.summary) ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>About Me</Text>
                        <Text style={styles.description}>{getSummaryText(data.summary)}</Text>
                    </View>
                ) : null}

                {(data.experience?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Work Experience</Text>
                        {(data.experience || []).map((exp) => (
                            <View key={exp.id} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{exp.title || ''}</Text>
                                    <Text style={styles.itemDate}>{exp.startDate || ''} — {exp.isCurrent ? "Now" : (exp.endDate || '')}</Text>
                                </View>
                                <Text style={styles.itemSub}>{exp.company || ''}</Text>
                                {exp.description ? <Text style={styles.description}>{exp.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                ) : null}

                {(data.education?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Education</Text>
                        {(data.education || []).map((edu) => (
                            <View key={edu.id} style={styles.item}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{edu.degree || ''}</Text>
                                    <Text style={styles.itemDate}>{edu.startDate || ''} — {edu.endDate || ''}</Text>
                                </View>
                                <Text style={styles.itemSub}>{edu.school || ''}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {(data.projects?.length ?? 0) > 0 ? (
                    <View style={styles.mainSection}>
                        <Text style={styles.mainTitle}>Projects</Text>
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
                        <Text style={styles.mainTitle}>Certificates</Text>
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
