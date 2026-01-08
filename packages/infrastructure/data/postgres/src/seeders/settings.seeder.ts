import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { settings } from '../schema';
import * as schema from '../schema';

export async function seedSettings(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding settings...');

  const settingsData = [
    {
      id: 'SAVINGS_RATE',
      savingsRate: '0.0350',
      updatedAt: new Date(),
    },
  ];

  await db.insert(settings).values(settingsData).onConflictDoNothing();

  console.log(`✅ Seeded ${settingsData.length} settings`);
}
