import { creerFacture, getFacturesUtilisateur } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { customer, title, items, total, ownerID } = await req.json();

    try {
        const nouvelleFacture = await creerFacture({
            user_id: ownerID,
            customer_id: customer,
            title,
            total_amount: total,
            items: JSON.stringify(items),
        });
        
        return NextResponse.json(
            { 
                message: "Nouvelle facture créée !",
                facture: nouvelleFacture
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Erreur lors de la création de la facture:", err);
        return NextResponse.json(
            { message: "Une erreur s'est produite", err },
            { status: 400 }
        );
    }
}

export async function GET(req: NextRequest) {
    const userID = req.nextUrl.searchParams.get("userID");

    try {
        const factures = await getFacturesUtilisateur(userID!);
        return NextResponse.json({message: "Factures récupérées avec succès !", factures}, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { message: "Une erreur s'est produite", err },
            { status: 400 }
        );
    }
}