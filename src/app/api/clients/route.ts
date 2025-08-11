import { supprimerClient, ajouterClient, getClients } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { userID, customerName, customerEmail, customerAddress } =
		await req.json();

	try {
		await ajouterClient({
			user_id: userID,
			name: customerName,
			email: customerEmail,
			address: customerAddress,
		});
		return NextResponse.json(
			{ message: "Nouveau client créé !" },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Erreur lors de l'ajout du client:", err);
		return NextResponse.json(
			{ message: "Une erreur s'est produite", err },
			{ status: 400 }
		);
	}
}

export async function GET(req: NextRequest) {
   const userID = req.nextUrl.searchParams.get("userID");
    
	try {
		const clients = await getClients(userID!);
        return NextResponse.json({ message: "Clients récupérés avec succès !", clients }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Une erreur s'est produite", err },
			{ status: 400 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	const clientID = req.nextUrl.searchParams.get("id");

	try {
		await supprimerClient(Number(clientID));
		return NextResponse.json({ message: "Client supprimé !" }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Une erreur s'est produite", err },
			{ status: 400 }
		);
	}
}