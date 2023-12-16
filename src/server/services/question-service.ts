import { match } from 'ts-pattern';

import { verifyCaptchaToken } from '@/lib/turnstile';
import { utapi } from '@/lib/uploadthing/server';
import { CreateQuestion, UpdateQuestion } from '@/schema/question-schema';

import {
	QuestionRepoAlgolia,
	questionRepoAlgolia,
} from '../repositories/algolia/question-repo-algolia';
import {
	MembershipRepoPg,
	membershipRepoPg,
} from '../repositories/postgres/membership-repo-pg';
import {
	OldSlugRepoPg,
	oldSlugRepoPg,
} from '../repositories/postgres/old-slug-repo-pg';
import {
	QuestionImageRepoPg,
	questionImageRepoPg,
} from '../repositories/postgres/question-image-repo-pg';
import {
	QuestionRepoPg,
	questionRepoPg,
} from '../repositories/postgres/question-repo-pg';

class QuestionService {
	constructor(
		private readonly membershipRepo: MembershipRepoPg,
		private readonly questionImageRepo: QuestionImageRepoPg,
		private readonly questionRepo: QuestionRepoPg,
		private readonly oldSlugRepo: OldSlugRepoPg,

		private readonly questionRepoAlgolia: QuestionRepoAlgolia,
	) {}

	async createQuestion(payload: CreateQuestion) {
		await verifyCaptchaToken(payload.token);

		const membership = await this.membershipRepo.findValidMembership(
			payload.schema.userId,
		);
		const todayQuestionCount = await this.questionRepo.getTodayQuestionCount(
			payload.schema.userId,
		);

		match(membership?.type)
			.with('standard', () => {
				if (todayQuestionCount >= 10) {
					throw new Error(
						'Anda telah melewati batas pembuatan pertanyaan hari ini',
					);
				}
			})
			.with('plus', () => undefined)
			.otherwise(() => {
				if (todayQuestionCount >= 2) {
					throw new Error(
						'Anda telah melewati batas pembuatan pertanyaan hari ini',
					);
				}
			});

		const question = await this.questionRepo.findQuestionBySlug(
			payload.schema.slug,
		);
		if (question) {
			throw new Error('Pertanyaan yang sama telah ada!');
		}

		const createdQuestion = await this.questionRepo.createQuestion(
			payload.schema,
		);

		if (payload.image && payload.image?.length > 0 && createdQuestion) {
			const imagesInput = payload.image.map((img) => ({
				...img,
				questionId: createdQuestion.id,
			}));

			await this.questionImageRepo.addQuestionImage(...imagesInput);
		}
	}

	async deleteQuestionById(questionId: string) {
		const images =
			await this.questionImageRepo.findImagesByQuestionId(questionId);
		await this.questionRepo.deleteQuestionById(questionId);
		if (images.length > 0) {
			await utapi.deleteFiles(images.map((image) => image.id));
		}
	}

	async getTodayQuestionCount(userId: string) {
		return await this.questionRepo.getTodayQuestionCount(userId);
	}

	async findAllQuestions(
		cursor?: string | null,
		limit = 10,
		subjectId?: string,
	) {
		const data = await this.questionRepo.findAllQuestions(
			cursor,
			limit,
			subjectId,
		);

		let nextCursor: typeof cursor | undefined = undefined;
		if (data.length > limit) {
			const nextItem = data.pop();
			nextCursor = nextItem?.id;
		}

		return { data, nextCursor };
	}

	async findAllQuestionsByUserId(
		userId: string,
		cursor?: string | null,
		limit = 10,
	) {
		const data = await this.questionRepo.findAllQuestionsByUserId(
			userId,
			cursor,
			limit,
		);

		let nextCursor: typeof cursor | undefined = undefined;
		if (data.length > limit) {
			const nextItem = data.pop();
			nextCursor = nextItem?.id;
		}

		return { data, nextCursor };
	}

	async searchQuestion(
		query: string,
		{ subjectId, cursor, limit }: SearchQuestionDto,
	) {
		const searchResult = await this.questionRepoAlgolia.searchQuestion(
			query,
			subjectId,
		);
		const data = await this.questionRepo.findAllQuestionsById(
			cursor,
			limit,
			...searchResult,
		);

		let nextCursor: typeof cursor | undefined = undefined;
		if (data.length > limit) {
			const nextItem = data.pop();
			nextCursor = nextItem?.id;
		}

		return { data, nextCursor };
	}

	async findQuestionBySlug(slug: string) {
		const question = await this.questionRepo.findQuestionBySlug(slug);
		if (!question) {
			const oldQuestion = await this.oldSlugRepo.findOldSlug(slug);
			if (!oldQuestion) return null;

			return await this.questionRepo.findQuestionById(oldQuestion.questionId);
		}

		return question;
	}

	async findQuestionMetadata(questionId: string) {
		return await this.questionRepo.findQuestionMetadata(questionId);
	}

	async findQuestionContentBySlug(slug: string) {
		const question = await this.questionRepo.findQuestionContentBySlug(slug);
		if (!question) {
			const oldQuestion = await this.oldSlugRepo.findOldSlug(slug);
			if (!oldQuestion) return null;

			return await this.questionRepo.findQuestionContentById(
				oldQuestion.questionId,
			);
		}

		return question;
	}

	async updateQuestion(payload: UpdateQuestion) {
		await verifyCaptchaToken(payload.token);

		const question = await this.questionRepo.findQuestionById(
			payload.schema.id,
		);
		if (!question) {
			throw new Error('Pertanyaan tidak ditemukan');
		}

		if (payload.schema.slug !== question.slug) {
			await this.oldSlugRepo.addOldSlug(payload.schema.id, question.slug);
		}

		if (payload.images?.length && payload.images.length > 0) {
			const replacedImages =
				await this.questionImageRepo.deleteImagesByQuestionId(
					payload.schema.id,
				);

			if (replacedImages.length > 0) {
				await utapi.deleteFiles(replacedImages.map((img) => img.id));
			}

			const imagesInput = payload.images.map((img) => ({
				...img,
				questionId: payload.schema.id,
			}));

			await this.questionImageRepo.addQuestionImage(...imagesInput);
		}

		await this.questionRepo.updateQuestion(payload.schema);
	}

	async findMostPopularQuestion(subjectId?: string) {
		const mostPopularQuestion =
			await this.questionRepo.findMostPopularQuestion(subjectId);
		if (!mostPopularQuestion) {
			return null;
		}

		const questionImages = await this.questionImageRepo.findImagesByQuestionId(
			mostPopularQuestion.question.id,
		);
		const membership = await this.membershipRepo.findValidMembership(
			mostPopularQuestion.owner.id,
		);

		return {
			...mostPopularQuestion,
			owner: {
				...mostPopularQuestion.owner,
				membership,
			},
			images: questionImages,
		};
	}
}

type SearchQuestionDto = {
	subjectId?: string;
	cursor?: string | null;
	limit: number;
};

export const questionService = new QuestionService(
	membershipRepoPg,
	questionImageRepoPg,
	questionRepoPg,
	oldSlugRepoPg,
	questionRepoAlgolia,
);
