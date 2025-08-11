// Interface représentant un élément/article dans une facture
interface Article {
    id: string;              // Identifiant unique de l'article
    nom: string;             // Nom ou description de l'article
    coût: number;            // Coût unitaire de l'article
    quantite: number;        // Quantité commandée
    prix: number;            // Prix total (coût * quantite)
}

// Interface représentant une facture complète
interface Facture {
    id: number;              // Identifiant unique de la facture 
    id_proprietaire: string; // Identifiant du propriétaire/utilisateur
    id_client: number;       // Identifiant du client associé à la facture
    titre: string;           // Titre ou référence de la facture
    articles: string;        // Liste des articles (stockée en JSON stringifié)
    montant_total: string;   // Montant total de la facture (Decimal en string)
    cree_le: string;         // Date de création de la facture
    client?: {               // Information du client (via relation Prisma)
        id: number;
        nom: string;
        email: string;
        adresse: string;
    };
}

// Interface représentant un client
interface Client {
    id: number;              // Identifiant unique du client
    id_proprietaire: string; // Identifiant de l'utilisateur propriétaire du client
    nom: string;             // Nom du client
    email: string;           // Adresse email du client
    adresse: string;         // Adresse postale du client
    cree_le: string;         // Date de création
}

// Interface représentant les informations bancaires de l'utilisateur
interface InfoBancaire {
    id: number;              // Identifiant unique
    id_proprietaire: string; // Identifiant de l'utilisateur
    nom_banque: string;      // Nom de la banque
    numero_compte: string;   // Numéro de compte bancaire
    nom_compte: string;      // Nom du compte
    devise: string;          // Devise utilisée
    cree_le: string;         // Date de création
}
