import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
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

        // Vérifier que toutes les données nécessaires sont présentes
        if (!factureID || !emailClient || !nomClient || !titreFacture) {
            console.error(" Données manquantes:", {
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

        console.log(" Toutes les données nécessaires sont présentes");
        console.log(" Clé API Resend:", process.env.RESEND_API_KEY ? "Définie" : "Non définie");

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
                        ${JSON.parse(articles).map((article: any) => `
                            <tr>
                                <td>${article.nom}</td>
                                <td>${article.quantite}</td>
                                <td>${article.coût.toFixed(2)} ${devise}</td>
                                <td>${article.prix.toFixed(2)} ${devise}</td>
                            </tr>
                        `).join('')}
                        <tr class="total">
                            <td colspan="3"><strong>Total général</strong></td>
                            <td><strong>${Number(montant).toFixed(2)} ${devise}</strong></td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <p>Merci pour votre confiance !</p>
                    <p>Cette facture a été générée automatiquement.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const { data, error } = await resend.emails.send({
            from: `${nomEmetteur} <onboarding@resend.dev>`,
            to: [emailClient],
            subject: `Facture #${factureID} - ${titreFacture}`,
            html: htmlContent,
        });

        if (error) {
            console.error("Erreur Resend:", error);
            return NextResponse.json(
                { message: "Échec de l'envoi de l'email !", erreur: error },
                { status: 500 }
            );
        }

        console.log("Email envoyé avec succès:", data);
        return NextResponse.json(
            { 
                message: "Email envoyé avec succès !",
                donnees: data 
            }, 
            { status: 200 }
        );
    } catch (erreur) {
        console.error("Erreur lors de l'envoi:", erreur);
        return NextResponse.json(
            { 
                message: "Erreur lors de l'envoi de l'email !", 
                erreur: erreur instanceof Error ? erreur.message : erreur 
            },
            { status: 500 }
        );
    }
}