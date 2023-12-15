import dayjs from 'dayjs';
import { and, countDistinct, desc, eq, gt, inArray, lte } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { db } from '@/server/db';
import * as schema from '@/server/db/schema';
import { P, match } from 'ts-pattern';

class QuestionRepoPg {
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

	async deleteQuestionById(questionId: string) {
		await this.db
			.delete(schema.questions)
			.where(eq(schema.questions.id, questionId));
	}

	async findAllQuestions(
		cursor?: string | null,
		limit = 10,
		subjectId?: string,
	) {
		const where = match(cursor)
			.with(P.not(P.nullish), (cursor) =>
				match(subjectId)
					.with(P.not(P.nullish), (subjectId) =>
						and(
							eq(schema.questions.subjectId, subjectId),
							lte(schema.questions.id, cursor),
						),
					)
					.otherwise(() => lte(schema.questions.id, cursor)),
			)
			.otherwise(() =>
				match(subjectId)
					.with(P.not(P.nullish), (subjectId) =>
						eq(schema.questions.subjectId, subjectId),
					)
					.otherwise(() => undefined),
			);

		return await db.query.questions.findMany({
			where,
			orderBy: [desc(schema.questions.createdAt)],
			limit: limit + 1,
			with: {
				answers: {
					columns: {
						id: true,
						isBestAnswer: true,
					},
					with: {
						ratings: {
							columns: {
								value: true,
							},
						},
					},
				},
				favorites: {
					columns: {
						userId: true,
					},
				},
				owner: {
					with: {
						memberships: true,
					},
				},
				subject: true,
				images: true,
			},
		});
	}

	async findAllQuestionsByUserId(
		userId: string,
		cursor?: string | null,
		limit = 10,
	) {
		return await this.db.query.questions.findMany({
			orderBy: [desc(schema.questions.createdAt)],
			where: cursor
				? and(
						eq(schema.questions.userId, userId),
						lte(schema.questions.id, cursor),
				  )
				: eq(schema.questions.userId, userId),
			limit: limit + 1,
			with: {
				answers: {
					columns: {
						id: true,
						isBestAnswer: true,
					},
					with: {
						ratings: {
							columns: {
								value: true,
							},
						},
					},
				},
				favorites: {
					columns: {
						userId: true,
					},
				},
				owner: {
					with: {
						memberships: true,
					},
				},
				subject: true,
				images: true,
			},
		});
	}

	async findAllQuestionsById(
		cursor?: string | null,
		limit = 10,
		...questionId: string[]
	) {
		return await await this.db.query.questions.findMany({
			orderBy: [desc(schema.questions.createdAt)],
			where: cursor
				? and(
						lte(schema.questions.id, cursor),
						inArray(schema.questions.id, questionId),
				  )
				: inArray(schema.questions.id, questionId),
			limit: limit + 1,
			with: {
				answers: {
					columns: {
						id: true,
						isBestAnswer: true,
					},
					with: {
						ratings: {
							columns: {
								value: true,
							},
						},
					},
				},
				favorites: {
					columns: {
						userId: true,
					},
				},
				owner: {
					with: {
						memberships: true,
					},
				},
				subject: true,
				images: true,
			},
		});
	}
}

export { QuestionRepoPg };

export const questionRepoPg = new QuestionRepoPg(db);
