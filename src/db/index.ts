import { neon } from '@neondatabase/serverless';

// Vérification de la présence de l'URL de la base de données Neon
if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL doit être une chaîne de connexion Postgres Neon valide');
}

/**
 * Fonction pour obtenir la version de la base de données PostgreSQL
 * Utile pour vérifier la connexion et les informations système
 * @returns {Promise<{version: string}>} Version de PostgreSQL
 */
export const obtenirVersionBD = async (): Promise<{ version: string }> => {
  try {
    // Création de la connexion SQL avec Neon
    const sql = neon(process.env.NEON_DATABASE_URL!);
    
    // Exécution de la requête pour obtenir la version
    const reponse = await sql`SELECT version()`;
    
    return { 
      version: reponse[0].version 
    };
  } catch (erreur) {
    console.error('Erreur lors de la récupération de la version de la base de données:', erreur);
    throw new Error('Impossible de se connecter à la base de données Neon');
  }
};

/**
 * Instance de connexion SQL réutilisable pour les requêtes
 * Utilise la variable d'environnement NEON_DATABASE_URL
 */
export const sql = neon(process.env.NEON_DATABASE_URL!);

/**
 * Fonction utilitaire pour tester la connexion à la base de données
 * @returns {Promise<boolean>} true si la connexion est établie, false sinon
 */
export const testerConnexionBD = async (): Promise<boolean> => {
  try {
    await obtenirVersionBD();
    console.log('✅ Connexion à la base de données Neon établie avec succès');
    return true;
  } catch (erreur) {
    console.error('❌ Échec de la connexion à la base de données:', erreur);
    return false;
  }
};

/**
 * Configuration et export des utilitaires de base de données
 * Toutes les fonctions utilisent la connexion Neon configurée
 */
export default {
  sql,
  obtenirVersionBD,
  testerConnexionBD,
};
