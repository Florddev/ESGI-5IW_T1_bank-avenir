export interface MessageProps {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Message {
    private constructor(private readonly props: MessageProps) {}

    static create(conversationId: string, senderId: string, content: string): Message {
        if (!content.trim()) {
            throw new Error('Message content cannot be empty');
        }

        return new Message({
            id: crypto.randomUUID(),
            conversationId,
            senderId,
            content: content.trim(),
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: MessageProps): Message {
        return new Message(props);
    }

    markAsRead(): void {
        if (this.props.isRead) {
            return;
        }

        this.props.isRead = true;
        this.props.updatedAt = new Date();
    }

    get id(): string {
        return this.props.id;
    }

    get conversationId(): string {
        return this.props.conversationId;
    }

    get senderId(): string {
        return this.props.senderId;
    }

    get content(): string {
        return this.props.content;
    }

    get isRead(): boolean {
        return this.props.isRead;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
