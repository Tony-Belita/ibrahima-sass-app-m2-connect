import { z } from 'zod'

// Schéma de validation pour les variables d'environnement
const envSchema = z.object({
  // Variables Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Variables Clerk (authentification)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clé publique Clerk requise'),
  CLERK_SECRET_KEY: z.string().min(1, 'Clé secrète Clerk requise'),
  
  // Base de données Neon
  NEON_DATABASE_URL: z.string()
    .url('URL de base de données invalide')
    .refine(url => url.startsWith('postgresql://'), 'Doit être une URL PostgreSQL'),
  
  // Service d'email Resend
  RESEND_API_KEY: z.string()
    .min(1, 'Clé API Resend requise')
    .refine(key => key.startsWith('re_'), 'Clé API Resend invalide'),
  
  // URL de base de l'application
  NEXT_PUBLIC_BASE_URL: z.string()
    .url('URL de base invalide')
    .default('http://localhost:3000'),
  
  // Variables optionnelles pour la production
  NEXTAUTH_SECRET: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  ANALYTICS_ID: z.string().optional(),
})

// Type dérivé du schéma
type Env = z.infer<typeof envSchema>

// Fonction pour valider et charger les variables d'environnement
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err: z.ZodIssue) => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      }).join('\n')
      
      throw new Error(`Variables d'environnement manquantes ou invalides:\n${missingVars}`)
    }
    throw error
  }
}

// Variables d'environnement validées
export const env = validateEnv()

// Fonction pour vérifier la sécurité des variables en production
export function checkProductionSecurity(): void {
  if (env.NODE_ENV === 'production') {
    const warnings: string[] = []
    
    // Vérifier que les clés ne sont pas des valeurs de test
    if (env.CLERK_SECRET_KEY.includes('test')) {
      warnings.push('⚠️  Utilisation d\'une clé Clerk de test en production')
    }
    
    if (env.RESEND_API_KEY.includes('test')) {
      warnings.push('⚠️  Utilisation d\'une clé Resend de test en production')
    }
    
    if (env.NEON_DATABASE_URL.includes('localhost')) {
      warnings.push('⚠️  Utilisation d\'une base de données locale en production')
    }
    
    if (env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
      warnings.push('⚠️  URL de base configurée sur localhost en production')
    }
    
    // Vérifier la longueur des clés secrètes
    if (env.CLERK_SECRET_KEY.length < 50) {
      warnings.push('⚠️  Clé secrète Clerk potentiellement faible')
    }
    
    if (warnings.length > 0) {
      console.warn('🔐 AVERTISSEMENTS DE SÉCURITÉ:')
      warnings.forEach(warning => console.warn(warning))
    }
  }
}

// Fonction pour obtenir une variable d'environnement de manière sécurisée
export function getEnvVar(key: keyof Env, required: boolean = true): string | undefined {
  const value = env[key]
  
  if (required && !value) {
    throw new Error(`Variable d'environnement requise manquante: ${key}`)
  }
  
  return value as string | undefined
}

// Fonction pour masquer les valeurs sensibles dans les logs
export function sanitizeEnvForLogging(envVars: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['SECRET', 'KEY', 'PASSWORD', 'TOKEN', 'DATABASE_URL']
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(envVars)) {
    if (sensitiveKeys.some(sensitive => key.toUpperCase().includes(sensitive))) {
      if (typeof value === 'string' && value.length > 0) {
        sanitized[key] = `${value.substring(0, 4)}${'*'.repeat(Math.max(0, value.length - 8))}${value.substring(value.length - 4)}`
      } else {
        sanitized[key] = '[HIDDEN]'
      }
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

// Vérifier la configuration au démarrage
if (typeof window === 'undefined') { // Côté serveur uniquement
  checkProductionSecurity()
  
  // Log des variables d'environnement (sanitizées) en développement
  if (env.NODE_ENV === 'development') {
    console.log('🔧 Configuration de l\'environnement:', sanitizeEnvForLogging(env))
  }
}

// Export des variables les plus utilisées pour faciliter l'import
export const {
  NODE_ENV,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY,
  NEON_DATABASE_URL,
  RESEND_API_KEY,
  NEXT_PUBLIC_BASE_URL,
} = env
