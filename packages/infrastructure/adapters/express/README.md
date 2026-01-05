# @workspace/adapter-express

Adapter Express pour Avenir Bank - Backend REST API complet utilisant Express.js

## Installation

```bash
pnpm install
```

## Utilisation

### Importer et démarrer le serveur

```typescript
import { startServer } from '@workspace/adapter-express/server';

// Démarre le serveur sur le port 4000
startServer(4000);
```

### Utilisation personnalisée

```typescript
import { createExpressApp } from '@workspace/adapter-express/server';

const app = createExpressApp();

// Ajouter des middlewares ou routes supplémentaires
app.use('/custom', customRouter);

// Démarrer manuellement
app.listen(4000, () => {
  console.log('Server started');
});
```

## Structure

```
src/
├── controllers/       # Controllers (logique métier)
├── routes/            # Définitions des routes Express
├── middleware/        # Middlewares (auth, error, rbac)
└── server.ts          # Configuration du serveur Express
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion
- `POST /api/auth/confirm` - Confirmation de compte
- `GET /api/auth/me` - Récupérer l'utilisateur actuel
- `POST /api/auth/logout` - Déconnexion

### Accounts
- `GET /api/accounts` - Liste des comptes utilisateur
- `POST /api/accounts` - Créer un compte
- `GET /api/accounts/:id` - Détails d'un compte
- `PUT /api/accounts/:id/name` - Modifier le nom
- `DELETE /api/accounts/:id` - Supprimer un compte

### Transactions
- `GET /api/transactions/account/:accountId` - Transactions d'un compte
- `POST /api/transactions/transfer` - Virement
- `POST /api/transactions/deposit` - Dépôt
- `POST /api/transactions/withdraw` - Retrait

### Loans (Prêts)
- `GET /api/loans` - Prêts de l'utilisateur
- `POST /api/loans` - Créer un prêt (ADVISOR/DIRECTOR)
- `GET /api/loans/advisor/:advisorId` - Prêts par conseiller
- `GET /api/loans/client/:clientId` - Prêts par client
- `POST /api/loans/:id/payment` - Payer une mensualité
- `POST /api/loans/:id/default` - Marquer comme défaillant

### Stocks (Actions)
- `GET /api/stocks` - Liste des actions
- `POST /api/stocks` - Créer une action (DIRECTOR)
- `GET /api/stocks/portfolio` - Portfolio utilisateur
- `PUT /api/stocks/:id` - Modifier une action (DIRECTOR)
- `DELETE /api/stocks/:id` - Supprimer une action (DIRECTOR)
- `POST /api/stocks/:id/buy` - Acheter des actions
- `POST /api/stocks/:id/sell` - Vendre des actions

### Notifications
- `GET /api/notifications` - Notifications utilisateur
- `POST /api/notifications/:id/read` - Marquer comme lue

### Conversations
- `GET /api/conversations` - Conversations utilisateur
- `POST /api/conversations` - Créer une conversation
- `GET /api/conversations/waiting` - Conversations en attente (ADVISOR/DIRECTOR)
- `GET /api/conversations/:id/messages` - Messages d'une conversation
- `POST /api/conversations/:id/assign` - Assigner à un conseiller
- `POST /api/conversations/:id/transfer` - Transférer
- `POST /api/conversations/:id/close` - Fermer

### Messages
- `POST /api/messages/send` - Envoyer un message

### Admin
- `POST /api/admin/users` - Créer un utilisateur (DIRECTOR)
- `PUT /api/admin/users/:id` - Modifier un utilisateur (DIRECTOR)
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur (DIRECTOR)
- `POST /api/admin/users/:id/ban` - Bannir un utilisateur (DIRECTOR)
- `PATCH /api/admin/savings/rate` - Modifier le taux d'épargne (DIRECTOR)
- `POST /api/admin/savings/apply-interest` - Appliquer les intérêts (DIRECTOR)

## Middlewares

### `requireAuth`
Vérifie l'authentification (token JWT dans cookie ou header Authorization)

### `requireRole([roles])`
Vérifie que l'utilisateur a l'un des rôles autorisés (CLIENT, ADVISOR, DIRECTOR)

### `asyncHandler`
Wrapper pour gérer les erreurs asynchrones automatiquement

### `errorHandler`
Middleware global de gestion d'erreurs

## Variables d'environnement

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production
```

## Architecture

Ce package suit les principes de Clean Architecture :
- **Controllers** : Orchestrent les use cases
- **Routes** : Définissent les endpoints HTTP
- **Middlewares** : Gèrent l'authentification, autorisation et erreurs
- Les use cases sont injectés via DI (tsyringe)
