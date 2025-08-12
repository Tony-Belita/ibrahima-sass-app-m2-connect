import { NextRequest } from 'next/server'
import crypto from 'crypto'

// ===== PROTECTION CSRF =====

// Générer un token CSRF
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Valider un token CSRF
export function validateCSRFToken(token: string, expected: string): boolean {
  if (!token || !expected) return false
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(expected, 'hex')
  )
}

// ===== RATE LIMITING BASIQUE =====

interface RateLimitEntry {
  count: number
  lastReset: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration du rate limiting
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Maximum 100 requêtes par fenêtre
  skipSuccessfulRequests: false,
}

// Fonction de rate limiting
export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now - entry.lastReset > RATE_LIMIT_CONFIG.windowMs) {
    // Nouvelle fenêtre de temps
    rateLimitStore.set(identifier, {
      count: 1,
      lastReset: now
    })
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1
    }
  }

  if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      remaining: 0
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - entry.count
  }
}

// Nettoyer les anciens entries du rate limit store
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.lastReset > RATE_LIMIT_CONFIG.windowMs) {
      rateLimitStore.delete(key)
    }
  }
}

// Nettoyer le store toutes les heures
setInterval(cleanupRateLimitStore, 60 * 60 * 1000)

// ===== VALIDATION DES ENTRÉES =====

// Détecter les tentatives d'injection SQL
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(UNION\s+ALL\s+SELECT)/i,
    /(\'\s*(OR|AND)\s*\'\d+\'\s*=\s*\'\d+)/i,
    /(--|\#|\/\*|\*\/)/,
    /(\bxp_cmdshell\b)/i,
    /(\bsp_executesql\b)/i
  ]

  return sqlPatterns.some(pattern => pattern.test(input))
}

// Détecter les tentatives XSS
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi
  ]

  return xssPatterns.some(pattern => pattern.test(input))
}

// Valider une entrée utilisateur de manière complète
export function validateUserInput(input: string, type: 'text' | 'email' | 'number' | 'json' = 'text'): {
  isValid: boolean
  errors: string[]
  sanitized?: string
} {
  const errors: string[] = []
  let sanitized = input

  // Vérifications de base
  if (typeof input !== 'string') {
    errors.push('L\'entrée doit être une chaîne de caractères')
    return { isValid: false, errors }
  }

  // Vérifier les tentatives d'injection
  if (detectSQLInjection(input)) {
    errors.push('Tentative d\'injection SQL détectée')
  }

  if (detectXSS(input)) {
    errors.push('Tentative XSS détectée')
  }

  // Vérifications spécifiques au type
  switch (type) {
    case 'email':
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (!emailRegex.test(input)) {
        errors.push('Format d\'email invalide')
      }
      break

    case 'number':
      if (!/^\d+(\.\d+)?$/.test(input)) {
        errors.push('Doit être un nombre valide')
      }
      break

    case 'json':
      try {
        JSON.parse(input)
      } catch {
        errors.push('JSON invalide')
      }
      break
  }

  // Nettoyer l'entrée si elle est valide
  if (errors.length === 0) {
    sanitized = input
      .trim()
      .replace(/[\x00-\x1F\x7F]/g, '') // Supprimer les caractères de contrôle
      .replace(/\s+/g, ' ') // Normaliser les espaces
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  }
}

// ===== SÉCURITÉ DES MOTS DE PASSE =====

// Générer un salt aléatoire
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

// Hacher un mot de passe avec bcrypt (si disponible) ou crypto
export async function hashPassword(password: string): Promise<string> {
  try {
    // Essayer d'utiliser bcrypt si disponible
    const bcrypt = await import('bcryptjs')
    const salt = await bcrypt.genSalt(12)
    return await bcrypt.hash(password, salt)
  } catch {
    // Fallback vers crypto natif
    const salt = generateSalt()
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    return `${salt}:${hash.toString('hex')}`
  }
}

// Vérifier un mot de passe
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Essayer bcrypt d'abord
    if (!hash.includes(':')) {
      const bcrypt = await import('bcryptjs')
      return await bcrypt.compare(password, hash)
    }
    
    // Fallback vers crypto natif
    const [salt, storedHash] = hash.split(':')
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    return storedHash === computedHash.toString('hex')
  } catch {
    return false
  }
}

// ===== AUDIT ET LOGGING =====

interface AuditLog {
  userId?: string
  action: string
  resource: string
  timestamp: Date
  ip?: string
  userAgent?: string
  success: boolean
  details?: Record<string, unknown>
}

// Logger pour l'audit (en production, utilisez un service externe)
export function logAuditEvent(event: AuditLog): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', {
      ...event,
      timestamp: event.timestamp.toISOString()
    })
  }
  
  // En production, envoyez vers un service de logging
  // comme Sentry, LogRocket, ou un service personnalisé
}

// Extraire des informations de la requête pour l'audit
export function extractRequestInfo(req: NextRequest): { ip: string; userAgent: string } {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown'
  
  const userAgent = req.headers.get('user-agent') || 'unknown'
  
  return { ip, userAgent }
}

// ===== UTILITAIRES DE CHIFFREMENT =====

// Chiffrer des données sensibles
export function encrypt(text: string, key: string): string {
  const algorithm = 'aes-256-gcm'
  const cipher = crypto.createCipher(algorithm, key)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  return `${authTag.toString('hex')}:${encrypted}`
}

// Déchiffrer des données
export function decrypt(encryptedText: string, key: string): string {
  const algorithm = 'aes-256-gcm'
  const [authTagHex, encrypted] = encryptedText.split(':')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = crypto.createDecipher(algorithm, key)
  decipher.setAuthTag(authTag)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
