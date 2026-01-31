import { sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { users } from '../schema';
import * as schema from '../schema';
import bcrypt from 'bcryptjs';

export async function seedUsers(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding users...');

  const hashedPassword = await bcrypt.hash('$$Password123!', 10);

  const usersData = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'director@avenir-bank.com',
      password: hashedPassword,
      firstName: 'Jean',
      lastName: 'Directeur',
      role: 'DIRECTOR' as const,
      status: 'ACTIVE' as const,
      confirmationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'advisor1@avenir-bank.com',
      password: hashedPassword,
      firstName: 'Marie',
      lastName: 'Conseiller',
      role: 'ADVISOR' as const,
      status: 'ACTIVE' as const,
      confirmationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'advisor2@avenir-bank.com',
      password: hashedPassword,
      firstName: 'Pierre',
      lastName: 'Durand',
      role: 'ADVISOR' as const,
      status: 'ACTIVE' as const,
      confirmationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'client1@example.com',
      password: hashedPassword,
      firstName: 'Sophie',
      lastName: 'Martin',
      role: 'CLIENT' as const,
      status: 'ACTIVE' as const,
      confirmationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      email: 'client2@example.com',
      password: hashedPassword,
      firstName: 'Thomas',
      lastName: 'Bernard',
      role: 'CLIENT' as const,
      status: 'ACTIVE' as const,
      confirmationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      email: 'client3@example.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Petit',
      role: 'CLIENT' as const,
      status: 'PENDING_CONFIRMATION' as const,
      confirmationToken: 'confirmation-token-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.insert(users).values(usersData).onConflictDoNothing();

  console.log(`✅ Seeded ${usersData.length} users`);
}
