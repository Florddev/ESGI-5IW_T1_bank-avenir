import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['CLIENT', 'ADVISOR', 'DIRECTOR']);
export const userStatusEnum = pgEnum('user_status', ['PENDING_CONFIRMATION', 'ACTIVE', 'BANNED']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull().default('CLIENT'),
  status: userStatusEnum('status').notNull().default('PENDING_CONFIRMATION'),
  confirmationToken: varchar('confirmation_token', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
