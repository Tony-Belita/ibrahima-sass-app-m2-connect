import { mettreAJourInfosBancaires, getInfosBancairesUtilisateur } from "@/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { accountName, userID, accountNumber, bankName, currency } = await req.json();
    try {
        await mettreAJourInfosBancaires({
            user_id: userID,
            bank_name: bankName,
            account_number: Number(accountNumber),
            account_name: accountName,
            currency: currency,
        });
        return NextResponse.json({ message: "Informations bancaires mises à jour !" }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { message: "Une erreur s'est produite", err },
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