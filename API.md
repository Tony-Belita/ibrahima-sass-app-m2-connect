# 📡 Documentation API

## 🌟 Vue d'ensemble

L'API SaaS Facturation fournit des endpoints RESTful pour la gestion complète des factures, clients et informations bancaires.

**Base URL:** `https://votre-domaine.com/api`

## 🔐 Authentication

Toutes les routes API sont protégées par Clerk. Incluez le token d'authentication dans les headers :

```http
Authorization: Bearer YOUR_CLERK_TOKEN
```

## 📋 Endpoints Clients

### GET /api/clients
Récupère la liste des clients de l'utilisateur connecté.

**Paramètres de requête:**
- `userID` (string, requis) - ID de l'utilisateur

**Réponse:**
```json
{
  "success": true,
  "clients": [
    {
      "id": 1,
      "nom": "Entreprise ABC",
      "email": "contact@abc.com",
      "adresse": "123 Rue Example",
      "cree_le": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/clients
Crée un nouveau client.

**Corps de la requête:**
```json
{
  "userID": "user_123",
  "customerName": "Nouvelle Entreprise",
  "customerEmail": "contact@nouvelle.com",
  "customerAddress": "456 Avenue Test"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Client ajouté avec succès",
  "client": {
    "id": 2,
    "nom": "Nouvelle Entreprise",
    "email": "contact@nouvelle.com",
    "adresse": "456 Avenue Test",
    "cree_le": "2024-01-15T11:00:00Z"
  }
}
```

### PUT /api/clients
Met à jour un client existant.

**Corps de la requête:**
```json
{
  "id": 1,
  "customerName": "Entreprise ABC Modifiée",
  "customerEmail": "nouveau@abc.com",
  "customerAddress": "789 Nouvelle Adresse"
}
```

### DELETE /api/clients
Supprime un client.

**Corps de la requête:**
```json
{
  "id": 1
}
```

### GET /api/clients/single
Récupère un client spécifique par nom.

**Paramètres de requête:**
- `customerName` (string, requis) - Nom du client

## 🧾 Endpoints Factures

### GET /api/facture
Récupère les factures de l'utilisateur.

**Paramètres de requête:**
- `userID` (string, requis) - ID de l'utilisateur

**Réponse:**
```json
{
  "success": true,
  "factures": [
    {
      "id": 1,
      "titre": "Facture Janvier 2024",
      "montant_total": "1500.00",
      "articles": "[{\"nom\":\"Service\",\"prix\":1500,\"quantite\":1}]",
      "cree_le": "2024-01-15T10:30:00Z",
      "client": {
        "id": 1,
        "nom": "Entreprise ABC",
        "email": "contact@abc.com"
      }
    }
  ]
}
```

### POST /api/facture
Crée une nouvelle facture.

**Corps de la requête:**
```json
{
  "ownerID": "user_123",
  "customerID": 1,
  "invoiceTitle": "Facture Février 2024",
  "invoiceItems": [
    {
      "nom": "Développement web",
      "prix": 2000,
      "quantite": 1,
      "coût": 2000
    }
  ],
  "totalAmount": 2000
}
```

### PUT /api/facture
Met à jour une facture existante.

**Corps de la requête:**
```json
{
  "id": 1,
  "customerID": 1,
  "invoiceTitle": "Facture Modifiée",
  "invoiceItems": [
    {
      "nom": "Service modifié",
      "prix": 1800,
      "quantite": 1,
      "coût": 1800
    }
  ],
  "totalAmount": 1800
}
```

### DELETE /api/facture
Supprime une facture.

**Corps de la requête:**
```json
{
  "id": 1
}
```

### GET /api/facture/single
Récupère une facture spécifique.

**Paramètres de requête:**
- `factureID` (number, requis) - ID de la facture

### POST /api/facture/envoi
Envoie une facture par email.

**Corps de la requête:**
```json
{
  "factureID": 1,
  "emailDestinataire": "client@example.com"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Email envoyé avec succès",
  "emailID": "email_12345"
}
```

## 🏦 Endpoints Informations Bancaires

### GET /api/bank-info
Récupère les informations bancaires de l'utilisateur.

**Paramètres de requête:**
- `userID` (string, requis) - ID de l'utilisateur

**Réponse:**
```json
{
  "success": true,
  "bankInfo": {
    "id": 1,
    "nom_banque": "Banque Exemple",
    "numero_compte": "FR76 1234 5678 9012 3456",
    "nom_compte": "Compte Professionnel",
    "devise": "EUR"
  }
}
```

### POST /api/bank-info
Met à jour les informations bancaires.

**Corps de la requête:**
```json
{
  "userID": "user_123",
  "bankName": "Nouvelle Banque",
  "accountNumber": "FR76 9876 5432 1098 7654",
  "accountName": "Nouveau Compte",
  "currency": "EUR"
}
```

## 📊 Codes de Statut HTTP

| Code | Description |
|------|-------------|
| 200  | Succès |
| 201  | Créé avec succès |
| 400  | Requête invalide |
| 401  | Non autorisé |
| 403  | Interdit |
| 404  | Non trouvé |
| 429  | Trop de requêtes |
| 500  | Erreur serveur |

## 🚨 Gestion d'Erreurs

### Format des erreurs
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Les données fournies sont invalides",
  "details": {
    "field": "email",
    "issue": "Format d'email invalide"
  }
}
```

### Types d'erreurs courants

#### VALIDATION_ERROR
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Données invalides",
  "details": {
    "field": "customerEmail",
    "issue": "Email requis"
  }
}
```

#### UNAUTHORIZED
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Token d'authentication requis"
}
```

#### RESOURCE_NOT_FOUND
```json
{
  "success": false,
  "error": "RESOURCE_NOT_FOUND",
  "message": "Client non trouvé"
}
```

#### RATE_LIMIT_EXCEEDED
```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Trop de requêtes. Réessayez dans 60 secondes."
}
```

## 🔒 Sécurité

### Validation des données
- Toutes les entrées sont validées avec Zod
- Protection contre l'injection SQL
- Échappement HTML automatique

### Rate Limiting
- 100 requêtes par minute par utilisateur
- 10 requêtes par minute pour l'envoi d'emails

### Headers de sécurité
```http
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 📝 Exemples d'utilisation

### JavaScript/Fetch
```javascript
// Récupérer les clients
const response = await fetch('/api/clients?userID=user_123', {
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.clients);
```

### cURL
```bash
# Créer un client
curl -X POST https://votre-domaine.com/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "user_123",
    "customerName": "Test Client",
    "customerEmail": "test@example.com",
    "customerAddress": "123 Test St"
  }'
```

### Python/Requests
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}

data = {
    'userID': 'user_123',
    'customerName': 'Python Client',
    'customerEmail': 'python@example.com',
    'customerAddress': '456 Python Ave'
}

response = requests.post(
    'https://votre-domaine.com/api/clients',
    headers=headers,
    json=data
)

print(response.json())
```

## 🧪 Tests API

### Collection Postman
Importez la collection Postman pour tester facilement tous les endpoints :

```json
{
  "info": {
    "name": "SaaS Facturation API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://votre-domaine.com/api"
    },
    {
      "key": "authToken",
      "value": "YOUR_CLERK_TOKEN"
    }
  ]
}
```

### Tests automatisés
```javascript
// Jest test example
describe('API Clients', () => {
  test('should create a new client', async () => {
    const response = await request(app)
      .post('/api/clients')
      .send({
        userID: 'test_user',
        customerName: 'Test Client',
        customerEmail: 'test@example.com',
        customerAddress: '123 Test St'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.client.nom).toBe('Test Client');
  });
});
```

## 📈 Limites et Quotas

| Ressource | Limite |
|-----------|--------|
| Requêtes par minute | 100 |
| Emails par heure | 50 |
| Clients par utilisateur | 1000 |
| Factures par mois | 5000 |
| Taille fichier upload | 10MB |


---

✨ **API Documentation v1.0 - Mise à jour : Août 2025**
