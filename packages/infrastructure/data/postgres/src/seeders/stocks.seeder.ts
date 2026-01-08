import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { stocks } from '../schema';
import * as schema from '../schema';

export async function seedStocks(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding stocks...');

  const stocksData = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      currentPrice: '178.50',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      currentPrice: '385.20',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      symbol: 'GOOGL',
      companyName: 'Alphabet Inc.',
      currentPrice: '142.80',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      symbol: 'AMZN',
      companyName: 'Amazon.com Inc.',
      currentPrice: '155.30',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      symbol: 'TSLA',
      companyName: 'Tesla Inc.',
      currentPrice: '248.75',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10000000-0000-0000-0000-000000000006',
      symbol: 'META',
      companyName: 'Meta Platforms Inc.',
      currentPrice: '355.90',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10000000-0000-0000-0000-000000000007',
      symbol: 'NVDA',
      companyName: 'NVIDIA Corporation',
      currentPrice: '495.60',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10000000-0000-0000-0000-000000000008',
      symbol: 'NFLX',
      companyName: 'Netflix Inc.',
      currentPrice: '425.30',
      status: 'AVAILABLE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.insert(stocks).values(stocksData).onConflictDoNothing();

  console.log(`✅ Seeded ${stocksData.length} stocks`);
}
