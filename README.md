# Avenir Bank v2

Application bancaire construite avec une **architecture Clean/Hexagonale** en monorepo.

## 🏗️ Architecture

- **Domain** : Entités métier pures (User, Account, Transaction, etc.)
- **Application** : Use cases et ports (interfaces)
- **Infrastructure** : Implémentations concrètes (repositories, services, adapters)
- **Apps** : Applications frontend (Next.js)

## 🚀 Installation

### Prérequis

- Node.js >= 20
- pnpm >= 10.4.1

### Setup

1. **Cloner le projet**
   ```bash
   git clone <url>
   cd avenir-bank-v2
   ```

2. **Installer les dépendances**
   ```bash
   pnpm --filter @workspace/translations build
   pnpm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cd apps/web
   cp .env.example .env.local
   ```
   
   Éditer `.env.local` :
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Lancer l'application**
   ```bash
   pnpm dev
   ```

5. **Lancer la db**
   ```bash
   docker compose up -d
   pnpm --filter @workspace/db-postgres generate
   pnpm --filter @workspace/db-postgres migrate
   ```

6. **Lancer les seeders**
   ```bash
   pnpm --filter @workspace/db-postgres seed
   ```

   **Comptes disponibles après seeding :**
   - Directeur : `director@avenir-bank.com` / `password123`
   - Conseiller 1 : `advisor1@avenir-bank.com` / `password123`
   - Conseiller 2 : `advisor2@avenir-bank.com` / `password123`
   - Client 1 : `client1@example.com` / `password123`
   - Client 2 : `client2@example.com` / `password123`
   - Client 3 : `client3@example.com` / `password123` (compte en attente de confirmation)

7. **Lancer le studio**
   ```bash
   pnpm --filter @workspace/db-postgres studio
   ```
   
   L'app sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Fonctionnalités d'authentification

### Flux complet

1. **Inscription** : `/auth/register`
   - Formulaire avec email, mot de passe, prénom, nom
   - Hash du mot de passe avec bcrypt
   - Envoi email de confirmation (console en dev)
   
2. **Confirmation** : `/auth/confirm-email?token=xxx`
   - Cliquer sur le lien dans l'email (console)
   - Activation automatique du compte
   - Redirection vers login

3. **Connexion** : `/auth/login`
   - Email + mot de passe
   - JWT stocké dans cookie httpOnly (7 jours)
   - Redirection vers dashboard

4. **Dashboard** : `/dashboard`
   - Accès protégé (redirection si non authentifié)
   - Affichage infos utilisateur
   - Déconnexion

## 📦 Structure des packages

```
packages/
├── domain/              # Entités, Value Objects, Erreurs
├── application/         # Use Cases, DTOs, Ports
├── infrastructure/
│   ├── adapters/
│   │   └── next/       # Handlers API, Hooks React, Composants
│   ├── data/
│   │   └── in-memory/  # Repositories in-memory
│   └── services/
│       ├── auth-jwt/   # Service JWT + bcrypt
│       └── email-console/  # Service email console
├── shared/             # DI (tsyringe)
├── ui/react/          # Composants UI (shadcn/ui)
└── config/            # Configs partagées (eslint, typescript, prettier)
```

## 🛠️ Scripts disponibles

```bash
pnpm dev          # Lance tous les packages en mode dev
pnpm build        # Build tous les packages
pnpm lint         # Lint tous les packages
pnpm format       # Format le code avec Prettier
pnpm clean:all    # Nettoie node_modules et caches
```

## 🎨 Ajouter des composants shadcn/ui

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Les composants sont placés dans `packages/ui-react/src/components/`.

## 🧪 Tester l'authentification

1. Créer un compte sur `/auth/register`
2. Copier le lien de confirmation depuis la console
3. Ouvrir le lien dans le navigateur
4. Se connecter sur `/auth/login`
5. Accéder au dashboard

## 📚 Documentation

- [Guide DI](docs/dependency-injection.md) - 873 lignes sur l'injection de dépendances
- [Auth Example](docs/auth-example.md) - Exemples d'authentification

## 🔧 Technologies

- **Frontend** : Next.js 16, React 19, TailwindCSS, shadcn/ui
- **Backend** : Next.js API Routes
- **Auth** : JWT (jsonwebtoken), bcrypt
- **DI** : tsyringe + reflect-metadata
- **Monorepo** : pnpm workspaces + Turborepo
- **TypeScript** : 5.7
