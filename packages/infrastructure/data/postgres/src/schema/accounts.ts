import { pgTable, uuid, varchar, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const accountTypeEnum = pgEnum('account_type', ['CHECKING', 'SAVINGS']);

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  iban: varchar('iban', { length: 34 }).notNull().unique(),
  customName: varchar('custom_name', { length: 100 }).notNull(),
  type: accountTypeEnum('type').notNull(),
  balance: numeric('balance', { precision: 15, scale: 2 }).notNull().default('0'),
  savingsRate: numeric('savings_rate', { precision: 5, scale: 4 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
