import { pgTable, uuid, numeric, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { accounts } from './accounts';

export const loanStatusEnum = pgEnum('loan_status', ['ACTIVE', 'COMPLETED', 'DEFAULTED']);

export const loans = pgTable('loans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  advisorId: uuid('advisor_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'restrict' }),
  principal: numeric('principal', { precision: 15, scale: 2 }).notNull(),
  remainingPrincipal: numeric('remaining_principal', { precision: 15, scale: 2 }).notNull(),
  annualInterestRate: numeric('annual_interest_rate', { precision: 5, scale: 4 }).notNull(),
  insuranceRate: numeric('insurance_rate', { precision: 5, scale: 4 }).notNull(),
  monthlyPayment: numeric('monthly_payment', { precision: 15, scale: 2 }).notNull(),
  durationMonths: integer('duration_months').notNull(),
  remainingMonths: integer('remaining_months').notNull(),
  status: loanStatusEnum('status').notNull().default('ACTIVE'),
  nextPaymentDate: timestamp('next_payment_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
