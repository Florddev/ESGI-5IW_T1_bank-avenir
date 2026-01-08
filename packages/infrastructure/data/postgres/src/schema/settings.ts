import { pgTable, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';

export const settings = pgTable('settings', {
  id: varchar('id', { length: 50 }).primaryKey(),
  savingsRate: numeric('savings_rate', { precision: 5, scale: 4 }).notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
