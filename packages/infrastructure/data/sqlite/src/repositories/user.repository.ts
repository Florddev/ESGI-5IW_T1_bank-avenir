import { IUserRepository } from '@workspace/application/ports';
import { User, UserRole, UserStatus, Email } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface UserRow {
    id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    status: string;
    confirmation_token: string | null;
    created_at: number;
    updated_at: number;
}

@Repository(TOKENS.IUserRepository)
export class SqliteUserRepository implements IUserRepository {
    private rowToUser(row: UserRow): User {
        return User.fromPersistence({
            id: row.id,
            email: Email.create(row.email),
            password: row.password,
            firstName: row.first_name,
            lastName: row.last_name,
            role: row.role as UserRole,
            status: row.status as UserStatus,
            confirmationToken: row.confirmation_token || undefined,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }

    async findById(id: string): Promise<User | null> {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const row = stmt.get(id) as UserRow | undefined;
        return row ? this.rowToUser(row) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const row = stmt.get(email.toLowerCase()) as UserRow | undefined;
        return row ? this.rowToUser(row) : null;
    }

    async findByConfirmationToken(token: string): Promise<User | null> {
        const stmt = db.prepare('SELECT * FROM users WHERE confirmation_token = ?');
        const row = stmt.get(token) as UserRow | undefined;
        return row ? this.rowToUser(row) : null;
    }

    async findAll(): Promise<User[]> {
        const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
        const rows = stmt.all() as UserRow[];
        return rows.map((row) => this.rowToUser(row));
    }

    async findByRole(role: UserRole): Promise<User[]> {
        const stmt = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC');
        const rows = stmt.all(role) as UserRow[];
        return rows.map((row) => this.rowToUser(row));
    }

    async save(user: User): Promise<User> {
        const stmt = db.prepare(`
            INSERT INTO users (id, email, password, first_name, last_name, role, status, confirmation_token, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            user.id,
            user.email.toString().toLowerCase(),
            user.password,
            user.firstName,
            user.lastName,
            user.role,
            user.status,
            user.confirmationToken || null,
            user.createdAt.getTime(),
            user.updatedAt.getTime()
        );
        
        return user;
    }

    async update(user: User): Promise<User> {
        const stmt = db.prepare(`
            UPDATE users
            SET email = ?, password = ?, first_name = ?, last_name = ?, role = ?, status = ?, 
                confirmation_token = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(
            user.email.toString().toLowerCase(),
            user.password,
            user.firstName,
            user.lastName,
            user.role,
            user.status,
            user.confirmationToken || null,
            user.updatedAt.getTime(),
            user.id
        );
        
        return user;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        stmt.run(id);
    }
}
