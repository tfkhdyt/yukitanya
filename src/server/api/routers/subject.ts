import { answers, favorites, questions, subjects } from '@/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const subjectRouter = createTRPCRouter({
	findMostPopularSubjects: publicProcedure.query(async ({ ctx }) => {
		const score =
			sql`COUNT(DISTINCT ${questions.id}) * 2 + COUNT(DISTINCT ${answers.id}) * 3 + COUNT(DISTINCT ${favorites.userId})`.mapWith(
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
			.orderBy(desc(score))
			.groupBy(subjects.id)
			.limit(3);

		return data;
	}),
});
