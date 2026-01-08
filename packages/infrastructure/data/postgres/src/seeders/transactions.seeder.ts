import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { transactions } from '../schema';
import * as schema from '../schema';

export async function seedTransactions(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding transactions...');

  const transactionsData = [
    {
      id: '30000000-0000-0000-0000-000000000001',
      fromAccountId: 'system-deposit',
      toAccountId: '20000000-0000-0000-0000-000000000001',
      type: 'TRANSFER' as const,
      status: 'COMPLETED' as const,
      amount: '5000.00',
      description: 'Dépôt initial',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      fromAccountId: '20000000-0000-0000-0000-000000000001',
      toAccountId: '20000000-0000-0000-0000-000000000002',
      type: 'TRANSFER' as const,
      status: 'COMPLETED' as const,
      amount: '1000.00',
      description: 'Transfert vers épargne',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: '30000000-0000-0000-0000-000000000003',
      fromAccountId: 'system-deposit',
      toAccountId: '20000000-0000-0000-0000-000000000003',
      type: 'TRANSFER' as const,
      status: 'COMPLETED' as const,
      amount: '8000.00',
      description: 'Dépôt initial',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '30000000-0000-0000-0000-000000000004',
      fromAccountId: '20000000-0000-0000-0000-000000000002',
      toAccountId: 'system-deposit',
      type: 'INTEREST' as const,
      status: 'COMPLETED' as const,
      amount: '40.63',
      description: 'Intérêts mensuels',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
    {
      id: '30000000-0000-0000-0000-000000000005',
      fromAccountId: 'system-deposit',
      toAccountId: '20000000-0000-0000-0000-000000000004',
      type: 'TRANSFER' as const,
      status: 'COMPLETED' as const,
      amount: '25000.00',
      description: 'Dépôt initial',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
  ];

  await db.insert(transactions).values(transactionsData).onConflictDoNothing();

  console.log(`✅ Seeded ${transactionsData.length} transactions`);
}
