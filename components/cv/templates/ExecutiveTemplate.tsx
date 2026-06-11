import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData } from './ClassicTemplate';

// --------------------------------
// Executive Template Styles
// --------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 45,
        fontFamily: 'Times-Bold',
    },
    header: {
        textAlign: 'center',
        marginBottom: 25,
        borderBottom: '2pt solid #0f172a',
        paddingBottom: 15,
    },
    name: {
        fontSize: 28,
        color: '#0f172a',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    title: {
        fontSize: 14,
        color: '#64748b',
        fontFamily: 'Times-Roman',
        fontStyle: 'italic',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginTop: 10,
    },
    contactItem: {
        fontSize: 9,
        color: '#1e293b',
        fontFamily: 'Times-Roman',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Times-Bold',
        color: '#0f172a',
        textTransform: 'uppercase',
        borderBottom: '1pt solid #cbd5e1',
        paddingBottom: 3,
        marginBottom: 12,
    },
    item: {
        marginBottom: 15,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    itemName: {
        fontSize: 11,
        fontFamily: 'Times-Bold',
        color: '#0f172a',
    },
    itemSub: {
        fontSize: 10,
        fontFamily: 'Times-Roman',
        fontStyle: 'italic',
        color: '#334155',
    },
    itemDate: {
        fontSize: 9,
        fontFamily: 'Times-Roman',
        color: '#64748b',
    },
    description: {
        fontSize: 10,
        fontFamily: 'Times-Roman',
        color: '#334155',
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    skillItem: {
        fontSize: 10,
        fontFamily: 'Times-Roman',
        color: '#0f172a',
        width: '30%',
    }
});

export const ExecutiveTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal.fullName} - Executive CV`}>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{data.personal.fullName}</Text>
                {data.personal.jobTitle && <Text style={styles.title}>{data.personal.jobTitle}</Text>}
                <View style={styles.contactRow}>
                    {data.personal.email && <Text style={styles.contactItem}>{data.personal.email}</Text>}
                    {data.personal.phone && <Text style={styles.contactItem}>{data.personal.phone}</Text>}
                    {data.personal.location && <Text style={styles.contactItem}>{data.personal.location}</Text>}
                </View>
                <View style={styles.contactRow}>
                    {data.personal.linkedin && <Text style={styles.contactItem}>LinkedIn: {data.personal.linkedin}</Text>}
                    {data.personal.website && <Text style={styles.contactItem}>{data.personal.website}</Text>}
                </View>
            </View>

            {/* Summary */}
            {data.summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Executive Profile</Text>
                    <Text style={styles.description}>{data.summary}</Text>
                </View>
            )}

            {/* Experience */}
            {data.experience?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
                    {data.experience.map((exp) => (
                        <View key={exp.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{exp.title}</Text>
                                <Text style={styles.itemDate}>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</Text>
                            </View>
                            <Text style={styles.itemSub}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</Text>
                            {exp.description && <Text style={styles.description}>{exp.description}</Text>}
                        </View>
                    ))}
                </View>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {data.education.map((edu) => (
                        <View key={edu.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{edu.degree}</Text>
                                <Text style={styles.itemDate}>{edu.startDate} — {edu.endDate}</Text>
                            </View>
                            <Text style={styles.itemSub}>{edu.school}{edu.location ? `, ${edu.location}` : ''}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Skills */}
            {data.skills?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Core Competencies</Text>
                    <View style={styles.skillsContainer}>
                        {data.skills.map((skill) => (
                            <Text key={skill.id} style={styles.skillItem}>• {skill.name}</Text>
                        ))}
                    </View>
                </View>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {data.projects.map((proj) => (
                        <View key={proj.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{proj.name}</Text>
                                {proj.url && <Text style={styles.itemDate}>{proj.url}</Text>}
                            </View>
                            {proj.technologies && <Text style={styles.itemSub}>{proj.technologies}</Text>}
                            {proj.description && <Text style={styles.description}>{proj.description}</Text>}
                        </View>
                    ))}
                </View>
            )}

            {/* Certificates */}
            {data.certificates && data.certificates.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Certificates</Text>
                    {data.certificates.map((cert) => (
                        <View key={cert.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{cert.name}</Text>
                                <Text style={styles.itemDate}>{cert.date}</Text>
                            </View>
                            <Text style={styles.itemSub}>{cert.issuer}</Text>
                        </View>
                    ))}
                </View>
            )}
        </Page>
    </Document>
);
