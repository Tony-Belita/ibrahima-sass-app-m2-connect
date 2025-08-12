import { z } from 'zod'

// Schéma de validation pour les clients
export const ClientSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),
  
  email: z.string()
    .email('Format d\'email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères')
    .toLowerCase(),
  
  adresse: z.string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(500, 'L\'adresse ne peut pas dépasser 500 caractères')
    .trim(),
  
  user_id: z.string()
    .min(1, 'ID utilisateur requis')
    .max(255, 'ID utilisateur trop long')
})

// Schéma de validation pour les articles de facture
export const ArticleSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom de l\'article est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .trim(),
  
  prix: z.number()
    .positive('Le prix doit être positif')
    .max(999999.99, 'Le prix ne peut pas dépasser 999,999.99')
    .multipleOf(0.01, 'Le prix doit avoir au maximum 2 décimales'),
  
  quantite: z.number()
    .int('La quantité doit être un nombre entier')
    .positive('La quantité doit être positive')
    .max(9999, 'La quantité ne peut pas dépasser 9,999')
})

// Schéma de validation pour les factures
export const FactureSchema = z.object({
  titre: z.string()
    .min(1, 'Le titre est requis')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .trim(),
  
  id_client: z.number()
    .int('L\'ID client doit être un nombre entier')
    .positive('L\'ID client doit être positif'),
  
  articles: z.array(ArticleSchema)
    .min(1, 'Au moins un article est requis')
    .max(50, 'Maximum 50 articles par facture'),
  
  id_proprietaire: z.string()
    .min(1, 'ID propriétaire requis')
    .max(255, 'ID propriétaire trop long'),
  
  montant_total: z.number()
    .positive('Le montant total doit être positif')
    .max(9999999.99, 'Le montant total ne peut pas dépasser 9,999,999.99')
    .optional()
})

// Schéma pour la modification de facture
export const FactureUpdateSchema = FactureSchema.extend({
  id: z.number()
    .int('L\'ID doit être un nombre entier')
    .positive('L\'ID doit être positif')
})

// Schéma de validation pour les informations bancaires
export const InfosBancairesSchema = z.object({
  user_id: z.string()
    .min(1, 'ID utilisateur requis')
    .max(255, 'ID utilisateur trop long'),
  
  nom_banque: z.string()
    .min(2, 'Le nom de la banque doit contenir au moins 2 caractères')
    .max(100, 'Le nom de la banque ne peut pas dépasser 100 caractères')
    .trim(),
  
  iban: z.string()
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/, 'Format IBAN invalide')
    .min(15, 'IBAN trop court')
    .max(34, 'IBAN trop long'),
  
  bic: z.string()
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Format BIC invalide')
    .min(8, 'BIC doit contenir 8 ou 11 caractères')
    .max(11, 'BIC doit contenir 8 ou 11 caractères'),
  
  titulaire: z.string()
    .min(2, 'Le nom du titulaire doit contenir au moins 2 caractères')
    .max(100, 'Le nom du titulaire ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom du titulaire ne peut contenir que des lettres, espaces, apostrophes et tirets')
    .trim()
})

// Schémas pour les paramètres de requête
export const GetClientParamsSchema = z.object({
  userID: z.string()
    .min(1, 'UserID requis')
    .max(255, 'UserID trop long')
})

export const GetFactureParamsSchema = z.object({
  userID: z.string()
    .min(1, 'UserID requis')
    .max(255, 'UserID trop long'),
  
  id: z.string()
    .regex(/^\d+$/, 'ID doit être un nombre')
    .optional()
})

export const DeleteParamsSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'ID doit être un nombre')
})

// Types TypeScript dérivés des schémas
export type ClientInput = z.infer<typeof ClientSchema>
export type ArticleInput = z.infer<typeof ArticleSchema>
export type FactureInput = z.infer<typeof FactureSchema>
export type FactureUpdateInput = z.infer<typeof FactureUpdateSchema>
export type InfosBancairesInput = z.infer<typeof InfosBancairesSchema>
export type GetClientParams = z.infer<typeof GetClientParamsSchema>
export type GetFactureParams = z.infer<typeof GetFactureParamsSchema>
export type DeleteParams = z.infer<typeof DeleteParamsSchema>

// Fonction utilitaire pour valider et nettoyer les données
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ')
      throw new Error(`Données invalides: ${errorMessages}`)
    }
    throw error
  }
}

// Fonction pour valider les emails avec une regex plus stricte
export function validateEmailStrict(email: string): boolean {
  const strictEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return strictEmailRegex.test(email)
}

// Fonction pour échapper les caractères HTML (prévention XSS)
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Fonction pour nettoyer les chaînes de caractères
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Remplacer plusieurs espaces par un seul
    .replace(/[<>]/g, '') // Supprimer < et >
}
