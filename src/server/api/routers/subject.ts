import { answers, favorites, questions, subjects } from '@/server/db/schema';
import dayjs from 'dayjs';
import { desc, eq, gt, or, sql } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const subjectRouter = createTRPCRouter({
  findMostPopularSubjects: publicProcedure.query(async ({ ctx }) => {
    const score =
      sql`COUNT(${questions.id}) * 2 + COUNT(${answers.id}) * 3 + COUNT(${favorites.userId})`.mapWith(
        Number,
      );

    const data = await ctx.db
      .select({
        id: subjects.id,
        name: subjects.name,
      })
      .from(subjects)
      .leftJoin(questions, eq(questions.subjectId, subjects.id))
      .leftJoin(answers, eq(answers.questionId, questions.id))
      .leftJoin(favorites, eq(favorites.questionId, questions.id))
      .where(
        or(
          gt(questions.createdAt, dayjs().subtract(6, 'months').toDate()),
          gt(answers.createdAt, dayjs().subtract(6, 'months').toDate()),
        ),
      )
      .orderBy(desc(score))
      .groupBy(subjects.id)
      .limit(3);

    return data;
  }),
});
