export enum NotificationType {
    SAVINGS_RATE_CHANGE = 'SAVINGS_RATE_CHANGE',
    TRANSACTION = 'TRANSACTION',
    LOAN_PAYMENT_DUE = 'LOAN_PAYMENT_DUE',
    ORDER_FILLED = 'ORDER_FILLED',
    MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
    ADVISOR_MESSAGE = 'ADVISOR_MESSAGE',
}

export interface NotificationProps {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Notification {
    private constructor(private readonly props: NotificationProps) {}

    static create(
        userId: string,
        type: NotificationType,
        title: string,
        message: string
    ): Notification {
        return new Notification({
            id: crypto.randomUUID(),
            userId,
            type,
            title,
            message,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: NotificationProps): Notification {
        return new Notification(props);
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

    get userId(): string {
        return this.props.userId;
    }

    get type(): NotificationType {
        return this.props.type;
    }

    get title(): string {
        return this.props.title;
    }

    get message(): string {
        return this.props.message;
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
