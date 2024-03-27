import dayjs from 'dayjs';
import {
	and,
	countDistinct,
	desc,
	eq,
	gt,
	inArray,
	lte,
	sql,
} from 'drizzle-orm';
import { P, match } from 'ts-pattern';

import { type Pg, db } from '@/server/db';
import {
	type InsertQuestion,
	answers,
	favorites,
	questions,
	subjects,
	users,
} from '@/server/db/schema';

class QuestionRepoPg {
	constructor(private readonly db: Pg) {}

	async getTodayQuestionCount(userId: string) {
		const [thisDayPostsCount] = await this.db
			.select({
				count: countDistinct(questions),
			})
			.from(questions)
			.where(
				and(
					eq(questions.userId, userId),
					gt(questions.createdAt, dayjs().subtract(24, 'hours').toDate()),
				),
			);

		return thisDayPostsCount?.count ?? 0;
	}

	async findQuestionBySlug(slug: string) {
		return await this.db.query.questions.findFirst({
			where: eq(questions.slug, slug),
			with: {
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

	async createQuestion(question: InsertQuestion) {
		const createdQuestion = await db
			.insert(questions)
			.values(question)
			.returning({ id: questions.id });
		if (createdQuestion.length === 0) {
			throw new Error('Gagal membuat pertanyaan');
		}

		return createdQuestion[0];
	}

	async deleteQuestionById(questionId: string) {
		await this.db.delete(questions).where(eq(questions.id, questionId));
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
						and(eq(questions.subjectId, subjectId), lte(questions.id, cursor)),
					)
					.otherwise(() => lte(questions.id, cursor)),
			)
			.otherwise(() =>
				match(subjectId)
					.with(P.not(P.nullish), (subjectId) =>
						eq(questions.subjectId, subjectId),
					)
					.otherwise(() => undefined),
			);

		return await db.query.questions.findMany({
			where,
			orderBy: [desc(questions.createdAt)],
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
			orderBy: [desc(questions.createdAt)],
			where: cursor
				? and(eq(questions.userId, userId), lte(questions.id, cursor))
				: eq(questions.userId, userId),
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
			orderBy: [desc(questions.createdAt)],
			where: cursor
				? and(lte(questions.id, cursor), inArray(questions.id, questionId))
				: inArray(questions.id, questionId),
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

	async findQuestionById(questionId: string) {
		return await this.db.query.questions.findFirst({
			where: eq(questions.id, questionId),
			with: {
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

	async findQuestionMetadata(questionId: string) {
		return await this.db.query.questions.findFirst({
			where: eq(questions.id, questionId),
			columns: {
				id: true,
			},
			with: {
				answers: {
					columns: {
						id: true,
					},
				},
				favorites: {
					columns: {
						userId: true,
					},
				},
			},
		});
	}

	async findQuestionContentBySlug(slug: string) {
		return await this.db.query.questions.findFirst({
			where: eq(questions.slug, slug),
			columns: {
				content: true,
			},
		});
	}

	async findQuestionContentById(questionId: string) {
		return await this.db.query.questions.findFirst({
			where: eq(questions.id, questionId),
			columns: {
				content: true,
			},
		});
	}

	async updateQuestion(question: InsertQuestion) {
		await this.db
			.update(questions)
			.set({
				content: question.content,
				slug: question.slug,
				subjectId: question.subjectId,
				updatedAt: new Date(),
			})
			.where(eq(questions.id, question.id));
	}

	async findMostPopularQuestion(subjectId?: string) {
		const popularity =
			sql`COUNT(DISTINCT ${favorites.userId}) + COUNT(DISTINCT ${answers.id}) * 2`.mapWith(
				Number,
			);

		const [data] = await this.db
			.select({
				popularity,
				question: questions,
				owner: users,
				subject: subjects,
				numberOfFavorites: countDistinct(favorites.userId),
				numberOfAnswers: countDistinct(answers.id),
			})
			.from(questions)
			.leftJoin(favorites, eq(favorites.questionId, questions.id))
			.leftJoin(answers, eq(answers.questionId, questions.id))
			.innerJoin(users, eq(users.id, questions.userId))
			.innerJoin(subjects, eq(subjects.id, questions.subjectId))
			.where(
				subjectId
					? and(
							eq(questions.subjectId, subjectId),
							gt(questions.createdAt, dayjs().subtract(7, 'days').toDate()),
						)
					: gt(questions.createdAt, dayjs().subtract(7, 'days').toDate()),
			)
			.orderBy(desc(popularity))
			.groupBy(
				questions.content,
				questions.id,
				questions.createdAt,
				users.id,
				subjects.id,
			)
			.limit(1);

		return data;
	}
}

export { QuestionRepoPg };

export const questionRepoPg = new QuestionRepoPg(db);
