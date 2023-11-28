'use client';

import { type Session } from 'next-auth';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { SkeletonQuestionPost } from '@/components/question/skeleton-question-post';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

export function QuestionTabContent({
  session,
  user,
}: {
  session: Session | null;
  user: {
    id: string;
    name: string;
  };
}) {
  const questions = api.question.findAllQuestionsByUserId.useQuery(user.id);

  if (questions.isLoading && !questions.data) {
    return <SkeletonQuestionPost />;
  }

  if (questions.isError) {
    return (
      <PertanyaanKosong
        title={questions.error?.message}
        showTanyakanButton={false}
      />
    );
  }

  if (questions.data.length === 0) {
    return (
      <PertanyaanKosong
        user={session?.user}
        title={`${user.name} belum membuat pertanyaan`}
        showTanyakanButton={session?.user.id === user.id}
      />
    );
  }

  return (
    <>
      {questions.data.map((question) => {
        const bestAnswerRatings =
          question.answers.find((answer) => answer.isBestAnswer === true)
            ?.ratings ?? [];
        const totalRating =
          bestAnswerRatings?.reduce(
            (accumulator, rating) => accumulator + rating.value,
            0,
          ) ?? 0;
        const averageRating = totalRating / bestAnswerRatings?.length;

        return (
          <QuestionPost
            key={question.id}
            question={{
              content: question.content,
              createdAt: question.createdAt,
              id: question.id,
              numberOfAnswers: question.answers.length,
              numberOfFavorites: question.favorites.length,
              owner: {
                ...question.owner,
                initial: createInitial(question.owner.name),
              },
              slug: question.slug,
              subject: question.subject,
              updatedAt: question.updatedAt,
              isFavorited: question.favorites.some(
                (favorite) => favorite.userId === session?.user.id,
              ),
              rating: Number.isNaN(averageRating) ? undefined : averageRating,
            }}
            session={session}
          />
        );
      })}
    </>
  );
}
