# 📋 Guide de Déploiement

## 🚀 Déploiement sur Vercel (Recommandé)

### Étape 1: Préparer le repository
```bash
# S'assurer que le code est sur GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Étape 2: Connecter à Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Importez votre repository `ibrahima-sass-app-m2-connect`

### Étape 3: Configuration des variables d'environnement
Dans les paramètres Vercel, ajoutez :

```env
# Base de données (Production)
DATABASE_URL=postgresql://prod-username:password@host:port/database

# Clerk (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Resend (Production)
RESEND_API_KEY=re_xxxxx

# Sécurité
NEXTAUTH_SECRET=production-secret-super-securise
CSRF_SECRET=production-csrf-secret

# Application
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

### Étape 4: Configuration du domaine
1. Dans les paramètres Vercel, ajoutez votre domaine personnalisé
2. Configurez les enregistrements DNS
3. Activez HTTPS automatique

## 🐳 Déploiement avec Docker

### Créer un Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose pour développement
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: saas_facturation
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## ☁️ Déploiement sur AWS

### Utiliser AWS Amplify
1. Connectez votre repository GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Configuration build
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## 🛠 Configuration de la Base de Données

### Neon (Recommandé)
1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez une nouvelle base de données
3. Copiez l'URL de connexion
4. Ajoutez-la comme variable d'environnement

### Supabase
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Récupérez l'URL PostgreSQL
3. Configurez les variables d'environnement

## 🔐 Configuration des Services

### Clerk (Authentication)
1. Créez un projet sur [clerk.dev](https://clerk.dev)
2. Configurez les URLs de redirection
3. Activez les providers sociaux si nécessaire
4. Récupérez les clés API

### Resend (Emails)
1. Créez un compte sur [resend.com](https://resend.com)
2. Vérifiez votre domaine
3. Générez une clé API
4. Configurez les templates d'emails

## 🚨 Checklist avant déploiement

- [ ] Tests passent (`npm test`)
- [ ] Build réussit (`npm run build`)
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Domaine configuré
- [ ] SSL activé
- [ ] Monitoring en place
- [ ] Sauvegarde configurée

## 📊 Monitoring et Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Ajoutez dans `app/layout.tsx` :
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

Configuration dans `sentry.client.config.js` :
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions
Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚀 Performance et Optimisation

### Configuration Next.js pour production
Dans `next.config.ts` :

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression
  compress: true,
  
  // Headers de sécurité déjà configurés
  // ...
};
```

## 🔒 Sécurité en Production

### Variables d'environnement sécurisées
- Utilisez des secrets forts (32+ caractères)
- Rotation régulière des clés API
- Séparation dev/staging/prod

### Monitoring de sécurité
- Logs d'accès
- Détection d'intrusion
- Sauvegarde régulière

---

✅ **Votre application est maintenant prête pour le déploiement !**
