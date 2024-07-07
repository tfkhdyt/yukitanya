import * as argon2 from 'argon2';
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  or,
  sql,
} from 'drizzle-orm';
import { z } from 'zod';

import { getDiceBearAvatar } from '@/lib/utils';
import { verifyCaptchaToken } from '@/lib/turnstile';
import { signupSchema } from '@/schema/signup-schema';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import {
  answers,
  favorites,
  memberships,
  questions,
  users,
} from '@/server/db/schema';
import cuid from 'cuid';
import dayjs from 'dayjs';

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      await verifyCaptchaToken(input.token);

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
        id: `user-${cuid()}`,
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
    .query(({ ctx, input }) =>
      ctx.db.query.users.findFirst({
        where: (users, { and, eq }) =>
          and(
            eq(users.username, input.username),
            eq(users.password, input.password),
          ),
      }),
    ),
  findUsersByUsernameOrName: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.cursor
        ? and(
            or(
              ilike(users.username, `%${input.query}%`),
              ilike(users.name, `%${input.query}%`),
            ),
            gte(users.id, input.cursor),
          )
        : or(
            ilike(users.username, `%${input.query}%`),
            ilike(users.name, `%${input.query}%`),
          );
      const data = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          image: users.image,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(where)
        .orderBy(asc(users.createdAt))
        .limit(input.limit + 1);

      let nextCursor: typeof input.cursor | undefined;
      if (data.length > input.limit) {
        const nextItem = data.pop();
        nextCursor = nextItem?.id;
      }

      if (data.length === 0) {
        return {
          data,
          nextCursor,
        };
      }

      const _memberships = await ctx.db
        .select()
        .from(memberships)
        .where(
          and(
            inArray(
              memberships.userId,
              data.map((dt) => dt.id),
            ),
            gt(memberships.expiresAt, new Date()),
          ),
        );

      return {
        data: data.map((dt) => ({
          ...dt,
          membership: _memberships.find((mb) => mb.userId === dt.id),
        })),
        nextCursor,
      };
    }),
  findUserByUsername: publicProcedure
    .input(z.string())
    .query(({ ctx, input: username }) =>
      ctx.db.query.users.findFirst({
        where: eq(users.username, username),
        with: {
          memberships: true,
        },
      }),
    ),
  findUserStatByUsername: publicProcedure
    .input(z.string())
    .query(({ ctx, input: username }) =>
      ctx.db.query.users.findFirst({
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
      }),
    ),
  findMostActiveUsers: publicProcedure.query(async ({ ctx }) => {
    const score =
      sql`COUNT(${questions.id}) * 2 + COUNT(${answers.id}) * 3 + COUNT(${favorites.questionId}) * 1`.mapWith(
        Number,
      );

    const data = await ctx.db
      .select({
        user: users,
        score,
      })
      .from(users)
      .leftJoin(questions, eq(questions.userId, users.id))
      .leftJoin(answers, eq(answers.userId, users.id))
      .leftJoin(favorites, eq(favorites.userId, users.id))
      .where(
        or(
          gt(questions.createdAt, dayjs().subtract(6, 'months').toDate()),
          gt(answers.createdAt, dayjs().subtract(6, 'months').toDate()),
        ),
      )
      .groupBy(users.id)
      .orderBy(desc(score))
      .limit(3);

    if (data.length === 0) return null;

    const _memberships = await ctx.db
      .select()
      .from(memberships)
      .where(
        and(
          inArray(
            memberships.userId,
            data.map((dt) => dt.user.id),
          ),
          gt(memberships.expiresAt, new Date()),
        ),
      );

    return data.map((dt) => ({
      user: {
        ...dt.user,
        membership: _memberships.find((mb) => mb.userId === dt.user.id),
      },
      score: dt.score,
    }));
  }),
});
