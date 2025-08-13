import { supprimerClient, ajouterClient, getClients, modifierClient } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { userID, customerName, customerEmail, customerAddress } = await req.json();

		// Validation des données requises
		if (!userID || !customerName || !customerEmail || !customerAddress) {
			return NextResponse.json(
				{ message: "Tous les champs sont requis" },
				{ status: 400 }
			);
		}

		// Validation de l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(customerEmail)) {
			return NextResponse.json(
				{ message: "Format d'email invalide" },
				{ status: 400 }
			);
		}

		await ajouterClient({
			user_id: userID,
			name: customerName.trim(),
			email: customerEmail.toLowerCase().trim(),
			address: customerAddress.trim(),
		});
		
		return NextResponse.json(
			{ message: "Nouveau client créé avec succès !" },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Erreur lors de l'ajout du client:", err);
		return NextResponse.json(
			{ message: "Une erreur s'est produite lors de l'ajout du client" },
			{ status: 500 }
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

export async function PUT(req: NextRequest) {
	const { id, customerName, customerEmail, customerAddress } = await req.json();

	try {
		const clientModifie = await modifierClient(id, {
			name: customerName,
			email: customerEmail,
			address: customerAddress,
		});
		return NextResponse.json(
			{ message: "Client modifié avec succès !", client: clientModifie },
			{ status: 200 }
		);
	} catch (err) {
		console.error("Erreur lors de la modification du client:", err);
		return NextResponse.json(
			{ message: "Une erreur s'est produite", err },
			{ status: 400 }
		);
	}
}