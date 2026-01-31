import { pgTable, uuid, varchar, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const conversationStatusEnum = pgEnum('conversation_status', ['WAITING', 'ASSIGNED', 'OPEN', 'CLOSED']);

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => users.id, { onDelete: 'cascade' }),
  advisorId: uuid('advisor_id').references(() => users.id, { onDelete: 'set null' }),
  subject: varchar('subject', { length: 255 }).notNull(),
  status: conversationStatusEnum('status').notNull().default('WAITING'),
  isGroupChat: boolean('is_group_chat').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
