import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

export function getDatabase() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/avenir_bank';

    client = postgres(connectionString, {
      max: 10, // Connection pool size
      idle_timeout: 20,
      connect_timeout: 10,
    });

    db = drizzle(client, { schema });
  }

  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.end();
    client = null;
    db = null;
  }
}

export { schema };
