import { and, countDistinct, desc, eq, ilike, lte, sql } from 'drizzle-orm';
import { match } from 'ts-pattern';
import { z } from 'zod';

import {
	answers,
	favorites,
	insertQuestionSchema,
	oldSlug,
	questions,
	subjects,
	users,
} from '@/server/db/schema';

import cuid from 'cuid';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const questionRouter = createTRPCRouter({
	createQuestion: protectedProcedure
		.input(insertQuestionSchema)
		.mutation(async ({ ctx, input }) => {
			const question = await ctx.db.query.questions.findFirst({
				where: eq(questions.slug, input.slug),
			});
			if (question) {
				throw new Error('Pertanyaan yang sama telah ada!');
			}

			return ctx.db.insert(questions).values(input);
		}),
	deleteQuestionById: protectedProcedure
		.input(z.string())
		.mutation(({ ctx, input: questionId }) => {
			return ctx.db.delete(questions).where(eq(questions.id, questionId));
		}),
	findAllQuestions: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(10),
				cursor: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.questions.findMany({
				where: input.cursor ? lte(questions.id, input.cursor) : undefined,
				orderBy: [desc(questions.createdAt)],
				limit: input.limit + 1,
				with: {
					answers: {
						columns: {
							id: true,
							isBestAnswer: true,
						},
						with: {
							ratings: {
								columns: {
									value: true,
								},
							},
						},
					},
					favorites: {
						columns: {
							userId: true,
						},
					},
					owner: true,
					subject: true,
				},
			});

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
	findAllQuestionsBySubject: publicProcedure
		.input(
			z.object({
				subjectId: z.string(),
				limit: z.number().min(1).max(50).default(10),
				cursor: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.questions.findMany({
				orderBy: [desc(questions.createdAt)],
				where: input.cursor
					? and(
							eq(questions.subjectId, input.subjectId),
							lte(questions.id, input.cursor),
					  )
					: eq(questions.subjectId, input.subjectId),
				limit: input.limit + 1,
				with: {
					answers: {
						columns: {
							id: true,
							isBestAnswer: true,
						},
						with: {
							ratings: {
								columns: {
									value: true,
								},
							},
						},
					},
					favorites: {
						columns: {
							userId: true,
						},
					},
					owner: true,
					subject: true,
				},
			});

			let nextCursor: typeof input.cursor | undefined = undefined;
			if (data.length > input.limit) {
				const nextItem = data.pop();
				nextCursor = nextItem?.id;
			}

			return { data, nextCursor };
		}),
	findAllQuestionsByUserId: publicProcedure
		.input(
			z.object({
				userId: z.string(),
				limit: z.number().min(1).max(50).default(10),
				cursor: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.questions.findMany({
				orderBy: [desc(questions.createdAt)],
				where: input.cursor
					? and(
							eq(questions.userId, input.userId),
							lte(questions.id, input.cursor),
					  )
					: eq(questions.userId, input.userId),
				limit: input.limit + 1,
				with: {
					answers: {
						columns: {
							id: true,
							isBestAnswer: true,
						},
						with: {
							ratings: {
								columns: {
									value: true,
								},
							},
						},
					},
					favorites: {
						columns: {
							userId: true,
						},
					},
					owner: true,
					subject: true,
				},
			});

			let nextCursor: typeof input.cursor | undefined = undefined;
			if (data.length > input.limit) {
				const nextItem = data.pop();
				nextCursor = nextItem?.id;
			}

			return { data, nextCursor };
		}),
	findAllQuestionsByQueryAndSubject: publicProcedure
		.input(
			z.object({
				query: z.string(),
				subjectId: z.string(),
				limit: z.number().min(1).max(50).default(10),
				cursor: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const condition = match(input.subjectId)
				.with('all', () => {
					if (input.cursor) {
						return and(
							ilike(questions.content, `%${input.query}%`),
							lte(questions.id, input.cursor),
						);
					}

					return ilike(questions.content, `%${input.query}%`);
				})
				.otherwise((subjectId) => {
					if (input.cursor) {
						return and(
							ilike(questions.content, `%${input.query}%`),
							eq(questions.subjectId, subjectId),
							lte(questions.id, input.cursor),
						);
					}
					return and(
						ilike(questions.content, `%${input.query}%`),
						eq(questions.subjectId, subjectId),
					);
				});

			const data = await ctx.db.query.questions.findMany({
				orderBy: [desc(questions.createdAt)],
				where: condition,
				limit: input.limit + 1,
				with: {
					answers: {
						columns: {
							id: true,
							isBestAnswer: true,
						},
						with: {
							ratings: {
								columns: {
									value: true,
								},
							},
						},
					},
					favorites: {
						columns: {
							userId: true,
						},
					},
					owner: true,
					subject: true,
				},
			});

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
	findQuestionBySlug: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input: slug }) => {
			const question = await ctx.db.query.questions.findFirst({
				where: eq(questions.slug, slug),
				with: {
					owner: true,
					subject: true,
				},
			});

			if (!question) {
				const questionId = await ctx.db
					.select({ questionId: oldSlug.questionId })
					.from(oldSlug)
					.where(eq(oldSlug.slug, slug))
					.limit(1);

				if (!questionId[0]) return;

				return ctx.db.query.questions.findFirst({
					where: eq(questions.id, questionId[0].questionId),
					with: {
						owner: true,
						subject: true,
					},
				});
			}

			return question;
		}),
	findQuestionMetadata: publicProcedure
		.input(z.string())
		.query(({ ctx, input: questionId }) => {
			return ctx.db.query.questions.findFirst({
				where: eq(questions.id, questionId),
				columns: {
					id: true,
				},
				with: {
					answers: {
						columns: {
							id: true,
						},
					},
					favorites: {
						columns: {
							userId: true,
						},
					},
				},
			});
		}),
	findQuestionContentBySlug: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input: slug }) => {
			const question = await ctx.db
				.select({ content: questions.content })
				.from(questions)
				.where(eq(questions.slug, slug))
				.limit(1);

			if (!question[0]) {
				const questionId = await ctx.db
					.select({ questionId: oldSlug.questionId })
					.from(oldSlug)
					.where(eq(oldSlug.slug, slug))
					.limit(1);

				if (questionId[0])
					return ctx.db
						.select({ content: questions.content })
						.from(questions)
						.where(eq(questions.id, questionId[0].questionId))
						.limit(1);
			}

			return question;
		}),
	updateQuestionById: protectedProcedure
		.input(insertQuestionSchema)
		.mutation(async ({ ctx, input }) => {
			const question = await ctx.db
				.select({ slug: questions.slug })
				.from(questions)
				.where(eq(questions.id, input.id))
				.limit(1);

			if (question.length === 0 || !question[0])
				throw new Error('Pertanyaan tidak ditemukan');

			await ctx.db.insert(oldSlug).values({
				id: `old-slug-${cuid()}`,
				questionId: input.id,
				slug: question[0].slug,
			});

			await ctx.db
				.update(questions)
				.set({
					content: input.content,
					slug: input.slug,
					subjectId: input.subjectId,
					updatedAt: new Date(),
				})
				.where(eq(questions.id, input.id));
		}),
	findMostPopularQuestion: publicProcedure
		.input(z.string().optional())
		.query(async ({ ctx, input: subjectId }) => {
			const popularity =
				sql`COUNT(DISTINCT ${favorites.userId}) + COUNT(DISTINCT ${answers.id}) * 2`.mapWith(
					Number,
				);

			const [data] = await ctx.db
				.select({
					popularity,
					question: questions,
					owner: users,
					subject: subjects,
					numberOfFavorites: countDistinct(favorites.userId),
					numberOfAnswers: countDistinct(answers.id),
				})
				.from(questions)
				.leftJoin(favorites, eq(favorites.questionId, questions.id))
				.leftJoin(answers, eq(answers.questionId, questions.id))
				.innerJoin(users, eq(users.id, questions.userId))
				.innerJoin(subjects, eq(subjects.id, questions.subjectId))
				.where(subjectId ? eq(questions.subjectId, subjectId) : undefined)
				.orderBy(desc(popularity))
				.groupBy(
					questions.content,
					questions.id,
					questions.createdAt,
					users.id,
					subjects.id,
				)
				.limit(1);

			if (!data) return null;

			return data;
		}),
});
