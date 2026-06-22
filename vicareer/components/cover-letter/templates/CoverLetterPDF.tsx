import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKIGJYt61SQlNhQ-U.ttf' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKIGJYt61SQlNhQ-U.ttf', fontWeight: 'bold' }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 60,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.6,
        color: '#111827',
    },
    header: {
        marginBottom: 40,
    },
    name: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
    },
    contactDiv: {
        color: '#6B7280',
        fontSize: 10,
    },
    date: {
        marginBottom: 20,
    },
    companyInfo: {
        marginBottom: 30,
        fontFamily: 'Helvetica-Bold',
    },
    content: {
        marginTop: 10,
        textAlign: 'justify',
    }
});

interface CoverLetterPDFProps {
    fullName?: string;
    position?: string;
    company?: string;
    content: string;
}

export const CoverLetterPDF = ({ fullName, position, company, content }: CoverLetterPDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{fullName || 'Ad Soyad'}</Text>
                <Text style={styles.contactDiv}>Motivasyon Mektubu - {position}</Text>
            </View>

            <Text style={styles.date}>{new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            <Text style={styles.companyInfo}>Sayın İlgili, {company}</Text>

            <View style={styles.content}>
                <Text>{content}</Text>
            </View>
        </Page>
    </Document>
);
