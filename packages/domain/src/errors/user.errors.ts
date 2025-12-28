import { DomainError } from './domain.error';

export class UserNotFoundError extends DomainError {
    constructor(identifier: string) {
        super(`User not found: ${identifier}`);
    }
}

export class UserAlreadyExistsError extends DomainError {
    constructor(email: string) {
        super(`User already exists with email: ${email}`);
    }
}

export class InvalidConfirmationTokenError extends DomainError {
    constructor() {
        super('Invalid or expired confirmation token');
    }
}

export class UserNotActiveError extends DomainError {
    constructor() {
        super('User account is not active');
    }
}

export class UserBannedError extends DomainError {
    constructor() {
        super('User account has been banned');
    }
}

export class UnauthorizedError extends DomainError {
    constructor(action: string) {
        super(`Unauthorized to perform action: ${action}`);
    }
}

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super('Email ou mot de passe incorrect');
    }
}

export class AccountNotConfirmedError extends DomainError {
    constructor() {
        super("Votre compte n'est pas encore confirmé. Veuillez vérifier vos emails.");
    }
}
