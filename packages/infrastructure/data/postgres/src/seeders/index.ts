import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { seedUsers } from './users.seeder';
import { seedStocks } from './stocks.seeder';
import { seedAccounts } from './accounts.seeder';
import { seedTransactions } from './transactions.seeder';
import { seedPortfolios } from './portfolios.seeder';
import { seedLoans } from './loans.seeder';
import { seedConversations } from './conversations.seeder';
import { seedMessages } from './messages.seeder';
import { seedNotifications } from './notifications.seeder';
import { seedOrders } from './orders.seeder';
import { seedSettings } from './settings.seeder';

async function runSeeders() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/avenir_bank';

  console.log('🚀 Starting database seeding...');
  console.log(`📦 Connecting to: ${connectionString.replace(/:[^:@]*@/, ':****@')}`);

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql, { schema });

  try {
    // Seed in correct order to respect foreign key constraints
    await seedUsers(db);
    await seedStocks(db);
    await seedAccounts(db);
    await seedTransactions(db);
    await seedPortfolios(db);
    await seedLoans(db);
    await seedConversations(db);
    await seedMessages(db);
    await seedNotifications(db);
    await seedOrders(db);
    await seedSettings(db);

    console.log('\n✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runSeeders();
