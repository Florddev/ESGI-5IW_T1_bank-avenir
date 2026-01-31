import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notificationTypeEnum = pgEnum('notification_type', [
  'SAVINGS_RATE_CHANGE',
  'TRANSACTION',
  'LOAN_PAYMENT_DUE',
  'ORDER_FILLED',
  'MESSAGE_RECEIVED',
  'ADVISOR_MESSAGE',
]);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
