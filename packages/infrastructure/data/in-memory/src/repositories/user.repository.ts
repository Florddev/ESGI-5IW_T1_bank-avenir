import { IUserRepository } from '@workspace/application/ports';
import { User, UserRole } from '@workspace/domain/entities';
import { Repository, TOKENS } from '@workspace/shared/di';

@Repository(TOKENS.IUserRepository)
export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map();

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email.toString() === email.toLowerCase()) {
                return user;
            }
        }
        return null;
    }

    async findByConfirmationToken(token: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.confirmationToken === token) {
                return user;
            }
        }
        return null;
    }

    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    async findByRole(role: UserRole): Promise<User[]> {
        return Array.from(this.users.values()).filter((user) => user.role === role);
    }

    async save(user: User): Promise<User> {
        this.users.set(user.id, user);
        return user;
    }

    async update(user: User): Promise<User> {
        this.users.set(user.id, user);
        return user;
    }

    async delete(id: string): Promise<void> {
        this.users.delete(id);
    }
}
