import { and, eq, inArray, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { answers, ratings } from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const ratingRouter = createTRPCRouter({
  addRating: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        answerId: z.string(),
        value: z.number().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const haveRated = await ctx.db
        .select()
        .from(ratings)
        .where(
          and(
            eq(ratings.answerId, input.answerId),
            eq(ratings.userId, input.userId),
          ),
        )
        .limit(1);

      if (haveRated.length === 0) {
        return ctx.db.insert(ratings).values({
          answerId: input.answerId,
          id: `rating-${nanoid()}`,
          userId: input.userId,
          value: input.value,
        });
      }

      return ctx.db
        .update(ratings)
        .set({ value: input.value })
        .where(
          and(
            eq(ratings.answerId, input.answerId),
            eq(ratings.userId, input.userId),
          ),
        );
    }),
  deleteRating: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        answerId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(ratings)
        .where(
          and(
            eq(ratings.answerId, input.answerId),
            eq(ratings.userId, input.userId),
          ),
        );
    }),
  getQuestionBestAnswerRating: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        averageRating: sql<number>`AVG(${ratings.value})`,
        questionId: answers.questionId,
      })
      .from(ratings)
      .innerJoin(answers, eq(answers.id, ratings.answerId))
      .where(eq(answers.isBestAnswer, true))
      .groupBy(answers.questionId);
  }),
  getAnswerRatings: publicProcedure
    .input(z.string().array())
    .query(({ ctx, input: answerIds }) => {
      return ctx.db
        .select({
          answerId: ratings.answerId,
          average: sql<number>`AVG(${ratings.value})`,
          numberOfVotes: sql<number>`CAST(COUNT(${ratings.answerId}) as int)`,
        })
        .from(ratings)
        .where(inArray(ratings.answerId, answerIds))
        .groupBy(ratings.answerId);
    }),
});
