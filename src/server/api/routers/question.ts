import cuid from 'cuid';
import dayjs from 'dayjs';
import { and, countDistinct, desc, eq, gt, sql } from 'drizzle-orm';
import { z } from 'zod';

import { utapi } from '@/lib/uploadthing/server';
import { verifyCaptchaToken } from '@/lib/utils';
import {
	createQuestionSchema,
	findAllQuestionsBySubjectSchema,
	findAllQuestionsByUserIdSchema,
	findAllQuestionsSchema,
	searchQuestionSchema,
} from '@/schema/question-schema';
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
		.mutation(async ({ input }) => await questionService.createQuestion(input)),

	deleteQuestionById: protectedProcedure
		.input(z.string())
		.mutation(
			async ({ input: questionId }) =>
				await questionService.deleteQuestionById(questionId),
		),
	getTodayQuestionCount: protectedProcedure
		.input(z.string().optional())
		.query(async ({ input: userId }) => {
			if (!userId) {
				return null;
			}
			return await questionService.getTodayQuestionCount(userId);
		}),
	findAllQuestions: publicProcedure
		.input(findAllQuestionsSchema)
		.query(
			async ({ input }) =>
				await questionService.findAllQuestions(input.cursor, input.limit),
		),
	findAllQuestionsBySubject: publicProcedure
		.input(findAllQuestionsBySubjectSchema)
		.query(
			async ({ input }) =>
				await questionService.findAllQuestions(
					input.cursor,
					input.limit,
					input.subjectId,
				),
		),
	findAllQuestionsByUserId: publicProcedure
		.input(findAllQuestionsByUserIdSchema)
		.query(
			async ({ input }) =>
				await questionService.findAllQuestionsByUserId(
					input.userId,
					input.cursor,
					input.limit,
				),
		),
	findAllQuestionsByQueryAndSubject: publicProcedure
		.input(searchQuestionSchema)
		.query(
			async ({ input }) =>
				await questionService.searchQuestion(input.query, {
					subjectId: input.subjectId,
					cursor: input.cursor,
					limit: input.limit,
				}),
		),
	findQuestionBySlug: publicProcedure
		.input(z.string())
		.query(
			async ({ input: slug }) => await questionService.findQuestionBySlug(slug),
		),
	findQuestionMetadata: publicProcedure
		.input(z.string())
		.query(
			async ({ input: questionId }) =>
				await questionService.findQuestionMetadata(questionId),
		),
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
