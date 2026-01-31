# Avenir Bank v2

Application bancaire construite avec une **architecture Clean/Hexagonale** en monorepo.

## Architecture

- **Domain** : Entités métier pures (User, Account, Transaction, etc.)
- **Application** : Use cases et ports (interfaces)
- **Infrastructure** : Implémentations concrètes (repositories, services, adapters)
- **Apps** : Applications frontend (Next.js)

## Installation

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
   pnpm install
   pnpm --filter @workspace/translations build  # Générer les traductions
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
   
   > 💡 **Note**: La commande `pnpm dev` démarre automatiquement le serveur avec **WebSocket + SSE**

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
   - Directeur : `director@avenir-bank.com` / `$$Password123!`
   - Conseiller 1 : `advisor1@avenir-bank.com` / `$$Password123!`
   - Conseiller 2 : `advisor2@avenir-bank.com` / `$$Password123!`
   - Client 1 : `client1@example.com` / `$$Password123!`
   - Client 2 : `client2@example.com` / `$$Password123!`
   - Client 3 : `client3@example.com` / `$$Password123!` (compte en attente de confirmation)

7. **Lancer le studio**
   ```bash
   pnpm --filter @workspace/db-postgres studio
   ```
   
   L'app sera disponible sur [http://localhost:3000](http://localhost:3000)

> ***ATTENTION:*** A la création d'un nouveau  compte, le lien de confirmation de l'email est envoyé dans la console (Adapter email-console utilisé dans l'app web)

## Structure des packages

```
packages/
├── domain/              # Entités, Value Objects, Erreurs
├── application/         # Use Cases, DTOs, Ports
├── infrastructure/
│   ├── adapters/
│   │   └── next/       # Handlers API, Hooks React, Composants
│   ├── data/
│   │   ├── postgres/   # Postgres implémentations
│   │   └── in-memory/  # Repositories in-memory
│   └── services/
│       ├── auth-jwt/   # Service JWT + bcrypt
│       └── email-console/  # Service email console
├── shared/             # DI (tsyringe)
├── ui/react/          # Composants UI (shadcn/ui)
└── config/            # Configs partagées (eslint, typescript, prettier)
```

## Architecture Temps Réel (Dual Strategy)

L'application utilise une **stratégie double** pour la communication temps réel, optimisée selon les cas d'usage :

### WebSocket (Bidirectionnel)
**Utilisé pour :** Conversations et messagerie instantanée
- Communication bidirectionnelle en temps réel
- Indicateur de frappe (typing indicator)
- Envoi et réception de messages

**Token DI :** `TOKENS.IRealtimeServiceMessages`

**Service :** `@workspace/service-realtime-websocket`

**Configuration :** Automatiquement activé avec `pnpm dev` via `server.ts`

### SSE - Server-Sent Events (Unidirectionnel)
**Utilisé pour :** Notifications, actualités, transactions
- Événements serveur → client
- Notifications système
- Mises à jour de taux d'épargne
- Confirmation de transactions

**Token DI :** `TOKENS.IRealtimeServiceNotifications`

**Service :** `@workspace/service-realtime-sse`

**Configuration :** Toujours actif, initialisé automatiquement dans `di.ts`

### Configuration dans la DI

Les services sont injectés via des tokens distincts dans `/apps/web/src/lib/di.ts` avec résolution **lazy** :

```typescript
// Résolution dynamique au moment de l'injection (permet à server.ts d'initialiser après)
container.register(TOKENS.IRealtimeServiceMessages, {
    useFactory: () => wsService || sseService  // WebSocket si disponible, sinon SSE
});

container.register(TOKENS.IRealtimeServiceNotifications, {
    useFactory: () => sseService  // Toujours SSE
});
```

**Important :** Les services sont résolus dynamiquement via des factories, permettant au WebSocket d'être initialisé par `server.ts` après le chargement du module DI.

### Commandes

```bash
pnpm dev        # Lance avec WebSocket + SSE (recommandé)
pnpm dev:next   # Lance avec Next.js uniquement (SSE only, fallback)
```

> **Note :** `pnpm dev` lance le serveur custom (`server.ts`) qui :
> 1. Initialise le WebSocketRealtimeService sur `globalThis`
> 2. Démarre Next.js avec support WebSocket sur `/ws`
> 3. Les API Routes résolvent dynamiquement le service WebSocket via la DI
> 4. SSE reste disponible sur `/api/realtime/sse` pour les notifications

### Vérification du Service Actif

Au démarrage avec `pnpm dev`, vous devriez voir :
```
[Server] ✓ WebSocketRealtimeService initialized for messages/conversations
> Ready on http://localhost:3000
> WebSocket (Messages) available on ws://localhost:3000/ws
> SSE (Notifications) available on /api/realtime/sse
```

Si vous voyez `[DI] WebSocketRealtimeService not available` dans les logs des API calls, cela signifie que le service WebSocket n'est pas correctement initialisé. Redémarrez avec `pnpm dev`.

## Scripts disponibles

```bash
pnpm dev          # Lance tous les packages en mode dev
pnpm build        # Build tous les packages
pnpm lint         # Lint tous les packages
pnpm format       # Format le code avec Prettier
pnpm clean:all    # Nettoie node_modules et caches
```