# 🧾 SaaS Facturation - Application de Gestion de Factures

Une application SaaS moderne et sécurisée pour la gestion de factures, développée avec Next.js 15, TypeScript, et Prisma.

## 🌟 **Fonctionnalités**

### 📋 **Gestion des Factures**
- ✅ Création, modification et suppression de factures
- ✅ Génération automatique de PDF
- ✅ Envoi par email avec template professionnel
- ✅ Historique complet des factures
- ✅ Prévisualisation avant impression

### 👥 **Gestion des Clients**
- ✅ Base de données clients complète
- ✅ Informations de contact et facturation
- ✅ Historique des interactions
- ✅ Recherche et filtrage avancés

### 🏦 **Informations Bancaires**
- ✅ Configuration des comptes bancaires
- ✅ Multi-devises (EUR, USD)
- ✅ Informations sécurisées et chiffrées

### 🔐 **Sécurité & Authentication**
- ✅ Authentication avec Clerk
- ✅ Protection CSRF et XSS
- ✅ Rate limiting
- ✅ Validation stricte des données (Zod)
- ✅ Headers de sécurité (CSP, HSTS)

## 🛠 **Technologies Utilisées**

### **Frontend**
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Aceternity UI** - Composants UI modernes
- **React-to-Print** - Impression de documents
- **SweetAlert2** - Notifications élégantes

### **Backend**
- **Prisma ORM** - Base de données type-safe
- **Neon PostgreSQL** - Base de données cloud
- **Zod** - Validation des schémas
- **bcryptjs** - Hachage des mots de passe

### **Services**
- **Clerk** - Authentication et gestion utilisateurs
- **Resend** - Envoi d'emails transactionnels
- **React Email** - Templates d'emails

### **Sécurité**
- **next-secure-headers** - Headers de sécurité
- **Middleware personnalisé** - Protection des routes
- **Validation d'entrée** - Protection contre les injections

## 🚀 **Installation et Configuration**

### **Prérequis**
- Node.js 18.17 ou plus récent
- npm ou yarn
- Base de données PostgreSQL (Neon recommandé)
- Comptes Clerk et Resend

### **1. Cloner le projet**
```bash
git clone https://github.com/Tony-Belita/ibrahima-sass-app-m2-connect.git
cd ibrahima-sass-app-m2-connect
```

### **2. Installer les dépendances**
```bash
npm install
```

### **3. Configuration des variables d'environnement**
Créez un fichier `.env.local` à la racine du projet :

```env

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Resend (Emails)
RESEND_API_KEY=re_xxxxx

# Sécurité
NEXTAUTH_SECRET=votre-secret-super-securise
CSRF_SECRET=votre-csrf-secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **4. Configuration de la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push

# (Optionnel) Voir la base de données
npx prisma studio
```

### **5. Lancer l'application**

```bash
# Mode développement
npm run dev

# Build de production
npm run build
npm start
```

## 📊 **Structure du Projet**

```
src/
├── app/                     # App Router (Next.js 15)
│   ├── api/                 # Routes API
│   │   ├── bank-info/       # Gestion informations bancaires
│   │   ├── clients/         # CRUD clients
│   │   └── facture/         # CRUD factures + envoi
│   ├── clients/             # Page gestion clients
│   ├── dashboard/           # Tableau de bord
│   ├── emails/              # Templates d'emails
│   ├── facture/             # Gestion factures
│   ├── history/             # Historique
│   └── settings/            # Paramètres
├── components/              # Composants réutilisables
│   └── ui/                  # Composants UI (Aceternity)
├── lib/                     # Utilitaires et configuration
│   ├── actions.ts           # Actions serveur
│   ├── env.ts               # Validation environnement
│   ├── prisma.ts            # Client Prisma
│   ├── security.ts          # Fonctions sécurité
│   ├── utils.ts             # Utilitaires généraux
│   └── validation.ts        # Schémas Zod
├── types/                   # Types TypeScript
└── __tests__/               # Tests unitaires et intégration
```

## 🧪 **Tests**

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage
```

## 🔒 **Sécurité**

L'application implémente les meilleures pratiques de sécurité :
- Authentication Clerk
- Validation Zod
- Protection CSRF/XSS
- Headers sécurisés
- Rate limiting

## 🚀 **Déploiement**

### **Vercel (Recommandé)**
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

---

⭐ **Si ce projet vous a plu, n'hésitez pas à lui donner une étoile !**
