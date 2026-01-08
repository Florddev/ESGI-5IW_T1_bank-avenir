import { pgTable, uuid, varchar, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const stockStatusEnum = pgEnum('stock_status', ['AVAILABLE', 'UNAVAILABLE']);

export const stocks = pgTable('stocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  symbol: varchar('symbol', { length: 10 }).notNull().unique(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  currentPrice: numeric('current_price', { precision: 15, scale: 2 }).notNull(),
  status: stockStatusEnum('status').notNull().default('AVAILABLE'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
