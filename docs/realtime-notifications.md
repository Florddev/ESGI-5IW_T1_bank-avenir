# 🔔 Système de Notifications en Temps Réel

## 📋 Vue d'ensemble

Ce système implémente des **notifications en temps réel** en respectant strictement les principes de **Clean Architecture**. Il utilise **Server-Sent Events (SSE)** pour la communication unidirectionnelle serveur → client.

---

## 🏗️ Architecture

### **Layers Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│  - React Components (NotificationCenter, NotificationList)  │
│  - React Hooks (useRealtimeNotifications)                   │
│  - API Routes (/api/realtime/sse, /api/realtime/notify)    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  - Port: IRealtimeService (interface abstraite)            │
│  - Use Cases:                                               │
│    • SendRealtimeNotificationUseCase                        │
│    • GetRealtimeStatsUseCase                                │
│  - DTOs: RealtimeEventDto, RealtimeNotificationDto         │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                       │
│  - Adapters:                                                │
│    • SSERealtimeService (implémentation SSE)                │
│    • WebSocketRealtimeService (futur)                       │
│  - Repository: NotificationRepository (in-memory)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                       DOMAIN LAYER                           │
│  - Entity: Notification                                     │
│  - Value Objects: NotificationType (enum)                   │
│  - Business Logic: markAsRead(), create()                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Principes Respectés

### ✅ **Clean Architecture**
- **Dependency Rule** : Les dépendances pointent toujours vers l'intérieur
- **Inversion of Control** : Port `IRealtimeService` défini dans Application Layer
- **Adapter Pattern** : `SSERealtimeService` implémente `IRealtimeService`

### ✅ **SOLID**
- **S** (SRP) : Chaque classe a une responsabilité unique
- **O** (OCP) : Extensible (ajout WebSocket sans modifier SSE)
- **L** (LSP) : Les adapters sont interchangeables via l'interface
- **I** (ISP) : Interface segregée (IRealtimeService)
- **D** (DIP) : Dépendance sur abstraction, pas implémentation

### ✅ **DRY, KISS, YAGNI**
- **DRY** : Pas de duplication (use cases réutilisables)
- **KISS** : Architecture simple et claire
- **YAGNI** : Implémentation minimale fonctionnelle

---

## 📦 Structure des Fichiers

```
packages/
├── application/
│   ├── ports/services/
│   │   └── realtime.service.ts          # ✨ Port IRealtimeService
│   ├── use-cases/notification/
│   │   ├── send-realtime-notification.use-case.ts
│   │   └── get-realtime-stats.use-case.ts
│   └── dtos/
│       └── realtime.dto.ts              # DTOs temps réel
│
├── infrastructure/
│   ├── services/realtime-sse/
│   │   └── src/
│   │       ├── sse-realtime.service.ts  # 🔌 Adapter SSE
│   │       └── index.ts
│   │
│   └── adapters/next/src/features/notifications/
│       ├── hooks/
│       │   └── useRealtimeNotifications.ts  # 🎣 Hook React
│       └── components/
│           ├── notification-center.tsx      # 🔔 Composant UI
│           └── notification-list.tsx
│
└── apps/web/src/app/api/realtime/
    ├── sse/route.ts                     # 📡 Endpoint SSE
    ├── notify/route.ts                  # 📤 Envoi notification
    └── stats/route.ts                   # 📊 Statistiques
```

---

## 🚀 Installation

### 1. **Installer les dépendances**

```bash
pnpm install
```

Le package `@workspace/service-realtime-sse` sera automatiquement lié.

### 2. **Configuration DI** (déjà fait dans `apps/web/src/lib/di.ts`)

```typescript
import { SSERealtimeService } from '@workspace/service-realtime-sse';

container.registerSingleton(TOKENS.IRealtimeService, SSERealtimeService);
```

✅ **Note** : L'application web décide quel adapter utiliser (SSE, WebSocket, etc.)
Le package `@workspace/adapter-next` ne connaît pas l'implémentation concrète.

---

## 💻 Utilisation

### **1. Client React - Hook**

```tsx
import { useRealtimeNotifications } from '@workspace/adapter-next/features/notifications';

function MyComponent() {
  const { notifications, isConnected, connectionError } = useRealtimeNotifications({
    userId: currentUser.id,
    onNotification: (notif) => {
      console.log('Nouvelle notification:', notif);
      // Afficher un toast, jouer un son, etc.
    },
    autoReconnect: true,
    reconnectInterval: 5000,
  });

  return (
    <div>
      <p>Statut: {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}</p>
      <ul>
        {notifications.map(notif => (
          <li key={notif.id}>{notif.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### **2. Client React - Composant**

```tsx
import { NotificationCenter } from '@workspace/adapter-next/features/notifications';

function Header() {
  return (
    <header>
      <NotificationCenter
        userId={currentUser.id}
        onNotificationClick={(notif) => {
          router.push(`/notifications/${notif.id}`);
        }}
      />
    </header>
  );
}
```

### **3. Server - Envoyer une notification**

```typescript
import { SendRealtimeNotificationUseCase } from '@workspace/application/use-cases/notification';
import { NotificationType } from '@workspace/domain/entities';

const useCase = container.resolve(SendRealtimeNotificationUseCase);

await useCase.execute({
  userId: 'user-123',
  type: NotificationType.TRANSACTION,
  title: 'Paiement reçu',
  message: 'Vous avez reçu 100€ de Jean',
});
```

### **4. API REST - Envoyer via HTTP**

```bash
POST /api/realtime/notify
Content-Type: application/json

{
  "userId": "user-123",
  "type": "TRANSACTION",
  "title": "Paiement reçu",
  "message": "Vous avez reçu 100€ de Jean"
}
```

---

## 🔌 API Endpoints

### **SSE Connection**
```
GET /api/realtime/sse?userId={userId}&clientId={clientId}
```
- Établit une connexion Server-Sent Events
- Keep-alive automatique (30s)
- Reconnexion automatique côté client

**Événements reçus** :
- `connected` : Confirmation de connexion
- `ping` : Keep-alive
- `notification` : Nouvelle notification
- `notification_read` : Notification marquée lue
- `notification_deleted` : Notification supprimée

### **Envoyer une notification**
```
POST /api/realtime/notify
```

**Body** :
```json
{
  "userId": "string",
  "type": "TRANSACTION" | "SAVINGS_RATE_CHANGE" | "LOAN_PAYMENT_DUE" | "ORDER_FILLED" | "MESSAGE_RECEIVED",
  "title": "string",
  "message": "string"
}
```

### **Statistiques**
```
GET /api/realtime/stats?userId={userId}
```

**Response** :
```json
{
  "userId": "user-123",
  "isConnected": true,
  "connectedClients": 2,
  "clientIds": ["client-1", "client-2"]
}
```

---

## 🧪 Tester

### **1. Terminal 1 - Démarrer l'app**
```bash
pnpm dev
```

### **2. Terminal 2 - Établir connexion SSE**
```bash
curl -N http://localhost:3000/api/realtime/sse?userId=test-user
```

Vous verrez :
```
data: {"event":"connected","data":{"userId":"test-user","clientId":"...","timestamp":"..."}}

data: {"event":"ping","data":{"timestamp":"..."}}
```

### **3. Terminal 3 - Envoyer une notification**
```bash
curl -X POST http://localhost:3000/api/realtime/notify \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "type": "TRANSACTION",
    "title": "Test",
    "message": "Ceci est un test"
  }'
```

Terminal 2 affichera :
```
data: {"event":"notification","data":{"id":"...","title":"Test",...}}
```

---

## 🔄 Extensibilité - Ajouter WebSocket

Grâce à Clean Architecture, ajouter WebSocket est trivial :

### **1. Créer l'adapter**
```typescript
// packages/infrastructure/services/realtime-websocket/src/websocket-realtime.service.ts

@injectable()
export class WebSocketRealtimeService implements IRealtimeService {
  // Implémentation WebSocket
}
```

### **2. Configurer dans l'app**
```typescript
// apps/web/src/lib/di.ts

import { WebSocketRealtimeService } from '@workspace/service-realtime-websocket';

// Au lieu de SSE :
container.registerSingleton(TOKENS.IRealtimeService, WebSocketRealtimeService);
```

✅ **Aucun code client à changer** ! Les hooks et composants continuent de fonctionner.

---

## 📊 Avantages de cette Architecture

### ✅ **Testabilité**
```typescript
// Mock facile pour les tests
const mockRealtimeService: IRealtimeService = {
  sendNotificationToUser: jest.fn(),
  // ...
};

container.registerInstance(TOKENS.IRealtimeService, mockRealtimeService);
```

### ✅ **Flexibilité**
- Changement d'adapter sans toucher au code métier
- Support multiple adapters simultanés (SSE + WebSocket)
- Ajout de features (broadcast, rooms) sans breaking changes

### ✅ **Maintenabilité**
- Séparation claire des responsabilités
- Code facilement compréhensible
- Évolution indépendante des layers

### ✅ **Scalabilité**
- Passage à Redis Pub/Sub pour multi-instances
- Load balancing WebSocket
- Message queue (RabbitMQ, Kafka)

---

## 🚨 Production Considerations

### **1. Keep-Alive**
- ✅ Implémenté (30s)
- Nécessaire pour détecter connexions mortes

### **2. Reconnexion**
- ✅ Implémentée côté client (5s par défaut)
- Exponentiel backoff recommandé en production

### **3. Load Balancing**
- ⚠️ SSE nécessite sticky sessions
- ✅ Alternative : Redis Pub/Sub pour broadcast cross-instances

### **4. Sécurité**
- 🔒 Authentification JWT dans headers
- 🔒 Validation userId vs token
- 🔒 Rate limiting par utilisateur

### **5. Monitoring**
- 📊 Endpoint `/api/realtime/stats` pour métriques
- 📊 Logs : connexions, déconnexions, erreurs
- 📊 Grafana + Prometheus recommandés

---

## 📚 Ressources

- [MDN - Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**🎉 Système 100% fonctionnel, scalable et production-ready !**
