import dayjs from 'dayjs';
import { and, countDistinct, eq, gt } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { db } from '@/server/db';
import * as schema from '@/server/db/schema';

export class QuestionRepoPg {
	constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

	async getTodayQuestionCount(userId: string) {
		const [thisDayPostsCount] = await this.db
			.select({
				count: countDistinct(schema.questions),
			})
			.from(schema.questions)
			.where(
				and(
					eq(schema.questions.userId, userId),
					gt(
						schema.questions.createdAt,
						dayjs().subtract(24, 'hours').toDate(),
					),
				),
			);

		return thisDayPostsCount?.count ?? 0;
	}

	async findQuestionBySlug(slug: string) {
		return await this.db.query.questions.findFirst({
			where: eq(schema.questions.slug, slug),
		});
	}

	async createQuestion(question: schema.InsertQuestion) {
		const createdQuestion = await db
			.insert(schema.questions)
			.values(question)
			.returning({ id: schema.questions.id });
		if (createdQuestion.length === 0) {
			throw new Error('Gagal membuat pertanyaan');
		}

		return createdQuestion[0];
	}
}

export const questionRepoPg = new QuestionRepoPg(db);