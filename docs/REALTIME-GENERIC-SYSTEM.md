# 🔄 Système Temps Réel GÉNÉRIQUE

## 🎯 Objectif

Le système temps réel a été **généralisé** pour supporter **tous types d'événements**, pas seulement les notifications.

## ✅ Ce que vous pouvez faire maintenant

### 1️⃣ **Messages en temps réel**
```typescript
import { useRealtimeMessages } from '@workspace/adapter-next/features/realtime';

function ChatComponent() {
  const { events, isConnected } = useRealtimeMessages(userId);
  
  // events contient tous les messages reçus en temps réel
  return (
    <div>
      {events.map(e => (
        e.event === 'message_new' && <Message data={e.data} />
      ))}
    </div>
  );
}
```

### 2️⃣ **Transactions en temps réel**
```typescript
import { useRealtimeTransactions } from '@workspace/adapter-next/features/realtime';

function AccountDashboard() {
  const { events } = useRealtimeTransactions(userId);
  
  // Mise à jour automatique quand une transaction est terminée
  useEffect(() => {
    events.forEach(e => {
      if (e.event === 'transaction_completed') {
        refetchBalance(); // Recharger le solde
      }
    });
  }, [events]);
}
```

### 3️⃣ **Notifications en temps réel** (comme avant)
```typescript
import { useRealtimeNotifications } from '@workspace/adapter-next/features/notifications';

function NotificationBell() {
  const { notifications } = useRealtimeNotifications({ userId });
  // ...
}
```

### 4️⃣ **Hook générique pour n'importe quel événement**
```typescript
import { useRealtime } from '@workspace/adapter-next/features/realtime';

function CustomComponent() {
  const { events, isConnected } = useRealtime({
    userId,
    events: ['custom_event', 'another_event'],
    onEvent: (event, data) => {
      console.log('Événement reçu:', event, data);
    }
  });
}
```

---

## 🏗️ Architecture Générique

### **Port (Application Layer)**
```typescript
// packages/application/src/ports/services/realtime.service.ts

export interface IRealtimeService {
    // Méthodes GÉNÉRIQUES (plus couplées aux notifications)
    sendEventToUser<T>(userId: string, event: string, data: T): Promise<void>;
    sendEventToUsers<T>(userIds: string[], event: string, data: T): Promise<void>;
    broadcastEvent<T>(event: string, data: T): Promise<void>;
    
    registerClient(userId: string, clientId: string): void;
    unregisterClient(clientId: string): void;
    getConnectedClients(userId: string): string[];
    isUserConnected(userId: string): boolean;
}
```

### **Use Cases (Application Layer)**

#### **Messages**
```typescript
// packages/application/src/use-cases/message/send-realtime-message.use-case.ts

@injectable()
export class SendRealtimeMessageUseCase {
    constructor(@inject(TOKENS.IRealtimeService) private realtimeService: IRealtimeService) {}

    async execute(input: SendRealtimeMessageInput): Promise<void> {
        const messageDto: RealtimeMessageDto = { /* ... */ };
        
        await this.realtimeService.sendEventToUser(
            input.recipientId,
            'message_new',
            messageDto
        );
    }
}
```

#### **Transactions**
```typescript
// packages/application/src/use-cases/transaction/notify-transaction-completed.use-case.ts

@injectable()
export class NotifyTransactionCompletedUseCase {
    constructor(@inject(TOKENS.IRealtimeService) private realtimeService: IRealtimeService) {}

    async execute(input: NotifyTransactionCompletedInput): Promise<void> {
        const transactionDto: RealtimeTransactionDto = { /* ... */ };
        
        await this.realtimeService.sendEventToUser(
            input.userId,
            'transaction_completed',
            transactionDto
        );
    }
}
```

#### **Typing Indicator**
```typescript
// packages/application/src/use-cases/message/notify-typing.use-case.ts

@injectable()
export class NotifyTypingUseCase {
    async execute(input: NotifyTypingInput): Promise<void> {
        const event = input.isTyping ? 'typing_start' : 'typing_stop';
        
        await this.realtimeService.sendEventToUser(
            input.recipientId,
            event,
            { conversationId: input.conversationId, userId: input.userId }
        );
    }
}
```

---

## 📦 DTOs Génériques

```typescript
// packages/application/src/dtos/realtime.dto.ts

// DTO générique
export interface RealtimeEventDto<T = any> {
    event: string;
    data: T;
    timestamp: string;
    userId?: string;
}

// DTOs spécifiques
export interface RealtimeNotificationDto { /* ... */ }
export interface RealtimeMessageDto { /* ... */ }
export interface RealtimeTransactionDto { /* ... */ }

// Types d'événements
export type NotificationEventType = 'notification' | 'notification_read' | 'notification_deleted';
export type MessageEventType = 'message_new' | 'message_read' | 'typing_start' | 'typing_stop';
export type TransactionEventType = 'transaction_created' | 'transaction_completed' | 'transaction_failed';
```

---

## 🎨 React Hooks

### **Hook générique**
```typescript
// useRealtime.ts
export function useRealtime<T = any>(options: UseRealtimeOptions<T>) {
    const [events, setEvents] = useState<RealtimeEvent<T>[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // Connexion EventSource
    // Écoute des événements spécifiés
    // Auto-reconnexion
    
    return { events, isConnected, reconnect, disconnect, clearEvents };
}
```

### **Hooks spécialisés**
```typescript
// useRealtimeMessages.ts
export function useRealtimeMessages(userId: string) {
    return useRealtime<RealtimeMessageDto>({
        userId,
        events: ['message_new', 'message_read', 'typing_start', 'typing_stop'],
    });
}

// useRealtimeTransactions.ts
export function useRealtimeTransactions(userId: string) {
    return useRealtime<RealtimeTransactionDto>({
        userId,
        events: ['transaction_created', 'transaction_completed', 'transaction_failed'],
    });
}
```

---

## 💡 Exemples d'Utilisation

### **Chat en temps réel**
```typescript
'use client';

import { useState } from 'react';
import { useRealtimeMessages } from '@workspace/adapter-next/features/realtime';

export function ChatConversation({ conversationId, currentUserId, recipientId }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    
    const { events, isConnected } = useRealtimeMessages(currentUserId);
    
    // Écouter les nouveaux messages
    useEffect(() => {
        events.forEach(e => {
            if (e.event === 'message_new' && e.data.conversationId === conversationId) {
                setMessages(prev => [...prev, e.data]);
            }
            
            if (e.event === 'typing_start' && e.data.userId === recipientId) {
                setIsTyping(true);
            }
            
            if (e.event === 'typing_stop' && e.data.userId === recipientId) {
                setIsTyping(false);
            }
        });
    }, [events]);
    
    const handleTyping = () => {
        fetch('/api/messages/typing', {
            method: 'POST',
            body: JSON.stringify({
                conversationId,
                recipientId,
                isTyping: true
            })
        });
    };
    
    return (
        <div>
            <div className="connection-status">
                {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
            </div>
            
            <div className="messages">
                {messages.map(m => <MessageBubble key={m.id} message={m} />)}
                {isTyping && <TypingIndicator />}
            </div>
            
            <input onChange={handleTyping} />
        </div>
    );
}
```

### **Balance en temps réel**
```typescript
'use client';

import { useRealtimeTransactions } from '@workspace/adapter-next/features/realtime';

export function AccountBalance({ accountId, userId, initialBalance }) {
    const [balance, setBalance] = useState(initialBalance);
    const { events } = useRealtimeTransactions(userId);
    
    useEffect(() => {
        events.forEach(e => {
            if (e.event === 'transaction_completed' && e.data.accountId === accountId) {
                // Mettre à jour le solde instantanément
                if (e.data.type === 'CREDIT') {
                    setBalance(prev => prev + e.data.amount);
                } else {
                    setBalance(prev => prev - e.data.amount);
                }
            }
        });
    }, [events]);
    
    return (
        <div className="balance">
            <h2>Solde: {balance}€</h2>
        </div>
    );
}
```

---

## 🔧 Côté Serveur

### **Envoyer un message**
```typescript
// apps/web/src/app/api/messages/send/route.ts

import { SendRealtimeMessageUseCase } from '@workspace/application/use-cases/message';

export async function POST(request: Request) {
    const container = getServerContainer();
    const useCase = container.resolve(SendRealtimeMessageUseCase);
    
    const body = await request.json();
    
    await useCase.execute({
        conversationId: body.conversationId,
        senderId: body.senderId,
        recipientId: body.recipientId,
        content: body.content,
    });
    
    return Response.json({ success: true });
}
```

### **Notifier une transaction**
```typescript
// Dans votre service de transaction

import { NotifyTransactionCompletedUseCase } from '@workspace/application/use-cases/transaction';

async function completeTransaction(transactionId: string) {
    // 1. Compléter la transaction en DB
    await transactionRepository.complete(transactionId);
    
    // 2. Notifier en temps réel
    const useCase = container.resolve(NotifyTransactionCompletedUseCase);
    await useCase.execute({
        transactionId,
        accountId: transaction.accountId,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
    });
}
```

---

## ✨ Avantages

### ✅ **Générique**
- N'importe quel type d'événement
- Pas couplé aux notifications
- Extensible facilement

### ✅ **Type-safe**
- Hooks typés : `useRealtime<MessageDto>`
- DTOs explicites
- Autocomplete dans l'IDE

### ✅ **Clean Architecture**
- Port abstrait dans application layer
- Adapter SSE dans infrastructure
- Use cases réutilisables

### ✅ **DRY**
- Un seul hook générique `useRealtime`
- Hooks spécialisés qui l'utilisent
- Pas de duplication

### ✅ **Testable**
- Mock du `IRealtimeService`
- Tests unitaires simples
- Indépendant de l'implémentation

---

## 🚀 Prochaines Étapes

### **Ajouter d'autres événements**
```typescript
// Stock market updates
useRealtime({
    userId,
    events: ['stock_price_update', 'stock_alert'],
});

// Loan updates
useRealtime({
    userId,
    events: ['loan_approved', 'loan_rejected', 'payment_due'],
});

// Admin events
useRealtime({
    userId: 'admin',
    events: ['user_registered', 'transaction_flagged', 'system_alert'],
});
```

---

**🎉 Système temps réel maintenant 100% générique et réutilisable pour tout !**
