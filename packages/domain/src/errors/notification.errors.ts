import { DomainError } from './domain.error';

export class NotificationNotFoundError extends DomainError {
    constructor() {
        super('Notification not found');
    }
}
