import * as argon2 from 'argon2';
import { and, asc, desc, eq, gte, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';

import { getDiceBearAvatar, verifyCaptchaToken } from '@/lib/utils';
import { signupSchema } from '@/schema/signup-schema';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { answers, favorites, questions, users } from '@/server/db/schema';
import cuid from 'cuid';

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

			let nextCursor: typeof input.cursor | undefined = undefined;
			if (data.length > input.limit) {
				const nextItem = data.pop();
				nextCursor = nextItem?.id;
			}

			return {
				data,
				nextCursor,
			};
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
	findMostActiveUsers: publicProcedure.query(async ({ ctx }) => {
		const score =
			sql`COUNT(DISTINCT ${questions.id}) * 2 + COUNT(DISTINCT ${answers.id}) * 3 + COUNT(DISTINCT ${favorites.questionId})`.mapWith(
				Number,
			);

		const data = await ctx.db
			.select({
				user: users,
			})
			.from(users)
			.leftJoin(questions, eq(questions.userId, users.id))
			.leftJoin(answers, eq(answers.userId, users.id))
			.leftJoin(favorites, eq(favorites.userId, users.id))
			.groupBy(users.id)
			.orderBy(desc(score))
			.limit(3);

		return data;
	}),
});
