# Bank API - Backend Express

Backend API pour Avenir Bank utilisant Express.js et Clean Architecture.

## 🚀 Démarrage rapide

### Installation

```bash
pnpm install
```

### Configuration

Copier le fichier `.env.example` vers `.env` et ajuster les variables :

```bash
cp .env.example .env
```

### Développement

```bash
pnpm dev
```

Le serveur démarre sur `http://localhost:4000`

### Production

```bash
pnpm build
pnpm start
```

## 📡 API Endpoints

L'API expose tous les endpoints définis dans `@workspace/adapter-express` :

- **Auth** : `/api/auth/*`
- **Accounts** : `/api/accounts/*`
- **Transactions** : `/api/transactions/*`
- **Loans** : `/api/loans/*`
- **Stocks** : `/api/stocks/*`
- **Notifications** : `/api/notifications/*`
- **Conversations** : `/api/conversations/*`
- **Messages** : `/api/messages/*`
- **Admin** : `/api/admin/*`

### Health Check

```bash
curl http://localhost:4000/health
```

## 🏗️ Architecture

Cette application utilise :
- **@workspace/adapter-express** : Routes et controllers Express
- **@workspace/db-in-memory** : Repositories en mémoire
- **@workspace/service-auth-jwt** : Authentification JWT
- **@workspace/service-email-console** : Service d'emails (console)

## 🔐 Authentification

L'API utilise JWT avec deux modes :
- Cookie HTTP-only (recommandé)
- Header Authorization: Bearer <token>

## 📝 Variables d'environnement

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port du serveur | `4000` |
| `CORS_ORIGIN` | Origine autorisée pour CORS | `http://localhost:5173` |
| `NODE_ENV` | Environnement | `development` |
| `JWT_SECRET` | Secret JWT | (à définir) |
| `JWT_EXPIRES_IN` | Durée de validité JWT | `7d` |
