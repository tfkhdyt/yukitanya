import * as argon2 from 'argon2';
import { eq, ilike, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { getDiceBearAvatar } from '@/lib/utils';
import { signupSchema } from '@/schema/signup-schema';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { users } from '@/server/db/schema';

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      let user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (user) {
        throw new Error('Email telah digunakan');
      }

      user = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
      });
      if (user) {
        throw new Error('Username telah digunakan');
      }

      const hashedPwd = await argon2.hash(input.password);

      await ctx.db.insert(users).values({
        email: input.email,
        id: `user-${nanoid()}`,
        name: `${input.firstName.trim()} ${
          input.lastName?.trim() ?? ''
        }`.trim(),
        password: hashedPwd,
        image: getDiceBearAvatar(input.username),
        username: input.username,
      });
    }),
  signIn: publicProcedure
    .input(
      z.object({
        password: z.string().min(1),
        username: z.string().min(1).max(25),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: (users, { and, eq }) =>
          and(
            eq(users.username, input.username),
            eq(users.password, input.password),
          ),
      });
    }),
  findUsersByUsernameOrName: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          image: users.image,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(
          or(
            ilike(users.username, `%${input}%`),
            ilike(users.name, `%${input}%`),
          ),
        );
    }),
  findUserByUsername: publicProcedure
    .input(z.string())
    .query(({ ctx, input: username }) => {
      return ctx.db.query.users.findFirst({
        where: eq(users.username, username),
      });
    }),
  findUserStatByUsername: publicProcedure
    .input(z.string())
    .query(({ ctx, input: username }) => {
      return ctx.db.query.users.findFirst({
        columns: {
          id: true,
        },
        where: eq(users.username, username),
        with: {
          questions: {
            columns: {
              id: true,
            },
          },
          answers: {
            columns: {
              id: true,
            },
          },
          favorites: {
            columns: {
              questionId: true,
            },
          },
        },
      });
    }),
});
