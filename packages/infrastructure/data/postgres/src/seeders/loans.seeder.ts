import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { loans } from '../schema';
import * as schema from '../schema';

export async function seedLoans(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding loans...');

  const loansData = [
    {
      id: '50000000-0000-0000-0000-000000000001',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      advisorId: '00000000-0000-0000-0000-000000000002', // Marie Conseiller
      accountId: '20000000-0000-0000-0000-000000000001',
      principal: '50000.00',
      remainingPrincipal: '42500.00',
      annualInterestRate: '0.0450',
      insuranceRate: '0.0025',
      monthlyPayment: '930.00',
      durationMonths: 60,
      remainingMonths: 48,
      status: 'ACTIVE' as const,
      nextPaymentDate: new Date('2026-02-15'),
      createdAt: new Date('2022-02-15'),
      updatedAt: new Date(),
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      advisorId: '00000000-0000-0000-0000-000000000003', // Pierre Durand
      accountId: '20000000-0000-0000-0000-000000000003',
      principal: '150000.00',
      remainingPrincipal: '135000.00',
      annualInterestRate: '0.0395',
      insuranceRate: '0.0030',
      monthlyPayment: '720.00',
      durationMonths: 240,
      remainingMonths: 220,
      status: 'ACTIVE' as const,
      nextPaymentDate: new Date('2026-02-01'),
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date(),
    },
  ];

  await db.insert(loans).values(loansData).onConflictDoNothing();

  console.log(`✅ Seeded ${loansData.length} loans`);
}
