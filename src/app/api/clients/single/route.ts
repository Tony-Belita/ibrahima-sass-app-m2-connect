import { NextRequest, NextResponse } from "next/server";
import { getClientUnique } from "@/lib/actions";

export async function GET(req: NextRequest) {
   const nomClient = req.nextUrl.searchParams.get("name");
    
	try {
		const client = await getClientUnique(nomClient!)
        return NextResponse.json({ message: "Client récupéré avec succès !", client }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Une erreur s'est produite", err },
			{ status: 400 }
		);
	}
}