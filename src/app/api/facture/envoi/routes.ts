import { NextRequest, NextResponse } from "next/server";
import TemplateEmailFacture from "@/app/emails/email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
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
    } = await req.json();

    try {
        const { data, error } = await resend.emails.send({
            from: `${nomEmetteur} <onboarding@resend.dev>`,
            to: [emailClient],
            subject: `Facture #${factureID} - ${titreFacture}`,
            react: TemplateEmailFacture({
                factureID,
                articles: JSON.parse(articles),
                montant: Number(montant),
                nomEmetteur,
                numeroCompte,
                devise,
                nomClient,
                emailClient,
                titreFacture,
                dateCreation,
            }) as React.ReactElement,
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