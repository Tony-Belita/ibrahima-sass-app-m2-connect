import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
    try {
        // Initialiser Resend à l'intérieur de la fonction pour éviter les erreurs de build
        const resend = new Resend(process.env.RESEND_API_KEY!);
        
        // Parsing sécurisé du JSON
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("❌ Erreur de parsing JSON:", parseError);
            return NextResponse.json(
                { message: "Format de données invalide" },
                { status: 400 }
            );
        }
        
        console.log("📧 Données reçues dans l'API:", body);
        
        const {
            factureID,
            articles,
            titreFacture,
            montant,
            emailClient,
            nomClient,
            nomEmetteur,
            numeroCompte,
            devise,
            dateCreation,
        } = body;

        // Vérifier que la clé API Resend est disponible
        if (!process.env.RESEND_API_KEY) {
            console.error("Clé API Resend non définie");
            return NextResponse.json(
                { message: "Configuration email manquante" },
                { status: 500 }
            );
        }

        // Vérifier que toutes les données nécessaires sont présentes
        if (!factureID || !emailClient || !nomClient || !titreFacture) {
            console.error("❌ Données manquantes:", {
                factureID,
                emailClient,
                nomClient,
                titreFacture
            });
            return NextResponse.json(
                { message: "Données manquantes pour l'envoi de l'email" },
                { status: 400 }
            );
        }

        // Validation et parsing sécurisé des articles
        let articlesArray;
        try {
            if (typeof articles === 'string') {
                articlesArray = JSON.parse(articles);
            } else if (Array.isArray(articles)) {
                articlesArray = articles;
            } else {
                throw new Error("Format d'articles invalide");
            }
            
            // Vérifier que c'est bien un tableau
            if (!Array.isArray(articlesArray)) {
                throw new Error("Les articles doivent être un tableau");
            }
            
            // Valider chaque article
            articlesArray.forEach((article, index) => {
                if (!article.nom || typeof article.nom !== 'string') {
                    throw new Error(`Article ${index}: nom manquant ou invalide`);
                }
                if (!article.quantite || typeof article.quantite !== 'number' || article.quantite <= 0) {
                    throw new Error(`Article ${index}: quantité manquante ou invalide`);
                }
                // Vérifier qu'il y a au moins un prix (coût ou prix)
                if (!article.coût && !article.prix) {
                    throw new Error(`Article ${index}: prix manquant`);
                }
            });
        } catch (parseError) {
            console.error("❌ Erreur de parsing des articles:", parseError);
            return NextResponse.json(
                { message: "Format des articles invalide", erreur: parseError instanceof Error ? parseError.message : parseError },
                { status: 400 }
            );
        }

        // Valider les autres données
        if (!montant || isNaN(Number(montant)) || Number(montant) <= 0) {
            console.error("❌ Montant invalide:", montant);
            return NextResponse.json(
                { message: "Montant invalide" },
                { status: 400 }
            );
        }

        if (!nomEmetteur || !numeroCompte || !devise || !dateCreation) {
            console.error("❌ Informations de facturation incomplètes:", {
                nomEmetteur,
                numeroCompte,
                devise,
                dateCreation
            });
            return NextResponse.json(
                { message: "Informations de facturation incomplètes" },
                { status: 400 }
            );
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailClient)) {
            console.error("❌ Format d'email invalide:", emailClient);
            return NextResponse.json(
                { message: "Format d'email invalide" },
                { status: 400 }
            );
        }

        // template HTML simple au lieu d'utiliser React Email qui pose problème
        const htmlContent = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #333; margin: 0; }
                .info-section { margin-bottom: 20px; }
                .info-section h3 { color: #666; margin-bottom: 10px; }
                .info-section p { margin: 5px 0; color: #333; }
                .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .table th { background-color: #f8f9fa; color: #333; font-weight: bold; }
                .total { background-color: #e9ecef; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Facture #${factureID}</h1>
                    <p>${titreFacture}</p>
                </div>
                
                <div class="info-section">
                    <h3>Informations de facturation :</h3>
                    <p><strong>De :</strong> ${nomEmetteur}</p>
                    <p><strong>Pour :</strong> ${nomClient}</p>
                    <p><strong>Email :</strong> ${emailClient}</p>
                    <p><strong>Date :</strong> ${dateCreation}</p>
                    <p><strong>N° de compte :</strong> ${numeroCompte}</p>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${articlesArray.map((article: { nom: string; quantite: number; coût?: number; prix?: number }) => {
                            // Gestion sécurisée des calculs avec vérification de division par zéro
                            let coutUnitaire = 0;
                            let prixTotal = 0;
                            
                            if (article.coût && article.coût > 0) {
                                coutUnitaire = article.coût;
                                prixTotal = article.coût * article.quantite;
                            } else if (article.prix && article.prix > 0 && article.quantite > 0) {
                                coutUnitaire = article.prix / article.quantite;
                                prixTotal = article.prix;
                            }
                            
                            return `
                                <tr>
                                    <td>${article.nom}</td>
                                    <td>${article.quantite}</td>
                                    <td>${coutUnitaire.toFixed(2)} ${devise}</td>
                                    <td>${prixTotal.toFixed(2)} ${devise}</td>
                                </tr>
                            `;
                        }).join('')}
                        <tr class="total">
                            <td colspan="3"><strong>Total général</strong></td>
                            <td><strong>${Number(montant).toFixed(2)} ${devise}</strong></td>
                        </tr>
                    </tbody>
                </table>

                <div class="info-section" style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                    <h3 style="color: #333; margin-bottom: 15px;">💳 Informations de paiement</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <p style="margin: 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">Nom du compte :</p>
                            <p style="margin: 5px 0; color: #333; font-weight: bold;">${nomEmetteur}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">Numéro de compte :</p>
                            <p style="margin: 5px 0; color: #333; font-weight: bold; font-family: monospace;">${numeroCompte}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">Devise :</p>
                            <p style="margin: 5px 0; color: #333; font-weight: bold;">${devise}</p>
                        </div>
                    </div>
                    <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 3px solid #2196f3;">
                        <p style="margin: 0; color: #1565c0; font-weight: bold; font-size: 14px;">
                            🏷️ Référence de paiement : FACT-${factureID}
                        </p>
                        <p style="margin: 5px 0 0 0; color: #1976d2; font-size: 12px;">
                            Veuillez mentionner cette référence lors de votre virement bancaire.
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p>Merci pour votre confiance !</p>
                    <p>Cette facture a été générée automatiquement.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Tentative d'envoi avec gestion d'erreurs améliorée
        let emailResult;
        try {
            emailResult = await resend.emails.send({
                from: `${nomEmetteur} <onboarding@resend.dev>`,
                to: [emailClient],
                subject: `Facture #${factureID} - ${titreFacture}`,
                html: htmlContent,
            });
        } catch (sendError) {
            console.error("❌ Erreur lors de l'appel à l'API Resend:", sendError);
            return NextResponse.json(
                { 
                    message: "Échec de l'envoi de l'email !", 
                    erreur: sendError instanceof Error ? sendError.message : "Erreur inconnue lors de l'envoi"
                },
                { status: 500 }
            );
        }

        const { data, error } = emailResult;

        if (error) {
            console.error("❌ Erreur Resend:", error);
            return NextResponse.json(
                { 
                    message: "Échec de l'envoi de l'email !", 
                    erreur: error,
                    details: "L'API Resend a retourné une erreur"
                },
                { status: 500 }
            );
        }

        if (!data) {
            console.error("❌ Aucune donnée retournée par Resend");
            return NextResponse.json(
                { 
                    message: "Échec de l'envoi de l'email !", 
                    erreur: "Aucune donnée retournée par le service d'email"
                },
                { status: 500 }
            );
        }

        console.log("✅ Email envoyé avec succès:", data);
        return NextResponse.json(
            { 
                message: "Email envoyé avec succès !",
                donnees: data 
            }, 
            { status: 200 }
        );
    } catch (erreur) {
        console.error("❌ Erreur lors de l'envoi:", erreur);
        
        // Gestion d'erreurs plus détaillée
        let messageErreur = "Erreur lors de l'envoi de l'email !";
        let detailsErreur = erreur instanceof Error ? erreur.message : "Erreur inconnue";
        
        if (erreur instanceof TypeError) {
            messageErreur = "Erreur de type de données";
        } else if (erreur instanceof SyntaxError) {
            messageErreur = "Erreur de format des données";
        } else if (erreur instanceof Error && erreur.message.includes("fetch")) {
            messageErreur = "Erreur de connexion réseau";
        }
        
        return NextResponse.json(
            { 
                message: messageErreur, 
                erreur: detailsErreur,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}