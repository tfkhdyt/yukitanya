import { answers, questions } from '@/server/db/schema';
import { desc, eq } from 'drizzle-orm';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const questionRouter = createTRPCRouter({
  findAllQuestions: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.questions.findMany({
      orderBy: [desc(questions.createdAt)],
      with: {
        answers: {
          columns: {
            id: true,
          },
          limit: 1,
          where: eq(answers.isBestAnswer, true),
        },
        favorites: true,
        owner: true,
        subject: true,
      },
    });
  }),
});
