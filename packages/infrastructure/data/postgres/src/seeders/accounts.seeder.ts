import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { accounts } from '../schema';
import * as schema from '../schema';

export async function seedAccounts(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding accounts...');

  const accountsData = [
    {
      id: '20000000-0000-0000-0000-000000000001',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      iban: 'FR1420041010050500013M02606',
      customName: 'Compte Courant',
      type: 'CHECKING' as const,
      balance: '5420.50',
      savingsRate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      iban: 'FR7630006000011234567890189',
      customName: 'Livret Épargne',
      type: 'SAVINGS' as const,
      balance: '12500.00',
      savingsRate: '0.0325',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      iban: 'FR7630004000031234567890143',
      customName: 'Compte Principal',
      type: 'CHECKING' as const,
      balance: '8750.75',
      savingsRate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '20000000-0000-0000-0000-000000000004',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      iban: 'FR7612548029989876543210943',
      customName: 'Épargne Projet',
      type: 'SAVINGS' as const,
      balance: '25000.00',
      savingsRate: '0.0350',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '20000000-0000-0000-0000-000000000005',
      userId: '00000000-0000-0000-0000-000000000006', // Emma Petit
      iban: 'FR1420041010050500019M02655',
      customName: 'Mon Compte',
      type: 'CHECKING' as const,
      balance: '1200.00',
      savingsRate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.insert(accounts).values(accountsData).onConflictDoNothing();

  console.log(`✅ Seeded ${accountsData.length} accounts`);
}
