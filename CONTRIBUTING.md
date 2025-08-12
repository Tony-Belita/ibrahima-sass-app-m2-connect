# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer au projet SaaS Facturation ! Ce guide vous aidera à démarrer.

## 📋 Code de Conduite

Ce projet adhère au [Code de Conduite des Contributeurs](https://www.contributor-covenant.org/). En participant, vous acceptez de respecter ce code.

## 🚀 Comment contribuer

### 🐛 Signaler un bug

1. Vérifiez si le bug n'a pas déjà été signalé dans les [Issues](https://github.com/Tony-Belita/ibrahima-sass-app-m2-connect/issues)
2. Créez une nouvelle issue en utilisant le template de bug
3. Incluez un maximum de détails :
   - Version du navigateur
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Captures d'écran si pertinentes

### ✨ Proposer une fonctionnalité

1. Vérifiez si la fonctionnalité n'a pas déjà été demandée
2. Créez une issue avec le label "enhancement"
3. Décrivez clairement :
   - Le problème que cela résout
   - La solution proposée
   - Les alternatives considérées

### 🔧 Développement

#### Prérequis
- Node.js 18.17+
- npm ou yarn
- Git

#### Setup du projet
```bash
# Forker le projet sur GitHub
# Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/ibrahima-sass-app-m2-connect.git
cd ibrahima-sass-app-m2-connect

# Ajouter le repo original comme remote
git remote add upstream https://github.com/Tony-Belita/ibrahima-sass-app-m2-connect.git

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Remplir les variables d'environnement

# Lancer en mode développement
npm run dev
```

#### Workflow de développement

1. **Créer une branche**
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   # ou
   git checkout -b fix/correction-bug
   ```

2. **Développer**
   - Respecter les conventions de code existantes
   - Ajouter des tests pour les nouvelles fonctionnalités
   - Mettre à jour la documentation si nécessaire

3. **Tester**
   ```bash
   # Tests unitaires
   npm test
   
   # Tests e2e (si disponibles)
   npm run test:e2e
   
   # Linting
   npm run lint
   
   # Type checking
   npm run type-check
   
   # Build
   npm run build
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: ajouter fonctionnalité X"
   # ou
   git commit -m "fix: corriger le bug Y"
   ```

5. **Push et Pull Request**
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
   
   Créez ensuite une Pull Request sur GitHub.

## 📝 Conventions de Code

### Style de Code
- **TypeScript** : Utilisation stricte de TypeScript
- **ESLint** : Respect des règles ESLint configurées
- **Prettier** : Formatage automatique du code

### Conventions de nommage
```typescript
// Variables et fonctions : camelCase
const userName = "john";
const fetchUserData = () => {};

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";

// Classes et composants : PascalCase
class UserService {}
const UserProfile = () => {};

// Fichiers : kebab-case ou PascalCase selon le type
user-service.ts
UserProfile.tsx
```

### Structure des commits
Utiliser la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description

[corps optionnel]

[footer optionnel]
```

**Types autorisés :**
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatage, point-virgules manquants, etc.
- `refactor`: refactorisation du code
- `test`: ajout de tests
- `chore`: tâches de maintenance

**Exemples :**
```bash
feat(auth): ajouter l'authentication avec Clerk
fix(api): corriger la validation des emails
docs(readme): mettre à jour les instructions d'installation
```

## 🧪 Tests

### Tests unitaires
```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Écrire des tests
```typescript
// __tests__/utils.test.ts
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format EUR currency correctly', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('1 234,56 €');
  });
  
  it('should format USD currency correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
});
```

## 🎨 Design System

### Composants UI
- Utiliser les composants Aceternity UI existants
- Respecter la cohérence visuelle
- Documenter les nouveaux composants

### Couleurs et Thème
```css
/* Variables CSS disponibles */
:root {
  --primary: #3b82f6;
  --secondary: #6b7280;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

## 🔍 Review Process

### Critères de review
- [ ] Le code suit les conventions du projet
- [ ] Les tests passent
- [ ] La documentation est mise à jour
- [ ] Pas de régression fonctionnelle
- [ ] Performance acceptable
- [ ] Sécurité respectée

### Checklist PR
- [ ] Titre descriptif
- [ ] Description claire des changements
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Screenshots si UI modifiée
- [ ] Pas de conflits avec main

## 🚀 Déploiement

Les déploiements sont automatiques :
- **Staging** : Push sur `develop`
- **Production** : Merge sur `main`

## 🆘 Obtenir de l'aide

- 💬 **Discussions** : [GitHub Discussions](https://github.com/Tony-Belita/ibrahima-sass-app-m2-connect/discussions)
- 🐛 **Issues** : [GitHub Issues](https://github.com/Tony-Belita/ibrahima-sass-app-m2-connect/issues)
- 📧 **Email** : contribute@votre-domaine.com

## 🏆 Reconnaissance

Les contributeurs sont listés dans le [CONTRIBUTORS.md](./CONTRIBUTORS.md) et apparaissent sur le profil GitHub du projet.

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient licenciées sous la [Licence MIT](./LICENSE).

---

🙏 **Merci de contribuer à rendre ce projet meilleur !**
