import { pgTable, uuid, numeric, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { stocks } from './stocks';

export const portfolios = pgTable('portfolios', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stockId: uuid('stock_id').notNull().references(() => stocks.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  averagePurchasePrice: numeric('average_purchase_price', { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
