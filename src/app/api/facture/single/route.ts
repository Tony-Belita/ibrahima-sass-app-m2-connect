import { NextRequest, NextResponse } from "next/server";
import { getFactureUnique } from "@/lib/actions";

export async function GET(req: NextRequest) {
    const factureID = req.nextUrl.searchParams.get("id");

    try {
        const facture = await getFactureUnique(Number(factureID));
        return NextResponse.json({ message: "Facture récupérée avec succès !", facture }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { message: "Une erreur s'est produite", err },
            { status: 400 }
        );
    }
}
