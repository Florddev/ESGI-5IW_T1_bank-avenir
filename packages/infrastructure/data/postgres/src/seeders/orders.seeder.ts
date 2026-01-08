import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { orders } from '../schema';
import * as schema from '../schema';

export async function seedOrders(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding orders...');

  const ordersData = [
    {
      id: '90000000-0000-0000-0000-000000000001',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      stockId: '10000000-0000-0000-0000-000000000001', // AAPL
      type: 'BUY' as const,
      status: 'FILLED' as const,
      quantity: 10,
      pricePerShare: '165.00',
      remainingQuantity: 0,
      fees: '8.25',
      createdAt: new Date('2024-01-15T09:30:00'),
      updatedAt: new Date('2024-01-15T10:00:00'),
    },
    {
      id: '90000000-0000-0000-0000-000000000002',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      stockId: '10000000-0000-0000-0000-000000000002', // MSFT
      type: 'BUY' as const,
      status: 'FILLED' as const,
      quantity: 5,
      pricePerShare: '370.00',
      remainingQuantity: 0,
      fees: '9.25',
      createdAt: new Date('2024-02-01T10:45:00'),
      updatedAt: new Date('2024-02-01T11:00:00'),
    },
    {
      id: '90000000-0000-0000-0000-000000000003',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      stockId: '10000000-0000-0000-0000-000000000003', // GOOGL
      type: 'BUY' as const,
      status: 'FILLED' as const,
      quantity: 15,
      pricePerShare: '138.50',
      remainingQuantity: 0,
      fees: '10.40',
      createdAt: new Date('2024-01-20T14:15:00'),
      updatedAt: new Date('2024-01-20T14:30:00'),
    },
    {
      id: '90000000-0000-0000-0000-000000000004',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      stockId: '10000000-0000-0000-0000-000000000005', // TSLA
      type: 'BUY' as const,
      status: 'FILLED' as const,
      quantity: 8,
      pricePerShare: '235.00',
      remainingQuantity: 0,
      fees: '9.40',
      createdAt: new Date('2024-02-15T12:45:00'),
      updatedAt: new Date('2024-02-15T13:00:00'),
    },
    {
      id: '90000000-0000-0000-0000-000000000005',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      stockId: '10000000-0000-0000-0000-000000000007', // NVDA
      type: 'BUY' as const,
      status: 'PENDING' as const,
      quantity: 3,
      pricePerShare: '490.00',
      remainingQuantity: 3,
      fees: '0.00',
      createdAt: new Date('2024-03-05T15:30:00'),
      updatedAt: new Date('2024-03-05T15:30:00'),
    },
  ];

  await db.insert(orders).values(ordersData).onConflictDoNothing();

  console.log(`✅ Seeded ${ordersData.length} orders`);
}
