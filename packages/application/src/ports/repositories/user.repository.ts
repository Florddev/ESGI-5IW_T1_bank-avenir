import { User, UserRole } from '@workspace/domain/entities';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByConfirmationToken(token: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findByRole(role: UserRole): Promise<User[]>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}
