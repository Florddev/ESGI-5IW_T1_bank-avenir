import { NotificationType } from '@workspace/domain/entities';

export interface RealtimeEventDto<T = any> {
    event: string;
    data: T;
    timestamp: string;
    userId?: string;
}

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

export interface RealtimeMessageDto {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole?: string;
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

export interface SubscribeToRealtimeDto {
    userId: string;
    channel?: string;
}

export interface UnsubscribeDto {
    userId: string;
    clientId: string;
}
