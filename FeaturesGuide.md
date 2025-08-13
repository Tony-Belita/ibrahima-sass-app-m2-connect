# 📊 Guide d'Utilisation - Application SaaS de Facturation

> **Manuel d'utilisation complet pour votre plateforme de facturation professionnelle**

## 📑 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Authentification et Accès](#authentification-et-accès)
3. [Tableau de Bord - Création de Factures](#tableau-de-bord)
4. [Gestion des Clients](#gestion-des-clients)
5. [Gestion des Factures](#gestion-des-factures)
6. [Historique des Factures](#historique-des-factures)
7. [Paramètres et Configuration](#paramètres-et-configuration)
8. [Fonctionnalités Email](#fonctionnalités-email)
9. [API et Intégrations](#api-et-intégrations)
10. [FAQ et Dépannage](#faq-et-dépannage)

---

## 🎯 Vue d'ensemble

### Qu'est-ce que cette application ?

L'**Application SaaS de Facturation** est une solution moderne développée avec **Next.js 15** qui permet aux entreprises de :

- 🧾 **Créer des factures professionnelles** : Interface intuitive pour la création rapide
- 👥 **Gérer une base clients** : Stockage sécurisé des informations clients
- 📄 **Générer des PDF automatiquement** : Factures prêtes à imprimer et envoyer
- 📧 **Envoyer par email** : Templates professionnels avec Resend
- � **Suivre l'historique** : Toutes vos factures en un seul endroit
- 🏦 **Configurer les informations bancaires** : Multi-devises (EUR, USD)

### Architecture Technique Réelle

```
Frontend: Next.js 15 (App Router) + TypeScript + Tailwind CSS
UI Components: Aceternity UI + Tabler Icons + Motion/React
Backend: API Routes Next.js + Prisma ORM
Base de données: PostgreSQL (Neon Cloud)
Authentification: Clerk (SSO, Google, GitHub)
Email: Resend + React Email Templates
Impression: React-to-Print
Notifications: SweetAlert2
Validation: Zod + bcryptjs
Sécurité: next-secure-headers + CSRF + Rate Limiting
```

---

## 🔐 Authentification et Accès

### Système d'Authentification Clerk

L'application utilise **Clerk** comme service d'authentification moderne avec :

#### Options de Connexion
- 📧 **Email/Mot de passe** : Inscription et connexion traditionnelle
- 🔒 **Google OAuth** : Connexion rapide avec compte Google
- 🐙 **GitHub OAuth** : Connexion pour les développeurs
- 📱 **Authentification à 2 facteurs** : Sécurité renforcée

#### Processus d'Inscription
1. **Accès** : Rendez-vous sur l'URL de l'application
2. **Sign Up** : Cliquez sur "S'inscrire" 
3. **Vérification** : Confirmez votre email
4. **Profil** : Renseignez vos informations
5. **Dashboard** : Accès immédiat au tableau de bord

#### Sécurité Intégrée
- 🛡️ **Sessions sécurisées** : Tokens JWT avec expiration
- 🔒 **HTTPS obligatoire** : Chiffrement TLS 1.3
- 🚫 **Protection CSRF** : Validation des tokens
- 📝 **Logs d'audit** : Traçabilité des connexions
- ⏱️ **Rate limiting** : Protection contre les attaques brute-force

---

## 📊 Tableau de Bord - Création de Factures

### Interface Principale

Le **Dashboard** (`/dashboard`) est votre page d'accueil pour créer des factures :

#### Navigation Sidebar
```
🏠 Tableau de bord (/dashboard)
👥 Clients (/clients) 
📜 Historique (/history)
🧾 Factures (/facture)
⚙️ Paramètres (/settings)
```

#### Formulaire de Création de Facture

##### 1. Sélection du Client
```
🔍 Menu déroulant intelligent :
- Chargement automatique de tous vos clients
- Recherche par nom d'entreprise
- Sélection par ID client unique
- Option "Aller aux clients" si liste vide
```

##### 2. Configuration de Base
```
📝 Titre de la facture :
- Champ texte libre (obligatoire)
- Exemples : "Facture services web", "Prestation conseil"
- Affiché en en-tête de la facture PDF
```

##### 3. Gestion des Articles

**Interface Dynamique :**
```
📦 Nom de l'article (obligatoire)
💰 Coût unitaire (obligatoire) 
🔢 Quantité (par défaut : 1)
➕ Bouton "Ajouter article"
🗑️ Bouton "Supprimer" par ligne
```

**Calculs Automatiques :**
- ✅ **Coût total par ligne** : `Coût × Quantité`
- ✅ **Total général** : Somme de tous les articles
- ✅ **Mise à jour temps réel** : Calcul instantané
- ✅ **Validation** : Vérification des montants

##### 4. Prévisualisation Live

**Tableau des Articles :**
```
| Article | Quantité | Prix Unitaire | Total |
|---------|----------|---------------|-------|
| Service | 1        | 1500 €        | 1500 €|
| 
Montant Total : 1500 €
```

##### 5. Finalisation

**Bouton "Créer la facture" :**
- ✅ Validation des champs obligatoires
- ✅ Sauvegarde en base de données
- ✅ Génération automatique d'un ID unique
- ✅ Redirection vers `/facture/[id]` pour preview PDF

### Fonctionnalités Avancées

#### Gestion d'État Dynamique
- **Articles multiples** : Ajout/suppression illimités
- **Sauvegarde brouillon** : Protection contre la perte de données
- **Validation temps réel** : Vérification des champs
- **Messages d'erreur** : Feedback utilisateur immédiat

#### Intégration Clients
- **Récupération automatique** : Liste depuis `/api/clients`
- **Création à la volée** : Lien vers page clients
- **Données liées** : Facturation associée au bon client

---

## 👥 Gestion des Clients

### Page Clients (`/clients`)

#### Interface de Gestion Complète

**Navigation :**
- Sidebar identique avec highlight sur "Clients"
- Titre de page : "Gestion des Clients"
- Bouton d'action principal pour ajouter un client

#### Fonctionnalités Clients

##### Création de Clients
```
📋 Formulaire de saisie :
✏️ Nom de l'entreprise (obligatoire)
📧 Email de contact (obligatoire, validation format)
📍 Adresse complète (obligatoire)
👤 Associé à votre ID utilisateur automatiquement
📅 Date de création automatique
```

##### Liste et Gestion
```
📊 Tableau des clients existants :
- Affichage de tous vos clients
- Informations : Nom, Email, Adresse, Date création
- Actions par client : Modifier, Supprimer
- Recherche et filtrage (si implémenté)
```

##### Intégration Base de Données
```sql
-- Modèle Prisma Client
model Client {
  id              Int      @id @default(autoincrement())
  id_proprietaire String   // Votre ID Clerk
  nom             String   // Nom entreprise
  email           String   // Email contact
  adresse         String   // Adresse complète
  cree_le         DateTime @default(now())
  factures        Facture[] // Relation factures
}
```

#### API Endpoints Clients

**Récupération :** `GET /api/clients?userID=${user.id}`
**Création :** `POST /api/clients`
**Modification :** `PUT /api/clients`
**Suppression :** `DELETE /api/clients`
**Client unique :** `GET /api/clients/single?customerName=${nom}`

---

## 🧾 Gestion des Factures

### Page Factures (`/facture`)

#### Vue d'Ensemble des Factures

**Interface Principale :**
```
📋 Titre : "Gestion des Factures"
📝 Sous-titre : "Gérez et consultez toutes vos factures"
🔗 Bouton "Créer une facture" → redirection /dashboard
📊 Tableau complet de toutes vos factures
```

#### Tableau des Factures

**Colonnes Affichées :**
```
🆔 ID Facture (auto-incrémenté)
📝 Titre de la facture
👤 Client (nom de l'entreprise)
💰 Montant Total (formaté en €)
📅 Date de Création (format français)
⚡ Actions (Voir, Modifier, Supprimer)
```

**Actions Disponibles :**

##### 👁️ Voir la Facture
- **Lien :** `/facture/[id]`
- **Fonctionnalité :** Preview PDF complète
- **Icône :** `IconEye` (Tabler Icons)

##### ✏️ Modifier la Facture
- **Modal :** `ModalFacture` component
- **Modification :** Titre, articles, client
- **Sauvegarde :** Mise à jour en base de données

##### 🗑️ Supprimer la Facture
- **Confirmation :** SweetAlert2 popup
- **Action :** Suppression définitive
- **Feedback :** Notification de succès/erreur

#### Système de Modal pour Modification

**Composant `ModalFacture` :**
```tsx
// Fonctionnalités :
- Chargement des données facture existante
- Modification du titre
- Changement de client (dropdown)
- Modification des articles (ajout/suppression)
- Calculs automatiques en temps réel
- Sauvegarde avec validation
```

### Page Facture Individuelle (`/facture/[id]`)

#### Affichage PDF Professionnel

**Récupération des Données :**
```typescript
// API Calls automatiques :
1. GET /api/facture/single?factureID=${id}
2. GET /api/bank-info?userID=${factureData.id_proprietaire}

// Données chargées :
- Détails de la facture
- Informations client (via relation Prisma)
- Informations bancaires du propriétaire
```

**Template PDF :**
```
📄 Composant ComposantAImprimer :
├── Header avec titre "FACTURE"
├── Informations client (nom, email, adresse)
├── Détails facture (ID, date)
├── Tableau des articles (TableauFacture)
├── Total général
├── Informations bancaires (si configurées)
└── Mentions légales
```

#### Fonctionnalités d'Impression

**React-to-Print Integration :**
- 🖨️ **Bouton d'impression** : Génération PDF navigateur
- 📱 **Responsive** : Optimisé mobile et desktop
- 🎨 **Styles dédiés** : CSS spécifique impression
- 📋 **Format A4** : Pagination automatique

#### Composant TableauFacture

```tsx
// Affichage dynamique des articles :
- Parsing JSON des articles depuis BDD
- Colonnes : Article, Quantité, Prix Unitaire, Total
- Calcul automatique du total général
- Gestion des erreurs de parsing JSON
```

---

## 📜 Historique des Factures

### Page Historique (`/history`)

#### Vue Chronologique Complète

**Fonctionnalités :**
```
📅 Toutes vos factures par ordre chronologique
🔍 Même tableau que la page Factures
👁️ Actions identiques (Voir, Modifier, Supprimer)
📊 Informations complètes : ID, Titre, Client, Montant, Date
🔄 Chargement depuis la même API /api/facture
```

**Différences avec /facture :**
- **Focus historique** : Présentation chronologique
- **Icône spécifique** : `IconHistory` dans la navigation
- **Même fonctionnalités** : CRUD complet identique

#### Gestion des États

**États de Chargement :**
```typescript
const [factures, setFactures] = useState<Facture[]>([]);
const [chargement, setChargement] = useState<boolean>(true);
const [erreur, setErreur] = useState<string>("");

// Gestion des erreurs réseau et API
// Messages d'erreur utilisateur friendly
// Indicateur de chargement animé
```

---

## ⚙️ Paramètres et Configuration

### Page Paramètres (`/settings`)

#### Configuration des Informations Bancaires

**Interface de Configuration :**
```
🏦 Section "Informations Bancaires"
├── Nom du compte (ex: "Compte Professionnel")
├── Numéro de compte (IBAN/RIB)
├── Nom de la banque (ex: "Crédit Agricole")
├── Devise (EUR, USD, etc.)
└── Bouton "Mettre à jour"
```

**Fonctionnalités :**

##### Récupération Automatique
```typescript
// Au chargement de la page :
GET /api/bank-info?userID=${user.id}

// Pré-remplissage du formulaire si données existantes
// Gestion du cas "première configuration"
```

##### Sauvegarde et Mise à Jour
```typescript
// Soumission du formulaire :
POST /api/bank-info
{
  userID: user.id,
  bankName: nomBanque,
  accountNumber: numeroCompte,
  accountName: nomCompte,
  currency: devise
}
```

#### Modèle de Données Bancaires

```sql
-- Table InfosBancaires (Prisma)
model InfosBancaires {
  id              Int      @id @default(autoincrement())
  id_proprietaire String   @unique // Un seul compte par utilisateur
  nom_banque      String   // Nom de la banque
  numero_compte   String   // IBAN/RIB
  nom_compte      String   // Nom du compte
  devise          String   // EUR, USD, etc.
  cree_le         DateTime @default(now())
}
```

#### Intégration avec les Factures

**Affichage sur Factures :**
- Informations bancaires automatiquement ajoutées aux PDFs
- Récupération via l'ID propriétaire de la facture
- Affichage conditionnel (seulement si configuré)

**Sécurité :**
- Données chiffrées en base
- Accès restreint par utilisateur (userID)
- Validation des entrées avec Zod

---

## 📧 Fonctionnalités Email

### Système d'Envoi Resend

#### Configuration Email

**Integration Resend :**
```typescript
// Service email configuré avec :
- RESEND_API_KEY dans variables d''environnement
- Templates React Email
- Domaine vérifié pour l''envoi
- Rate limiting : 50 emails/heure
```

#### Endpoint d'Envoi

**API Route :** `POST /api/facture/envoi`

**Paramètres :**
```json
{
  "factureID": 123,
  "emailDestinataire": "client@example.com"
}
```

**Processus d'Envoi :**
1. Récupération des données facture
2. Génération du contenu email
3. Attachement PDF (si configuré)
4. Envoi via Resend
5. Retour de confirmation

#### Templates Email

**Structure Email :**
```
📧 Objet : "Facture #[ID] - [Titre]"
📝 Corps : Template professionnel HTML
📎 Pièce jointe : PDF de la facture
👤 Expéditeur : Votre email configuré
📬 Destinataire : Email client de la facture
```

### Notifications et Feedback

**SweetAlert2 Integration :**
- ✅ **Succès d'envoi** : Popup de confirmation
- ❌ **Erreur d'envoi** : Message d'erreur détaillé
- ⏳ **Loading** : Indicateur pendant l'envoi
- 📊 **Tracking** : ID email pour suivi

---

## 🔌 API et Intégrations

### Architecture API REST

#### Endpoints Disponibles

**Clients :**
```http
GET    /api/clients?userID={id}           # Liste clients
POST   /api/clients                       # Créer client  
PUT    /api/clients                       # Modifier client
DELETE /api/clients                       # Supprimer client
GET    /api/clients/single?customerName={nom} # Client spécifique
```

**Factures :**
```http
GET    /api/facture?userID={id}           # Liste factures
POST   /api/facture                       # Créer facture
PUT    /api/facture                       # Modifier facture  
DELETE /api/facture                       # Supprimer facture
GET    /api/facture/single?factureID={id} # Facture spécifique
POST   /api/facture/envoi                 # Envoyer par email
```

**Informations Bancaires :**
```http
GET    /api/bank-info?userID={id}         # Récupérer infos
POST   /api/bank-info                     # Créer/Modifier infos
```

#### Format des Réponses

**Succès :**
```json
{
  "success": true,
  "data": { /* données */ },
  "message": "Opération réussie"
}
```

**Erreur :**
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Description de l'erreur"
}
```

#### Sécurité API

**Protection Intégrée :**
- 🔐 **Authentication Clerk** : Tokens requis
- 🛡️ **Validation Zod** : Tous les inputs validés
- 🚫 **Rate Limiting** : 100 req/min par utilisateur
- 📝 **Logs détaillés** : Traçabilité complète
- 🔒 **CORS configuré** : Domaines autorisés seulement

### Base de Données Prisma

#### Schéma Complet

```prisma
model Facture {
  id               Int      @id @default(autoincrement())
  id_proprietaire  String   // ID Clerk utilisateur
  id_client        Int      // Foreign key vers Client
  titre            String   // Titre de la facture
  articles         Json     // Array des articles JSON
  montant_total    Decimal  @db.Decimal(10, 2)
  cree_le          DateTime @default(now())
  client           Client   @relation(fields: [id_client], references: [id])
}

model Client {
  id              Int      @id @default(autoincrement())
  id_proprietaire String   // ID Clerk utilisateur  
  nom             String   // Nom entreprise client
  email           String   // Email contact
  adresse         String   // Adresse complète
  cree_le         DateTime @default(now())
  factures        Facture[] // Relation one-to-many
}

model InfosBancaires {
  id              Int      @id @default(autoincrement())
  id_proprietaire String   @unique // Un seul compte par user
  nom_banque      String   // Nom de la banque
  numero_compte   String   // IBAN/RIB
  nom_compte      String   // Nom du compte  
  devise          String   // EUR, USD, etc.
  cree_le         DateTime @default(now())
}
```

#### Relations et Jointures

**Récupération avec Relations :**
```typescript
// Facture avec client inclus :
const facture = await prisma.facture.findUnique({
  where: { id: factureId },
  include: { client: true }
});

// Client avec toutes ses factures :
const client = await prisma.client.findUnique({
  where: { id: clientId },
  include: { factures: true }
});
```

---

## ❓ FAQ et Dépannage

### Questions Fréquentes

#### Installation et Configuration

**Q : Comment configurer les variables d'environnement ?**
```bash
# Créer un fichier .env.local avec :
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."
NEXTAUTH_SECRET="secret-securise"
CSRF_SECRET="csrf-secret"
```

**Q : Comment initialiser la base de données ?**
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

#### Utilisation

**Q : Pourquoi mes clients n'apparaissent pas dans le dropdown ?**
```
Vérifications :
1. Vous êtes bien connecté (Clerk user.id)
2. Vous avez créé des clients dans /clients
3. L'API /api/clients fonctionne
4. Aucune erreur dans la console navigateur
```

**Q : Comment modifier une facture existante ?**
```
1. Aller dans /facture ou /history
2. Cliquer sur l'icône "Modifier" (crayon)
3. Modal s'ouvre avec données pré-remplies
4. Modifier et cliquer "Sauvegarder"
```

**Q : Le PDF ne s'imprime pas correctement**
```
Solutions :
1. Utiliser Chrome/Edge (meilleur support)
2. Vérifier les marges d'impression
3. Sélectionner "Ajuster à la page"
4. Format A4 en orientation Portrait
```

#### Erreurs Courantes

**Erreur : "Client non trouvé"**
```
Causes possibles :
- Client supprimé entre temps
- Problème de synchronisation base
- ID client incorrect dans la facture

Solution :
- Vérifier l'existence du client
- Recréer le client si nécessaire
- Contacter le support si persistant
```

**Erreur : "Database connection failed"**
```
Vérifications :
1. NEON_DATABASE_URL correcte dans .env
2. Base de données Neon accessible
3. Schéma Prisma synchronisé (npx prisma db push)
4. Quotas Neon non dépassés
```

**Erreur : "Unauthorized" sur les API**
```
Causes :
- Session Clerk expirée
- Token d'authentification manquant
- Mauvaise configuration Clerk

Solutions :
- Se reconnecter
- Vérifier les clés Clerk dans .env
- Vider le cache navigateur
```

### Support et Maintenance

#### Performance

**Optimisations Implémentées :**
- ⚡ **Next.js 15** : App Router optimisé
- 🗃️ **Prisma** : Requêtes optimisées avec relations
- 📱 **Responsive** : Mobile-first design
- 🎨 **Tailwind CSS** : Styles optimisés
- 🔄 **React Hooks** : État géré efficacement

#### Monitoring

**Logs et Debugging :**
```typescript
// Console logs pour debugging :
console.log("📄 Réponse API facture:", donneesFacture);
console.log("✅ Données facture:", factureData);
console.log("👤 Données client:", factureData.client);

// Gestion d'erreurs avec try/catch
// Messages d'erreur utilisateur friendly
// Validation complète des entrées
```

#### Mises à Jour

**Versioning et Déploiement :**
- 🔄 **Git workflow** : Branches main/develop
- 🚀 **Vercel** : Déploiement automatique
- 🧪 **Tests** : Jest + React Testing Library
- 📊 **CI/CD** : GitHub Actions configuré

### Contact et Support

**Ressources Disponibles :**
- 📚 **Documentation** : README.md détaillé
- 🔗 **API Docs** : API.md complet
- 🚀 **Déploiement** : DEPLOYMENT.md
- 🤝 **Contribution** : CONTRIBUTING.md
- ⚖️ **Licence** : LICENSE

---

## 🎯 Conclusion

Cette application SaaS de facturation vous offre une solution complète et moderne pour :

### ✅ Fonctionnalités Réellement Disponibles

- **🧾 Création de factures** : Interface intuitive Dashboard
- **👥 Gestion clients** : CRUD complet avec base de données
- **📄 PDF automatique** : Génération et impression
- **📧 Envoi email** : Templates professionnels Resend
- **📊 Historique complet** : Toutes vos factures centralisées
- **🏦 Infos bancaires** : Configuration multi-devises
- **🔐 Sécurité** : Clerk + validation Zod + protection CSRF
- **📱 Responsive** : Interface mobile et desktop
- **🔌 API REST** : Endpoints complets documentés

### 🚀 Technologies Modernes

- **Frontend** : Next.js 15 + TypeScript + Tailwind
- **Backend** : Prisma ORM + PostgreSQL Neon
- **Auth** : Clerk (SSO, Google, GitHub)
- **UI** : Aceternity UI + Tabler Icons + Motion
- **Email** : Resend + React Email
- **Tests** : Jest + React Testing Library

### 📈 Prochaines Étapes

1. **🔧 Configuration** : Suivre le guide installation
2. **👥 Clients** : Créer votre base clients
3. **🧾 Factures** : Générer vos premières factures
4. **🏦 Banque** : Configurer vos informations bancaires
5. **📧 Email** : Tester l'envoi de factures

---

*📅 Dernière mise à jour : Août 2025*  
*✍️ Version : 2.0 (Basée sur le code réel)*  
*🔄 Mise à jour : Synchronisée avec GitHub*

---

