import { NotificationType } from '@workspace/domain/entities';

/**
 * DTO générique pour tous événements temps réel
 */
export interface RealtimeEventDto<T = any> {
    event: string; // notification, message, transaction, etc.
    data: T;
    timestamp: string;
    userId?: string; // Optionnel : ID utilisateur concerné
}

// ==================== NOTIFICATIONS ====================

export interface RealtimeNotificationDto {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export type NotificationEventType = 
    | 'notification' 
    | 'notification_read' 
    | 'notification_deleted';

// ==================== MESSAGES ====================

export interface RealtimeMessageDto {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    isRead: boolean;
}

export type MessageEventType = 
    | 'message_new' 
    | 'message_read' 
    | 'message_deleted'
    | 'typing_start'
    | 'typing_stop';

// ==================== TRANSACTIONS ====================

export interface RealtimeTransactionDto {
    id: string;
    accountId: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
}

export type TransactionEventType = 
    | 'transaction_created'
    | 'transaction_completed'
    | 'transaction_failed';

// ==================== GENERIC ====================

export interface SubscribeToRealtimeDto {
    userId: string;
    channel?: string; // Optional: 'notifications', 'messages', 'transactions'
}

export interface UnsubscribeDto {
    userId: string;
    clientId: string;
}
