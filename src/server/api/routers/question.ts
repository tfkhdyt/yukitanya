import { z } from 'zod';

import {
  createQuestionSchema,
  findAllQuestionsBySubjectSchema,
  findAllQuestionsByUserIdSchema,
  findAllQuestionsSchema,
  searchQuestionSchema,
  updateQuestionSchema,
} from '@/schema/question-schema';
import { questionService } from '@/server/services/question-service';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const questionRouter = createTRPCRouter({
  createQuestion: protectedProcedure
    .input(createQuestionSchema)
    .mutation(async ({ input }) => questionService.createQuestion(input)),

  deleteQuestionById: protectedProcedure
    .input(z.string())
    .mutation(
      async ({ input: questionId }) =>
        questionService.deleteQuestionById(questionId),
    ),
  getTodayQuestionCount: protectedProcedure
    .input(z.string().optional())
    .query(async ({ input: userId }) => {
      if (!userId) {
        return null;
      }

      return questionService.getTodayQuestionCount(userId);
    }),
  findAllQuestions: publicProcedure
    .input(findAllQuestionsSchema)
    .query(
      async ({ input }) =>
        questionService.findAllQuestions(input.cursor, input.limit),
    ),
  findAllQuestionsBySubject: publicProcedure
    .input(findAllQuestionsBySubjectSchema)
    .query(
      async ({ input }) =>
        questionService.findAllQuestions(
          input.cursor,
          input.limit,
          input.subjectId,
        ),
    ),
  findAllQuestionsByUserId: publicProcedure
    .input(findAllQuestionsByUserIdSchema)
    .query(
      async ({ input }) =>
        questionService.findAllQuestionsByUserId(
          input.userId,
          input.cursor,
          input.limit,
        ),
    ),
  findAllQuestionsByQueryAndSubject: publicProcedure
    .input(searchQuestionSchema)
    .query(
      async ({ input }) =>
        questionService.searchQuestion(input.query, {
          subjectId: input.subjectId,
          cursor: input.cursor,
          limit: input.limit,
        }),
    ),
  findQuestionBySlug: publicProcedure
    .input(z.string())
    .query(
      async ({ input: slug }) => questionService.findQuestionBySlug(slug),
    ),
  findQuestionMetadata: publicProcedure
    .input(z.string())
    .query(
      async ({ input: questionId }) =>
        questionService.findQuestionMetadata(questionId),
    ),
  findQuestionContentBySlug: publicProcedure
    .input(z.string())
    .query(
      async ({ input: slug }) =>
        questionService.findQuestionContentBySlug(slug),
    ),
  updateQuestionById: protectedProcedure
    .input(updateQuestionSchema)
    .mutation(async ({ input }) => questionService.updateQuestion(input)),
  findMostPopularQuestion: publicProcedure
    .input(z.string().optional())
    .query(
      async ({ input: subjectId }) =>
        questionService.findMostPopularQuestion(subjectId),
    ),
});
