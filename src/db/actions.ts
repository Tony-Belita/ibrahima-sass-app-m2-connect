import { db } from ".";
import { tableFactures, tableClients, tableInfosBancaires } from './schema';
import { desc, eq } from "drizzle-orm";

// Ajouter une nouvelle ligne à la table des factures
export const creerFacture = async (facture: any) => {
    await db.insert(tableFactures).values({
        id_proprietaire: facture.user_id,
        id_client: facture.customer_id,
        titre: facture.title,
        articles: facture.items,
        montant_total: facture.total_amount,
    });
};

// Récupérer toutes les factures de l'utilisateur
export const getFacturesUtilisateur = async (user_id: string) => {
    return await db.select().from(tableFactures).where(eq(tableFactures.id_proprietaire, user_id)).orderBy(desc(tableFactures.cree_le));
};

// Récupérer une seule facture
export const getFactureUnique = async (id: number) => {
    return await db.select().from(tableFactures).where(eq(tableFactures.id, id));
};

// Récupérer la liste des clients
export const getClients = async (user_id: string) => {
    return await db.select().from(tableClients).where(eq(tableClients.id_proprietaire, user_id)).orderBy(desc(tableClients.cree_le));
};

// Récupérer un seul client
export const getClientUnique = async (nom: string) => {
    return await db.select().from(tableClients).where(eq(tableClients.nom, nom));
};

// Ajouter une nouvelle ligne à la table des clients
export const ajouterClient = async (client: any) => {
    await db.insert(tableClients).values({
        id_proprietaire: client.user_id,
        nom: client.name,
        email: client.email,
        adresse: client.address,
    });
};

// Supprimer un client
export const supprimerClient = async (id: number) => {
    await db.delete(tableClients).where(eq(tableClients.id, id));
};

// Récupérer les informations bancaires de l'utilisateur
export const getInfosBancairesUtilisateur = async (user_id: string) => {
    return await db.select().from(tableInfosBancaires).where(eq(tableInfosBancaires.id_proprietaire, user_id));
};

// Mettre à jour les informations bancaires
export const mettreAJourInfosBancaires = async (infos: any) => {
    await db.insert(tableInfosBancaires)
        .values({
            id_proprietaire: infos.user_id,
            nom_banque: infos.bank_name,
            numero_compte: infos.account_number,
            nom_compte: infos.account_name,
            devise: infos.currency,
        })
        .onConflictDoUpdate({
            target: tableInfosBancaires.id_proprietaire,
            set: {
                nom_banque: infos.bank_name,
                numero_compte: infos.account_number,
                nom_compte: infos.account_name,
                devise: infos.currency,
            },
        });
};