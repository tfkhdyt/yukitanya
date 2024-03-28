/* eslint-disable */
import { and, eq } from 'drizzle-orm';
import type { PgDatabase } from 'drizzle-orm/pg-core';

import { getDiceBearAvatar } from '@/lib/utils';
import cuid from 'cuid';
import { accounts, sessions, users, verificationTokens } from './db/schema';

export function CustomDrizzleAdapter(client: InstanceType<typeof PgDatabase>) {
  return {
    // @ts-expect-error
    async createUser(data) {
      return client
        .insert(users)
        .values({
          ...data,
          id: `user-${cuid()}`,
          image:
            data.password === 'facebook'
              ? getDiceBearAvatar(data.username)
              : data.image,
        })
        .returning()
        .then((res) => res[0] ?? null);
    },
    // @ts-expect-error
    async getUser(data) {
      return client
        .select()
        .from(users)
        .where(eq(users.id, data))
        .then((res) => res[0] ?? null);
    },
    // @ts-expect-error
    async getUserByEmail(data) {
      return client
        .select()
        .from(users)
        .where(eq(users.email, data))
        .then((res) => res[0] ?? null);
    },
    // @ts-expect-error
    async createSession(data) {
      return client
        .insert(sessions)
        .values(data)
        .returning()
        .then((res) => res[0]);
    },
    // @ts-expect-error
    async getSessionAndUser(data) {
      return client
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => res[0] ?? null);
    },
    // @ts-expect-error
    async updateUser(data) {
      if (!data.id) {
        throw new Error('No user id.');
      }

      return client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .then((res) => res[0]);
    },
    // @ts-expect-error
    async updateSession(data) {
      return client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0]);
    },
    // @ts-expect-error
    async linkAccount(rawAccount) {
      const updatedAccount = await client
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .then((res) => res[0]);

      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      const account = {
        ...updatedAccount,
        access_token: updatedAccount?.access_token,
        token_type: updatedAccount?.token_type,
        id_token: updatedAccount?.id_token,
        refresh_token: updatedAccount?.refresh_token,
        scope: updatedAccount?.scope,
        expires_at: updatedAccount?.expires_at,
        session_state: updatedAccount?.session_state,
      };

      return account;
    },
    // @ts-expect-error
    async getUserByAccount(account) {
      const dbAccount =
        (await client
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider),
            ),
          )
          .leftJoin(users, eq(accounts.userId, users.id))
          .then((res) => res[0])) ?? null;

      if (!dbAccount) {
        return null;
      }

      return dbAccount.user;
    },
    // @ts-expect-error
    async deleteSession(sessionToken) {
      const session = await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .then((res) => res[0] ?? null);

      return session;
    },
    // @ts-expect-error
    async createVerificationToken(token) {
      return client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .then((res) => res[0]);
    },
    // @ts-expect-error
    async useVerificationToken(token) {
      try {
        return await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token),
            ),
          )
          .returning()
          .then((res) => res[0] ?? null);
      } catch (_) {
        throw new Error('No verification token found.');
      }
    },
    // @ts-expect-error
    async deleteUser(id) {
      await client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .then((res) => res[0] ?? null);
    },
    // @ts-expect-error
    async unlinkAccount(account) {
      // @ts-expect-error
      const { type, provider, providerAccountId, userId } = await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          ),
        )
        .returning()
        .then((res) => res[0] ?? null);

      return { provider, type, providerAccountId, userId };
    },
  };
}
