import { pgTable, uuid, varchar, numeric, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { stocks } from './stocks';

export const orderTypeEnum = pgEnum('order_type', ['BUY', 'SELL']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED']);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stockId: uuid('stock_id').notNull().references(() => stocks.id, { onDelete: 'cascade' }),
  type: orderTypeEnum('type').notNull(),
  quantity: integer('quantity').notNull(),
  pricePerShare: numeric('price_per_share', { precision: 15, scale: 2 }).notNull(),
  remainingQuantity: integer('remaining_quantity').notNull(),
  fees: numeric('fees', { precision: 15, scale: 2 }).notNull().default('0'),
  status: orderStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
