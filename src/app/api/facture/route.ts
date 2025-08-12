import { creerFacture, getFacturesUtilisateur, supprimerFacture, modifierFacture } from "@/lib/actions";
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

export async function DELETE(req: NextRequest) {
    const factureID = req.nextUrl.searchParams.get("id");

    try {
        await supprimerFacture(Number(factureID));
        return NextResponse.json({ message: "Facture supprimée !" }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { message: "Une erreur s'est produite", err },
            { status: 400 }
        );
    }
}

export async function PUT(req: NextRequest) {
    const { id, customer, title, items, total } = await req.json();

    try {
        const factureModifiee = await modifierFacture(id, {
            customer_id: customer,
            title,
            items: JSON.stringify(items),
            total_amount: total,
        });
        
        return NextResponse.json(
            { 
                message: "Facture modifiée avec succès !",
                facture: factureModifiee
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Erreur lors de la modification de la facture:", err);
        return NextResponse.json(
            { message: "Une erreur s'est produite", err },
            { status: 400 }
        );
    }
}