import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { portfolios } from '../schema';
import * as schema from '../schema';

export async function seedPortfolios(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding portfolios...');

  const portfoliosData = [
    {
      id: '40000000-0000-0000-0000-000000000001',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      stockId: '10000000-0000-0000-0000-000000000001', // AAPL
      quantity: 10,
      averagePurchasePrice: '165.00',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      stockId: '10000000-0000-0000-0000-000000000002', // MSFT
      quantity: 5,
      averagePurchasePrice: '370.00',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: '40000000-0000-0000-0000-000000000003',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      stockId: '10000000-0000-0000-0000-000000000003', // GOOGL
      quantity: 15,
      averagePurchasePrice: '138.50',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '40000000-0000-0000-0000-000000000004',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      stockId: '10000000-0000-0000-0000-000000000005', // TSLA
      quantity: 8,
      averagePurchasePrice: '235.00',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    },
  ];

  await db.insert(portfolios).values(portfoliosData).onConflictDoNothing();

  console.log(`✅ Seeded ${portfoliosData.length} portfolios`);
}
