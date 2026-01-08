import { pgTable, uuid, varchar, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const transactionTypeEnum = pgEnum('transaction_type', [
  'TRANSFER',
  'INTEREST',
  'LOAN_DISBURSEMENT',
  'LOAN_PAYMENT',
  'STOCK_PURCHASE',
  'STOCK_SALE',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
  'PENDING',
  'COMPLETED',
  'FAILED',
]);

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromAccountId: varchar('from_account_id', { length: 255 }).notNull(),
  toAccountId: varchar('to_account_id', { length: 255 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  status: transactionStatusEnum('status').notNull().default('PENDING'),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  description: varchar('description', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
