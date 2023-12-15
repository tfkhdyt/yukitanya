import dayjs from 'dayjs';
import { and, countDistinct, desc, eq, gt, sql } from 'drizzle-orm';
import { z } from 'zod';

import {
	createQuestionSchema,
	findAllQuestionsBySubjectSchema,
	findAllQuestionsByUserIdSchema,
	findAllQuestionsSchema,
	searchQuestionSchema,
	updateQuestionSchema,
} from '@/schema/question-schema';
import {
	answers,
	favorites,
	memberships,
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
		.query(
			async ({ input: slug }) =>
				await questionService.findQuestionContentBySlug(slug),
		),
	updateQuestionById: protectedProcedure
		.input(updateQuestionSchema)
		.mutation(async ({ input }) => await questionService.updateQuestion(input)),
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
