import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { conversations } from '../schema';
import * as schema from '../schema';

export async function seedConversations(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding conversations...');

  const conversationsData = [
    {
      id: '60000000-0000-0000-0000-000000000001',
      clientId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      advisorId: '00000000-0000-0000-0000-000000000002', // Marie Conseiller
      subject: 'Question sur mon prêt immobilier',
      status: 'ASSIGNED' as const,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
    },
    {
      id: '60000000-0000-0000-0000-000000000002',
      clientId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      advisorId: '00000000-0000-0000-0000-000000000003', // Pierre Durand
      subject: 'Investissement en bourse',
      status: 'OPEN' as const,
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-08'),
    },
    {
      id: '60000000-0000-0000-0000-000000000003',
      clientId: '00000000-0000-0000-0000-000000000006', // Emma Petit
      advisorId: null,
      subject: 'Ouverture de compte épargne',
      status: 'WAITING' as const,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
  ];

  await db.insert(conversations).values(conversationsData).onConflictDoNothing();

  console.log(`✅ Seeded ${conversationsData.length} conversations`);
}
