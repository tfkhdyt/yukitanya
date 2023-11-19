import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { type AdapterAccount } from 'next-auth/adapters';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `yukitanya_${name}`);

export const posts = mysqlTable(
  'post',
  {
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdById: varchar('createdById', { length: 255 }).notNull(),
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 256 }),
    updatedAt: timestamp('updatedAt').onUpdateNow(),
  },
  (example) => ({
    createdByIdIdx: index('createdById_idx').on(example.createdById),
    nameIndex: index('name_idx').on(example.name),
  }),
);

export const users = mysqlTable('user', {
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    fsp: 3,
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  image: varchar('image', { length: 255 }),
  name: varchar('name', { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = mysqlTable(
  'account',
  {
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    id_token: text('id_token'),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    scope: varchar('scope', { length: 255 }),
    session_state: varchar('session_state', { length: 255 }),
    token_type: varchar('token_type', { length: 255 }),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    userId: varchar('userId', { length: 255 }).notNull(),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index('userId_idx').on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  'session',
  {
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    sessionToken: varchar('sessionToken', { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
  },
  (session) => ({
    userIdIdx: index('userId_idx').on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  'verificationToken',
  {
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
