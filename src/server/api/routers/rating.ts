import { answers, ratings } from '@/server/db/schema';
import { eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const ratingRouter = createTRPCRouter({
  getQuestionBestAnswerRating: publicProcedure
    .input(z.string().array())
    .query(({ ctx, input: answerIds }) => {
      return ctx.db
        .select({
          averageRating: sql<number>`AVG(${ratings.value})`,
          questionId: answers.questionId,
        })
        .from(ratings)
        .innerJoin(answers, eq(answers.id, ratings.answerId))
        .where(inArray(ratings.answerId, answerIds));
    }),
});
