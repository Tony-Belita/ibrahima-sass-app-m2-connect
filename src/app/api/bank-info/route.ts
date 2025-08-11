import { mettreAJourInfosBancaires, getInfosBancairesUtilisateur } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { accountName, userID, accountNumber, bankName, currency } = await req.json();
    
    console.log("Données reçues:", { accountName, userID, accountNumber, bankName, currency });
    
    // Validation des données
    if (!userID || !accountName || !accountNumber || !bankName || !currency) {
        return NextResponse.json(
            { message: "Tous les champs sont requis" },
            { status: 400 }
        );
    }
    
    try {
        console.log("Appel de la fonction mettreAJourInfosBancaires...");
        await mettreAJourInfosBancaires({
            user_id: userID,
            bank_name: bankName,
            account_number: accountNumber, // Garder en string pour le type numeric de Drizzle
            account_name: accountName,
            currency: currency,
        });
        console.log("Informations bancaires mises à jour avec succès");
        return NextResponse.json({ message: "Informations bancaires mises à jour !" }, { status: 201 });
    } catch (err) {
        console.error("Erreur dans la route bank-info:", err);
        return NextResponse.json(
            { message: "Une erreur s'est produite", erreur: err instanceof Error ? err.message : err },
            { status: 400 }
        );
    }
}

export async function GET(req: NextRequest) {
    const userID = req.nextUrl.searchParams.get("userID");

    try {
        const infosBancaires = await getInfosBancairesUtilisateur(userID!);
        return NextResponse.json({ message: "Informations bancaires récupérées", infosBancaires }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { message: "Une erreur s'est produite", err },
            { status: 400 }
        );
    }
}