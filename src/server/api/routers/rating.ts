import { eq, sql } from 'drizzle-orm';

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
});
