export interface CreateConversationDto {
    clientId: string;
}

export interface SendMessageDto {
    conversationId: string;
    senderId: string;
    content: string;
}

export interface AssignConversationDto {
    conversationId: string;
    advisorId: string;
}

export interface TransferConversationDto {
    conversationId: string;
    fromAdvisorId: string;
    toAdvisorId: string;
}

export interface ConversationDto {
    id: string;
    clientId: string;
    advisorId?: string;
    status: string;
    lastMessage?: MessageDto;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MessageDto {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

export interface ConversationDetailDto {
    conversation: ConversationDto;
    messages: MessageDto[];
}

export interface WaitingConversationsDto {
    conversations: ConversationDto[];
}
