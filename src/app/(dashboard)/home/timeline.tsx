'use client';

import { PertanyaanKosong } from '@/app/_components/pertanyaan-kosong';
import { api } from '@/trpc/react';
import { type Session } from 'next-auth';

import { QuestionPost } from './question/question-post';
import { SkeletonQuestionPost } from './question/skeleton-question-post';

export function Timeline({ session }: { session: Session | null }) {
  const questions = api.question.findAllQuestions.useQuery();
  const questionsBestAnswerRatings =
    api.rating.getQuestionBestAnswerRating.useQuery();

  if (
    (questions.isLoading && !questions.data) ||
    (questionsBestAnswerRatings.isLoading && !questionsBestAnswerRatings.data)
  ) {
    return <SkeletonQuestionPost />;
  }

  if (questions.isError || questionsBestAnswerRatings.isError) {
    return (
      <PertanyaanKosong
        title={
          questions.error?.message ?? questionsBestAnswerRatings.error?.message
        }
      />
    );
  }

  if (questions.data.length === 0) {
    return <PertanyaanKosong user={session?.user} />;
  }

  return (
    <>
      {questions.data.map((question) => (
        <QuestionPost
          key={question.id}
          question={{
            content: question.content,
            createdAt: question.createdAt,
            id: question.id,
            isFavorited: question.favorites.some(
              (favorite) => favorite.userId === session?.user.id,
            ),
            numberOfAnswers: question.answers.length,
            numberOfFavorites: question.favorites.length,
            rating: questionsBestAnswerRatings.data.find(
              (it) => it.questionId === question.id,
            )?.averageRating,
            subject: question.subject,
            updatedAt: question.updatedAt,
          }}
          session={session}
          user={{
            ...question.owner,
            initial:
              question.owner.name
                ?.split(' ')
                .map((name) => name.slice(0, 1))
                .join('') ?? '',
          }}
        />
      ))}
    </>
  );
}
