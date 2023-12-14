import cuid from 'cuid';
import dayjs from 'dayjs';
import {
	and,
	countDistinct,
	desc,
	eq,
	gt,
	inArray,
	lte,
	sql,
} from 'drizzle-orm';
import { z } from 'zod';

import { questionIndex } from '@/lib/algolia';
import { utapi } from '@/lib/uploadthing/server';
import { verifyCaptchaToken } from '@/lib/utils';
import { createQuestionSchema } from '@/schema/question-schema';
import {
	answers,
	favorites,
	insertQuestionSchema,
	memberships,
	oldSlug,
	questionImages,
	questions,
	subjects,
	users,
} from '@/server/db/schema';
import { questionService } from '@/server/services/question-service';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const questionRouter = createTRPCRouter({
	createQuestion: protectedProcedure
		.input(createQuestionSchema)
		.mutation(({ input }) => questionService.createQuestion(input)),

	deleteQuestionById: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input: questionId }) => {
			const images = await ctx.db
				.select()
				.from(questionImages)
				.where(eq(questionImages.questionId, questionId));

			await ctx.db.delete(questions).where(eq(questions.id, questionId));

			if (images.length > 0) {
				await utapi.deleteFiles(images.map((img) => img.id));
			}
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
					owner: {
						with: {
							memberships: true,
						},
					},
					subject: true,
					images: true,
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
					owner: {
						with: {
							memberships: true,
						},
					},
					subject: true,
					images: true,
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
					owner: {
						with: {
							memberships: true,
						},
					},
					subject: true,
					images: true,
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
			const searchResults = await questionIndex.search(input.query, {
				filters:
					input.subjectId !== 'all'
						? `subjectId:${input.subjectId}`
						: undefined,
			});
			const hitsIds = searchResults.hits.map((hit) => hit.objectID);
			if (hitsIds.length === 0) {
				throw new Error('Pertanyaan yang kamu cari tidak ditemukan');
			}

			const data = await ctx.db.query.questions.findMany({
				orderBy: [desc(questions.createdAt)],
				where: input.cursor
					? and(lte(questions.id, input.cursor), inArray(questions.id, hitsIds))
					: inArray(questions.id, hitsIds),
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
					owner: {
						with: {
							memberships: true,
						},
					},
					subject: true,
					images: true,
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
					owner: {
						with: {
							memberships: true,
						},
					},
					subject: true,
					images: true,
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
						owner: {
							with: {
								memberships: true,
							},
						},
						subject: true,
						images: true,
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
		.input(
			z.object({
				schema: insertQuestionSchema,
				token: z.string().optional(),
				images: z
					.object({
						id: z.string(),
						url: z.string().url(),
					})
					.array()
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await verifyCaptchaToken(input.token);

			const [question] = await ctx.db
				.select({ slug: questions.slug })
				.from(questions)
				.where(eq(questions.id, input.schema.id))
				.limit(1);

			if (!question) throw new Error('Pertanyaan tidak ditemukan');

			if (input.schema.slug !== question.slug) {
				await ctx.db.insert(oldSlug).values({
					id: `old-slug-${cuid()}`,
					questionId: input.schema.id,
					slug: question.slug,
				});
			}

			if (input.images && input.images.length > 0) {
				const replacedImages = await ctx.db
					.delete(questionImages)
					.where(eq(questionImages.questionId, input.schema.id))
					.returning({ id: questionImages.id });
				await utapi.deleteFiles(replacedImages.map((img) => img.id));

				const imagesInput = input.images.map((img) => ({
					...img,
					questionId: input.schema.id,
				}));

				return ctx.db.insert(questionImages).values(imagesInput);
			}

			await ctx.db
				.update(questions)
				.set({
					content: input.schema.content,
					slug: input.schema.slug,
					subjectId: input.schema.subjectId,
					updatedAt: new Date(),
				})
				.where(eq(questions.id, input.schema.id));
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
				.where(
					subjectId
						? and(
								eq(questions.subjectId, subjectId),
								gt(questions.createdAt, dayjs().subtract(7, 'days').toDate()),
						  )
						: gt(questions.createdAt, dayjs().subtract(7, 'days').toDate()),
				)
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

			const images = await ctx.db
				.select()
				.from(questionImages)
				.where(eq(questionImages.questionId, data.question.id));

			const membership = await ctx.db
				.select()
				.from(memberships)
				.where(
					and(
						eq(memberships.userId, data.owner.id),
						gt(memberships.expiresAt, new Date()),
					),
				)
				.limit(1);

			return {
				...data,
				owner: {
					...data.owner,
					membership,
				},
				images,
			};
		}),
});
