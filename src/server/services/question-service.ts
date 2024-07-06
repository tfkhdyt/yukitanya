import { match } from 'ts-pattern';
// @ts-expect-error untyped library
import badwords from 'indonesian-badwords';

import { verifyCaptchaToken } from '@/lib/turnstile';
import { utapi } from '@/lib/uploadthing/server';
import type { CreateQuestion, UpdateQuestion } from '@/schema/question-schema';

import {
  type MembershipRepoPg,
  membershipRepoPg,
} from '../repositories/postgres/membership-repo-pg';
import {
  type OldSlugRepoPg,
  oldSlugRepoPg,
} from '../repositories/postgres/old-slug-repo-pg';
import {
  type QuestionImageRepoPg,
  questionImageRepoPg,
} from '../repositories/postgres/question-image-repo-pg';
import {
  type QuestionRepoPg,
  questionRepoPg,
} from '../repositories/postgres/question-repo-pg';
import { typesenseClient } from '@/lib/typesense';
import { QuestionRepoTypesense } from '../repositories/typesense/question-repo-typesense';

class QuestionService {
  // eslint-disable-next-line
  constructor(
    private readonly membershipRepo: MembershipRepoPg,
    private readonly questionImageRepo: QuestionImageRepoPg,
    private readonly questionRepo: QuestionRepoPg,
    private readonly oldSlugRepo: OldSlugRepoPg,
  ) {}

  async createQuestion(payload: CreateQuestion) {
    if (badwords.flag(payload.schema.content) as boolean) {
      throw new Error('Pertanyaan anda mengandung kata terlarang!');
    }

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

    await typesenseClient.collections('questions').documents().create({
      id: createdQuestion?.id,
      content: payload.schema.content,
      subjectId: payload.schema.subjectId,
    });
  }

  async deleteQuestionById(questionId: string) {
    const images =
      await this.questionImageRepo.findImagesByQuestionId(questionId);
    await this.questionRepo.deleteQuestionById(questionId);
    if (images.length > 0) {
      await utapi.deleteFiles(images.map((image) => image.id));
    }

    await typesenseClient
      .collections('questions')
      .documents(questionId)
      .delete();
  }

  async getTodayQuestionCount(userId: string) {
    return this.questionRepo.getTodayQuestionCount(userId);
  }

  async findAllQuestions(
    cursor?: string | undefined,
    limit = 10,
    subjectId?: string,
  ) {
    const data = await this.questionRepo.findAllQuestions(
      cursor,
      limit,
      subjectId,
    );

    let nextCursor: typeof cursor | undefined;
    if (data.length > limit) {
      const nextItem = data.pop();
      nextCursor = nextItem?.id;
    }

    return { data, nextCursor };
  }

  async findAllQuestionsByUserId(
    userId: string,
    cursor?: string | undefined,
    limit = 10,
  ) {
    const data = await this.questionRepo.findAllQuestionsByUserId(
      userId,
      cursor,
      limit,
    );

    let nextCursor: typeof cursor | undefined;
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
    const searchResult = await QuestionRepoTypesense.searchQuestion(
      query,
      subjectId,
    );
    const hitIds = searchResult.map((s) => s.id);

    let data = await this.questionRepo.findAllQuestionsById(
      cursor,
      limit,
      ...hitIds,
    );

    data = data.map((dt) => ({
      ...dt,
      content:
        searchResult.find((snip) => snip.id === dt.id)?.snippet ?? dt.content,
    }));

    console.log({ data, searchResult });

    let nextCursor: typeof cursor | undefined;
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

      return this.questionRepo.findQuestionById(oldQuestion.questionId);
    }

    return question;
  }

  async findQuestionMetadata(questionId: string) {
    return this.questionRepo.findQuestionMetadata(questionId);
  }

  async findQuestionContentBySlug(slug: string) {
    const question = await this.questionRepo.findQuestionContentBySlug(slug);
    if (!question) {
      const oldQuestion = await this.oldSlugRepo.findOldSlug(slug);
      if (!oldQuestion) return null;

      return this.questionRepo.findQuestionContentById(oldQuestion.questionId);
    }

    return question;
  }

  async updateQuestion(payload: UpdateQuestion) {
    if (badwords.flag(payload.schema.content) as boolean) {
      throw new Error('Pertanyaan anda mengandung kata terlarang!');
    }

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

    await typesenseClient
      .collections('questions')
      .documents(payload.schema.id)
      .update({
        content: payload.schema.content,
        subjectId: payload.schema.subjectId,
      });
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
  cursor?: string | undefined;
  limit: number;
};

export const questionService = new QuestionService(
  membershipRepoPg,
  questionImageRepoPg,
  questionRepoPg,
  oldSlugRepoPg,
);
