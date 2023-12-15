import { match } from 'ts-pattern';

import { verifyCaptchaToken } from '@/lib/turnstile';
import { utapi } from '@/lib/uploadthing/server';
import { CreateQuestion } from '@/schema/question-schema';

import {
	MembershipRepoPg,
	membershipRepoPg,
} from '../repositories/postgres/membership-repo-pg';
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

		return {
			data,
			nextCursor,
		};
	}
}

export const questionService = new QuestionService(
	membershipRepoPg,
	questionImageRepoPg,
	questionRepoPg,
);
