import { DomainError } from './domain.error';

export class ConversationNotFoundError extends DomainError {
    constructor(conversationId: string) {
        super(`Conversation not found: ${conversationId}`);
    }
}

export class ConversationAlreadyAssignedError extends DomainError {
    constructor(conversationId: string) {
        super(`Conversation already assigned: ${conversationId}`);
    }
}

export class ConversationClosedError extends DomainError {
    constructor(conversationId: string) {
        super(`Conversation is closed: ${conversationId}`);
    }
}
