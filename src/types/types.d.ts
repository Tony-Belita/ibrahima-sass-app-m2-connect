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
    id?: string;             // Identifiant unique de la facture 
    date_creation?: string;  // Date de création de la facture 
    id_utilisateur: string;  // Identifiant de l'utilisateur qui crée la facture
    id_client: number;       // Identifiant du client associé à la facture
    titre: string;           // Titre ou référence de la facture
    articles: string;        // Liste des articles (stockée en JSON stringifié)
    montant_total: number;   // Montant total de la facture
}

// Interface représentant un client
interface Client {
    id_utilisateur: string;  // Identifiant de l'utilisateur propriétaire du client
    nom: string;             // Nom du client
    email: string;           // Adresse email du client
    adresse: string;         // Adresse postale du client
}

// Interface représentant les informations bancaires de l'utilisateur
interface InfoBancaire {
    id_utilisateur: string;  // Identifiant de l'utilisateur
    nom_compte: string;      // Nom du titulaire du compte
    numero_compte: number;   // Numéro de compte
    nom_banque: string;      // Nom de la banque
    devise: string;          // Devise utilisée (EUR, USD)
}
