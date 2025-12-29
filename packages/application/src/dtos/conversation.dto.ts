export interface CreateConversationDto {
    subject: string;
    firstMessage: string;
}

export interface SendMessageDto {
    conversationId: string;
    content: string;
}

export interface AssignConversationDto {
    advisorId: string;
}

export interface TransferConversationDto {
    toAdvisorId: string;
}

export interface ConversationDto {
    id: string;
    subject: string;
    clientId: string;
    clientName: string;
    advisorId?: string;
    advisorName?: string;
    status: 'WAITING' | 'OPEN' | 'CLOSED';
    lastMessage?: string;
    lastMessageAt?: Date;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MessageDto {
    id: string;
    conversationId: string;
    authorId: string;
    authorName: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

export interface ConversationDetailDto {
    id: string;
    subject: string;
    clientId: string;
    clientName: string;
    advisorId?: string;
    advisorName?: string;
    status: 'WAITING' | 'OPEN' | 'CLOSED';
    messages: MessageDto[];
    createdAt: Date;
    updatedAt: Date;
}

export interface WaitingConversationDto {
    id: string;
    subject: string;
    clientId: string;
    clientName: string;
    firstMessage: string;
    createdAt: Date;
}

export interface WaitingConversationsDto {
    conversations: WaitingConversationDto[];
    count: number;
}
