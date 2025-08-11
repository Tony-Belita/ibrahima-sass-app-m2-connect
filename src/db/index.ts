import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { tableFactures, tableClients, tableInfosBancaires } from './schema';

// Vérification de la présence de l'URL de la base de données Neon
if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL doit être une chaîne de connexion Postgres Neon valide');
}

/**
 * Instance de connexion SQL réutilisable pour les requêtes
 * Utilise la variable d'environnement NEON_DATABASE_URL
 */
export const sql = neon(process.env.NEON_DATABASE_URL!);

/**
 * Instance Drizzle ORM pour les opérations de base de données
 */
export const db = drizzle(sql, {
  schema: {
    tableFactures,
    tableClients,
    tableInfosBancaires,
  },
});

/**
 * Fonction pour obtenir la version de la base de données PostgreSQL
 * Utile pour vérifier la connexion et les informations système
 * @returns {Promise<{version: string}>} Version de PostgreSQL
 */
export const obtenirVersionBD = async (): Promise<{ version: string }> => {
  try {
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
  db,
  obtenirVersionBD,
  testerConnexionBD,
};
