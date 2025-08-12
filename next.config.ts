import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration de sécurité
  async headers() {
    return [
      {
        // Appliquer ces headers à toutes les routes
        source: '/(.*)',
        headers: [
          // Protection XSS
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Protection contre le sniffing de type MIME
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Protection contre le clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Politique de référent
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Protection contre les téléchargements malveillants
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
          // Politique stricte de transport de sécurité (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      },
      {
        // Headers spécifiques pour les pages de l'application
        source: '/app/(.*)',
        headers: [
          // Content Security Policy (CSP)
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://clerk.com https://*.clerk.accounts.dev;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https: blob:;
              connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev https://clerk.com https://*.amazonaws.com https://*.neon.tech;
              frame-src 'self' https://challenges.cloudflare.com https://clerk.com https://*.clerk.accounts.dev;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      },
      {
        // Headers pour les API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  },

  // Configuration pour la compilation
  serverExternalPackages: ['bcryptjs'],

  // Configuration des variables d'environnement
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
