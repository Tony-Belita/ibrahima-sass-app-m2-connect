import { prisma } from "@/lib/prisma";
import { 
  validateAndSanitize,
  sanitizeString,
  escapeHtml
} from "@/lib/validation";
import { z } from 'zod';

// ===== ACTIONS POUR LES FACTURES =====

// Créer une nouvelle facture avec validation
export const creerFacture = async (facture: {
  user_id: string;
  customer_id: number;
  title: string;
  items: string;
  total_amount: number;
}) => {
  try {
    // Validation des données d'entrée
    const validatedData = validateAndSanitize(z.object({
      user_id: z.string().min(1, 'ID utilisateur requis'),
      customer_id: z.number().int().positive('ID client invalide'),
      title: z.string().min(1, 'Titre requis').max(200, 'Titre trop long'),
      items: z.string().min(1, 'Articles requis'),
      total_amount: z.number().positive('Montant total invalide')
    }), facture);

    // Sécuriser le titre
    const titreSecurise = escapeHtml(sanitizeString(validatedData.title));

    // Valider et parser les articles JSON
    let articlesValides;
    try {
      articlesValides = JSON.parse(validatedData.items);
      if (!Array.isArray(articlesValides)) {
        throw new Error('Les articles doivent être un tableau');
      }
    } catch {
      throw new Error('Format des articles invalide');
    }

    return await prisma.facture.create({
      data: {
        id_proprietaire: validatedData.user_id,
        id_client: validatedData.customer_id,
        titre: titreSecurise,
        articles: validatedData.items,
        montant_total: validatedData.total_amount.toString(),
      },
    });
  } catch (error) {
    console.error('Erreur dans creerFacture:', error);
    throw error;
  }
};

// Récupérer toutes les factures de l'utilisateur avec validation
export const getFacturesUtilisateur = async (user_id: string) => {
  try {
    // Validation de l'ID utilisateur
    const validatedUserId = validateAndSanitize(
      z.string().min(1, 'ID utilisateur requis').max(255, 'ID utilisateur trop long'),
      user_id
    );

    return await prisma.facture.findMany({
      where: {
        id_proprietaire: validatedUserId,
      },
      include: {
        client: true,
      },
      orderBy: {
        cree_le: 'desc', // Plus récentes en premier
      },
    });
  } catch (error) {
    console.error('Erreur dans getFacturesUtilisateur:', error);
    throw new Error('Erreur lors de la récupération des factures');
  }
};

// Récupérer une seule facture avec validation
export const getFactureUnique = async (id: number) => {
  try {
    // Validation de l'ID
    const validatedId = validateAndSanitize(
      z.number().int().positive('ID de facture invalide'),
      id
    );

    return await prisma.facture.findUnique({
      where: {
        id: validatedId,
      },
      include: {
        client: true,
      },
    });
  } catch (error) {
    console.error('Erreur dans getFactureUnique:', error);
    throw new Error('Erreur lors de la récupération de la facture');
  }
};

// Supprimer une facture
export const supprimerFacture = async (id: number) => {
  return await prisma.facture.delete({
    where: {
      id: id,
    },
  });
};

// Modifier une facture
export const modifierFacture = async (id: number, facture: {
  customer_id: number;
  title: string;
  items: string;
  total_amount: number;
}) => {
  return await prisma.facture.update({
    where: {
      id: id,
    },
    data: {
      id_client: facture.customer_id,
      titre: facture.title,
      articles: facture.items,
      montant_total: facture.total_amount.toString(),
    },
  });
};

// ===== ACTIONS POUR LES CLIENTS =====

// Récupérer tous les clients de l'utilisateur
export const getClients = async (user_id: string) => {
  return await prisma.client.findMany({
    where: {
      id_proprietaire: user_id,
    },
    orderBy: {
      cree_le: 'desc',
    },
  });
};

// Récupérer un seul client par nom
export const getClientUnique = async (nom: string) => {
  return await prisma.client.findFirst({
    where: {
      nom: nom,
    },
  });
};

// Ajouter un nouveau client
export const ajouterClient = async (client: {
  user_id: string;
  name: string;
  email: string;
  address: string;
}) => {
  return await prisma.client.create({
    data: {
      id_proprietaire: client.user_id,
      nom: client.name,
      email: client.email,
      adresse: client.address,
    },
  });
};

// Supprimer un client
export const supprimerClient = async (id: number) => {
  return await prisma.client.delete({
    where: {
      id: id,
    },
  });
};

// Modifier un client
export const modifierClient = async (id: number, client: {
  name: string;
  email: string;
  address: string;
}) => {
  return await prisma.client.update({
    where: {
      id: id,
    },
    data: {
      nom: client.name,
      email: client.email,
      adresse: client.address,
    },
  });
};

// ===== ACTIONS POUR LES INFORMATIONS BANCAIRES =====

// Récupérer les informations bancaires de l'utilisateur
export const getInfosBancairesUtilisateur = async (user_id: string) => {
  return await prisma.infosBancaires.findUnique({
    where: {
      id_proprietaire: user_id,
    },
  });
};

// Mettre à jour ou créer les informations bancaires
export const mettreAJourInfosBancaires = async (infos: {
  user_id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  currency: string;
}) => {
  try {
    console.log('Tentative de mise à jour des infos bancaires pour:', infos.user_id);
    
    return await prisma.infosBancaires.upsert({
      where: {
        id_proprietaire: infos.user_id,
      },
      update: {
        nom_banque: infos.bank_name,
        numero_compte: infos.account_number,
        nom_compte: infos.account_name,
        devise: infos.currency,
      },
      create: {
        id_proprietaire: infos.user_id,
        nom_banque: infos.bank_name,
        numero_compte: infos.account_number,
        nom_compte: infos.account_name,
        devise: infos.currency,
      },
    });
  } catch (error) {
    console.error('Erreur dans mettreAJourInfosBancaires:', error);
    throw error;
  }
};
