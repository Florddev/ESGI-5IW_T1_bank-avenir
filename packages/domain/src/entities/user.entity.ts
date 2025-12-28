import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

export enum UserRole {
    CLIENT = 'CLIENT',
    ADVISOR = 'ADVISOR',
    DIRECTOR = 'DIRECTOR',
}

export enum UserStatus {
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
    ACTIVE = 'ACTIVE',
    BANNED = 'BANNED',
}

export interface UserProps {
    id: string;
    email: Email;
    passwordHash: Password;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    confirmationToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    private constructor(private readonly props: UserProps) {}

    static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
        return new User({
            ...props,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: UserProps): User {
        return new User(props);
    }

    confirm(): void {
        if (this.props.status !== UserStatus.PENDING_CONFIRMATION) {
            throw new Error('User is not pending confirmation');
        }
        this.props.status = UserStatus.ACTIVE;
        this.props.confirmationToken = undefined;
        this.props.updatedAt = new Date();
    }

    ban(): void {
        if (this.props.status === UserStatus.BANNED) {
            throw new Error('User is already banned');
        }
        this.props.status = UserStatus.BANNED;
        this.props.updatedAt = new Date();
    }

    updateProfile(firstName: string, lastName: string): void {
        this.props.firstName = firstName;
        this.props.lastName = lastName;
        this.props.updatedAt = new Date();
    }

    isClient(): boolean {
        return this.props.role === UserRole.CLIENT;
    }

    isAdvisor(): boolean {
        return this.props.role === UserRole.ADVISOR;
    }

    isDirector(): boolean {
        return this.props.role === UserRole.DIRECTOR;
    }

    isActive(): boolean {
        return this.props.status === UserStatus.ACTIVE;
    }

    isBanned(): boolean {
        return this.props.status === UserStatus.BANNED;
    }

    get id(): string {
        return this.props.id;
    }

    get email(): Email {
        return this.props.email;
    }

    get passwordHash(): Password {
        return this.props.passwordHash;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get fullName(): string {
        return `${this.props.firstName} ${this.props.lastName}`;
    }

    get role(): UserRole {
        return this.props.role;
    }

    get status(): UserStatus {
        return this.props.status;
    }

    get confirmationToken(): string | undefined {
        return this.props.confirmationToken;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
