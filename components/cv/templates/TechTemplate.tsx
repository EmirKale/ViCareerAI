import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData } from './ClassicTemplate';

// --------------------------------
// Tech Template Styles
// --------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Courier',
    },
    header: {
        marginBottom: 20,
        backgroundColor: '#000000',
        padding: 20,
        color: '#00ff00',
    },
    name: {
        fontSize: 22,
        fontFamily: 'Courier-Bold',
        marginBottom: 4,
    },
    title: {
        fontSize: 12,
        color: '#00ff00',
        marginBottom: 10,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    contactItem: {
        fontSize: 9,
        color: '#ffffff',
    },
    section: {
        marginTop: 18,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Courier-Bold',
        color: '#000000',
        backgroundColor: '#f1f5f9',
        paddingVertical: 3,
        paddingHorizontal: 8,
        marginBottom: 10,
        borderLeft: '4pt solid #000000',
    },
    item: {
        marginBottom: 12,
        borderBottom: '0.5pt solid #e2e8f0',
        paddingBottom: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemName: {
        fontSize: 10,
        fontFamily: 'Courier-Bold',
        color: '#0f172a',
    },
    itemDate: {
        fontSize: 8.5,
        color: '#64748b',
    },
    itemSub: {
        fontSize: 9.5,
        color: '#2563eb',
        fontFamily: 'Courier-Oblique',
        marginBottom: 4,
    },
    description: {
        fontSize: 9.5,
        color: '#334155',
        lineHeight: 1.4,
    },
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        fontSize: 9,
        backgroundColor: '#f8fafc',
        border: '1pt solid #cbd5e1',
        paddingVertical: 2,
        paddingHorizontal: 6,
        color: '#334155',
    },
    projectItem: {
        marginBottom: 10,
    },
    projectTitle: {
        fontSize: 10,
        fontFamily: 'Courier-Bold',
        color: '#0f172a',
        marginBottom: 2,
    },
    projectUrl: {
        fontSize: 8.5,
        color: '#2563eb',
        marginBottom: 3,
    }
});

export const TechTemplate = ({ data }: { data: CVData }) => (
    <Document title={`${data.personal.fullName} - Technical Resume`}>
        <Page size="A4" style={styles.page}>
            {/* Terminal Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{">"} {data.personal.fullName}</Text>
                <Text style={styles.title}>{data.personal.jobTitle || "Software Engineer"}</Text>
                <View style={styles.contactRow}>
                    {data.personal.email && <Text style={styles.contactItem}>[e] {data.personal.email}</Text>}
                    {data.personal.phone && <Text style={styles.contactItem}>[p] {data.personal.phone}</Text>}
                    {data.personal.location && <Text style={styles.contactItem}>[l] {data.personal.location}</Text>}
                </View>
                <View style={styles.contactRow}>
                    {data.personal.linkedin && <Text style={styles.contactItem}>[in] {data.personal.linkedin}</Text>}
                    {data.personal.website && <Text style={styles.contactItem}>[w] {data.personal.website}</Text>}
                </View>
            </View>

            {/* Summary */}
            {data.summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary.log</Text>
                    <Text style={styles.description}>{data.summary}</Text>
                </View>
            )}

            {/* Experience */}
            {data.experience?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience.sh</Text>
                    {data.experience.map((exp) => (
                        <View key={exp.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{exp.title}</Text>
                                <Text style={styles.itemDate}>{exp.startDate} - {exp.isCurrent ? "ongoing" : exp.endDate}</Text>
                            </View>
                            <Text style={styles.itemSub}>{exp.company}</Text>
                            <Text style={styles.description}>{exp.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Projects */}
            {data.projects?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects.git</Text>
                    {data.projects.map((proj) => (
                        <View key={proj.id} style={styles.projectItem}>
                            <Text style={styles.projectTitle}>{proj.name}</Text>
                            {proj.url && <Text style={styles.projectUrl}>{proj.url}</Text>}
                            <Text style={styles.description}>{proj.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Skills */}
            {data.skills?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>TechStack.json</Text>
                    <View style={styles.skillsGrid}>
                        {data.skills.map((skill) => (
                            <Text key={skill.id} style={styles.skillBadge}>{skill.name}</Text>
                        ))}
                    </View>
                </View>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education.edu</Text>
                    {data.education.map((edu) => (
                        <View key={edu.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{edu.degree}</Text>
                                <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
                            </View>
                            <Text style={styles.itemSub}>{edu.school}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Certificates */}
            {data.certificates && data.certificates.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Certificates.txt</Text>
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
