import { 
    Body, 
    Container, 
    Head, 
    Heading, 
    Hr, 
    Html, 
    Preview, 
    Section, 
    Text,
    Row,
    Column
} from "@react-email/components";

interface PropsEmail {
    factureID: string;
    articles: Article[];
    montant: number;
    nomEmetteur: string;
    numeroCompte: string;
    devise: string;
    nomClient: string;
    titreFacture: string;
    dateCreation: string;
}

export default function TemplateEmailFacture({
    factureID,
    articles,
    montant,
    nomEmetteur,
    numeroCompte,
    devise,
    nomClient,
    titreFacture,
    dateCreation,
}: PropsEmail) {
    const montantFormate = Number(montant).toLocaleString('fr-FR', {
        style: 'currency',
        currency: devise === 'EUR' ? 'EUR' : 'USD'
    });

    return (
        <Html>
            <Head />
            <Preview>
                Facture #{factureID} de {nomEmetteur} - Montant: {montantFormate}
            </Preview>
            <Body style={styles.main}>
                <Container style={styles.container}>
                    {/* En-tête avec logo/marque */}
                    <Section style={styles.header}>
                        <Heading style={styles.headerTitle}>
                            💼 {nomEmetteur}
                        </Heading>
                        <Text style={styles.headerSubtitle}>
                            Facture professionnelle
                        </Text>
                    </Section>

                    {/* Information principale */}
                    <Section style={styles.mainSection}>
                        <Heading as="h2" style={styles.invoiceTitle}>
                            🧾 Facture #{factureID}
                        </Heading>
                        
                        <Text style={styles.greeting}>
                            Bonjour {nomClient},
                        </Text>
                        
                        <Text style={styles.description}>
                            Veuillez trouver ci-joint votre facture pour les services rendus. 
                            Nous vous remercions pour votre confiance.
                        </Text>
                    </Section>

                    {/* Détails de la facture */}
                    <Section style={styles.detailsSection}>
                        <Row>
                            <Column style={styles.detailColumn}>
                                <Text style={styles.detailLabel}>Date d&apos;émission:</Text>
                                <Text style={styles.detailValue}>{dateCreation}</Text>
                            </Column>
                            <Column style={styles.detailColumn}>
                                <Text style={styles.detailLabel}>Objet:</Text>
                                <Text style={styles.detailValue}>{titreFacture}</Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={styles.hr} />

                    {/* Articles/Services */}
                    <Section style={styles.itemsSection}>
                        <Heading as="h3" style={styles.sectionTitle}>
                            📋 Détail des prestations
                        </Heading>
                        
                        {/* En-tête du tableau */}
                        <Row style={styles.tableHeader}>
                            <Column style={{...styles.tableColumn, width: '45%'}}>
                                <Text style={styles.tableHeaderText}>Description</Text>
                            </Column>
                            <Column style={{...styles.tableColumn, width: '15%'}}>
                                <Text style={styles.tableHeaderText}>Qté</Text>
                            </Column>
                            <Column style={{...styles.tableColumn, width: '20%'}}>
                                <Text style={styles.tableHeaderText}>Prix unit.</Text>
                            </Column>
                            <Column style={{...styles.tableColumn, width: '20%'}}>
                                <Text style={styles.tableHeaderText}>Total</Text>
                            </Column>
                        </Row>

                        {/* Lignes d'articles */}
                        {articles && articles.map((article, index) => (
                            <Row key={index} style={styles.tableRow}>
                                <Column style={{...styles.tableColumn, width: '45%'}}>
                                    <Text style={styles.tableCellText}>{article.nom}</Text>
                                </Column>
                                <Column style={{...styles.tableColumn, width: '15%'}}>
                                    <Text style={styles.tableCellText}>{article.quantite}</Text>
                                </Column>
                                <Column style={{...styles.tableColumn, width: '20%'}}>
                                    <Text style={styles.tableCellText}>{article.coût.toFixed(2)} {devise}</Text>
                                </Column>
                                <Column style={{...styles.tableColumn, width: '20%'}}>
                                    <Text style={styles.tableCellText}>{article.prix.toFixed(2)} {devise}</Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={styles.hr} />

                    {/* Total */}
                    <Section style={styles.totalSection}>
                        <Row>
                            <Column style={{width: '70%'}}>
                                <Text style={styles.totalLabel}>Montant total à payer:</Text>
                            </Column>
                            <Column style={{width: '30%'}}>
                                <Text style={styles.totalAmount}>{montantFormate}</Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={styles.hr} />

                    {/* Informations de paiement */}
                    <Section style={styles.paymentSection}>
                        <Heading as="h3" style={styles.sectionTitle}>
                            💳 Informations de paiement
                        </Heading>
                        <Text style={styles.paymentText}>
                            <strong>Bénéficiaire:</strong> {nomEmetteur}
                        </Text>
                        <Text style={styles.paymentText}>
                            <strong>Numéro de compte:</strong> {numeroCompte}
                        </Text>
                        <Text style={styles.paymentText}>
                            <strong>Référence à mentionner:</strong> FACT-{factureID}
                        </Text>
                    </Section>

                    {/* Pied de page */}
                    <Section style={styles.footer}>
                        <Text style={styles.footerText}>
                            Merci pour votre confiance ! 🙏
                        </Text>
                        <Text style={styles.footerText}>
                            En cas de question, n&apos;hésitez pas à nous contacter.
                        </Text>
                        <Text style={styles.footerSmall}>
                            Cet email a été envoyé automatiquement. Merci de ne pas répondre directement à ce message.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles CSS-in-JS
const styles = {
    main: {
        backgroundColor: '#f6f9fc',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    container: {
        margin: '0 auto',
        padding: '20px 0 48px',
        maxWidth: '600px',
    },
    header: {
        backgroundColor: '#0ea5e9',
        borderRadius: '8px 8px 0 0',
        padding: '32px 24px',
        textAlign: 'center' as const,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: 'bold',
        margin: '0 0 8px 0',
    },
    headerSubtitle: {
        color: '#e0f2fe',
        fontSize: '16px',
        margin: '0',
    },
    mainSection: {
        backgroundColor: '#ffffff',
        padding: '32px 24px',
    },
    invoiceTitle: {
        color: '#1f2937',
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0 0 24px 0',
    },
    greeting: {
        color: '#374151',
        fontSize: '16px',
        margin: '0 0 16px 0',
    },
    description: {
        color: '#6b7280',
        fontSize: '14px',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
    },
    detailsSection: {
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderLeft: '4px solid #0ea5e9',
    },
    detailColumn: {
        verticalAlign: 'top' as const,
    },
    detailLabel: {
        color: '#6b7280',
        fontSize: '12px',
        fontWeight: 'bold',
        margin: '0 0 4px 0',
        textTransform: 'uppercase' as const,
    },
    detailValue: {
        color: '#1f2937',
        fontSize: '14px',
        margin: '0',
    },
    hr: {
        borderColor: '#e5e7eb',
        margin: '24px 0',
    },
    itemsSection: {
        backgroundColor: '#ffffff',
        padding: '0 24px',
    },
    sectionTitle: {
        color: '#1f2937',
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '0 0 16px 0',
    },
    tableHeader: {
        backgroundColor: '#f3f4f6',
        borderRadius: '6px 6px 0 0',
    },
    tableRow: {
        borderBottom: '1px solid #e5e7eb',
    },
    tableColumn: {
        padding: '12px 8px',
        verticalAlign: 'top' as const,
    },
    tableHeaderText: {
        color: '#374151',
        fontSize: '12px',
        fontWeight: 'bold',
        margin: '0',
        textTransform: 'uppercase' as const,
    },
    tableCellText: {
        color: '#6b7280',
        fontSize: '14px',
        margin: '0',
    },
    totalSection: {
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderRadius: '8px',
    },
    totalLabel: {
        color: '#1f2937',
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '0',
        textAlign: 'right' as const,
    },
    totalAmount: {
        color: '#0ea5e9',
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0',
        textAlign: 'right' as const,
    },
    paymentSection: {
        backgroundColor: '#ffffff',
        padding: '24px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
    },
    paymentText: {
        color: '#374151',
        fontSize: '14px',
        margin: '0 0 8px 0',
    },
    footer: {
        backgroundColor: '#f9fafb',
        borderRadius: '0 0 8px 8px',
        padding: '24px',
        textAlign: 'center' as const,
    },
    footerText: {
        color: '#6b7280',
        fontSize: '14px',
        margin: '0 0 8px 0',
    },
    footerSmall: {
        color: '#9ca3af',
        fontSize: '12px',
        margin: '16px 0 0 0',
    },
};