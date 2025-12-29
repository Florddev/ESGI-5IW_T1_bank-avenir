export enum ConversationStatus {
    WAITING = 'WAITING',
    ASSIGNED = 'ASSIGNED',
    CLOSED = 'CLOSED',
}

export interface ConversationProps {
    id: string;
    subject: string;
    clientId: string;
    advisorId?: string;
    status: ConversationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export class Conversation {
    private constructor(private readonly props: ConversationProps) {}

    static create(clientId: string, subject: string): Conversation {
        if (!subject.trim()) {
            throw new Error('Conversation subject cannot be empty');
        }

        return new Conversation({
            id: crypto.randomUUID(),
            subject: subject.trim(),
            clientId,
            status: ConversationStatus.WAITING,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: ConversationProps): Conversation {
        return new Conversation(props);
    }

    assignToAdvisor(advisorId: string): void {
        if (this.props.status === ConversationStatus.CLOSED) {
            throw new Error('Cannot assign a closed conversation');
        }

        this.props.advisorId = advisorId;
        this.props.status = ConversationStatus.ASSIGNED;
        this.props.updatedAt = new Date();
    }

    transferToAdvisor(newAdvisorId: string): void {
        if (this.props.status !== ConversationStatus.ASSIGNED) {
            throw new Error('Only assigned conversations can be transferred');
        }

        if (!this.props.advisorId) {
            throw new Error('Conversation has no advisor to transfer from');
        }

        this.props.advisorId = newAdvisorId;
        this.props.updatedAt = new Date();
    }

    close(): void {
        if (this.props.status === ConversationStatus.CLOSED) {
            throw new Error('Conversation is already closed');
        }

        this.props.status = ConversationStatus.CLOSED;
        this.props.updatedAt = new Date();
    }

    isWaiting(): boolean {
        return this.props.status === ConversationStatus.WAITING;
    }

    isAssigned(): boolean {
        return this.props.status === ConversationStatus.ASSIGNED;
    }

    get id(): string {
        return this.props.id;
    }

    get subject(): string {
        return this.props.subject;
    }

    get clientId(): string {
        return this.props.clientId;
    }

    get advisorId(): string | undefined {
        return this.props.advisorId;
    }

    get status(): ConversationStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
