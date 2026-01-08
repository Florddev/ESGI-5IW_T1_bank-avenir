import { eq } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IUserRepository } from '@workspace/application/ports';
import { User, UserRole, UserStatus } from '@workspace/domain/entities';
import { Email, Password } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { users } from '../schema';

@Repository(TOKENS.IUserRepository)
export class PostgresUserRepository implements IUserRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByConfirmationToken(token: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.confirmationToken, token))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findAll(): Promise<User[]> {
    const result = await this.db.select().from(users);
    return result.map(row => this.rowToEntity(row));
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.role, role));

    return result.map(row => this.rowToEntity(row));
  }

  async save(user: User): Promise<User> {
    const values = {
      id: user.id,
      email: user.email.toString().toLowerCase(),
      password: user.passwordHash.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      confirmationToken: user.confirmationToken || undefined,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    };

    await this.db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: values,
      });

    return user;
  }

  async update(user: User): Promise<User> {
    await this.db
      .update(users)
      .set({
        email: user.email.toString().toLowerCase(),
        password: user.passwordHash.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        confirmationToken: user.confirmationToken || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  private rowToEntity(row: typeof users.$inferSelect): User {
    return User.fromPersistence({
      id: row.id,
      email: Email.fromString(row.email),
      passwordHash: Password.fromHash(row.password),
      firstName: row.firstName,
      lastName: row.lastName,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      confirmationToken: row.confirmationToken || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
