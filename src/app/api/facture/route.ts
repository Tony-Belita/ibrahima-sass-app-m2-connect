import { creerFacture, getFacturesUtilisateur, supprimerFacture, modifierFacture } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { customer, title, items, total, ownerID } = await req.json();

        // Validation des données requises
        if (!customer || !title || !items || !total || !ownerID) {
            return NextResponse.json(
                { message: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        // Validation des types
        if (typeof customer !== 'number' || typeof total !== 'number' || !Array.isArray(items)) {
            return NextResponse.json(
                { message: "Types de données invalides" },
                { status: 400 }
            );
        }

        const nouvelleFacture = await creerFacture({
            user_id: ownerID,
            customer_id: customer,
            title: title.trim(),
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
            { message: "Une erreur s'est produite lors de la création de la facture" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const userID = req.nextUrl.searchParams.get("userID");

        if (!userID) {
            return NextResponse.json(
                { message: "ID utilisateur requis" },
                { status: 400 }
            );
        }

        const factures = await getFacturesUtilisateur(userID);
        return NextResponse.json(
            { message: "Factures récupérées avec succès !", factures }, 
            { status: 200 }
        );
    } catch (err) {
        console.error("Erreur lors de la récupération des factures:", err);
        return NextResponse.json(
            { message: "Une erreur s'est produite lors de la récupération" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const factureID = req.nextUrl.searchParams.get("id");

        if (!factureID || isNaN(Number(factureID))) {
            return NextResponse.json(
                { message: "ID de facture valide requis" },
                { status: 400 }
            );
        }

        await supprimerFacture(Number(factureID));
        return NextResponse.json(
            { message: "Facture supprimée avec succès !" }, 
            { status: 200 }
        );
    } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        return NextResponse.json(
            { message: "Une erreur s'est produite lors de la suppression" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, customer, title, items, total } = await req.json();

        // Validation des données
        if (!id || !customer || !title || !items || !total) {
            return NextResponse.json(
                { message: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        if (typeof customer !== 'number' || typeof total !== 'number' || !Array.isArray(items)) {
            return NextResponse.json(
                { message: "Types de données invalides" },
                { status: 400 }
            );
        }

        const factureModifiee = await modifierFacture(id, {
            customer_id: customer,
            title: title.trim(),
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
            { message: "Une erreur s'est produite lors de la modification" },
            { status: 500 }
        );
    }
}