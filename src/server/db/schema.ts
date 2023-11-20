import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { type AdapterAccount } from 'next-auth/adapters';

export const users = pgTable('user', {
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  id: text('id').notNull().primaryKey(),
  image: text('image'),
  name: text('name'),
  password: text('password').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  username: varchar('username', { length: 25 }).notNull(),
});

export const accounts = pgTable(
  'account',
  {
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    id_token: text('id_token'),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    scope: text('scope'),
    session_state: text('session_state'),
    token_type: text('token_type'),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable('session', {
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
