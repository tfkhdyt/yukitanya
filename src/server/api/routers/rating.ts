import { eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { answers, ratings } from '@/server/db/schema';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const ratingRouter = createTRPCRouter({
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
