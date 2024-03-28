'use client';

import type { Session } from 'next-auth';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { SkeletonQuestionPost } from '@/components/question/skeleton-question-post';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export function QuestionTabContent({
  session,
  user,
}: {
  session: Session | undefined;
  user: {
    id: string;
    name: string;
  };
}) {
  const { fetchNextPage, data, isLoading, isError, error, isFetchingNextPage } =
    api.question.findAllQuestionsByUserId.useInfiniteQuery(
      {
        userId: user.id,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const [reference, entry] = useIntersectionObserver({ threshold: 0 });
  useEffect(() => {
    if (entry?.isIntersecting) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const questions = data?.pages.flatMap((page) => page.data);

  if (isLoading) {
    return <SkeletonQuestionPost />;
  }

  if (isError) {
    return (
      <PertanyaanKosong title={error?.message} showTanyakanButton={false} />
    );
  }

  if (questions?.length === 0 || !questions) {
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
      {questions.map((question, index) => {
        const bestAnswerRatings =
          question.answers.find((answer) => answer.isBestAnswer)?.ratings ?? [];
        const totalRating =
          bestAnswerRatings?.reduce(
            (accumulator, rating) => accumulator + rating.value,
            0,
          ) ?? 0;
        const averageRating = bestAnswerRatings.length
          ? totalRating / bestAnswerRatings.length
          : NaN;
        const membership = question.owner.memberships.find((mb) =>
          dayjs().isBefore(mb.expiresAt),
        );

        return (
          <div
            key={question.id}
            ref={index === questions.length - 1 ? reference : undefined}
          >
            <QuestionPost
              question={{
                content: question.content,
                createdAt: question.createdAt,
                id: question.id,
                numberOfAnswers: question.answers.length,
                numberOfFavorites: question.favorites.length,
                owner: {
                  ...question.owner,
                  membership,
                  initial: createInitial(question.owner.name ?? undefined),
                },
                slug: question.slug,
                subject: question.subject,
                updatedAt: question.updatedAt,
                isFavorited: question.favorites.some(
                  (favorite) => favorite.userId === session?.user.id,
                ),
                rating: Number.isNaN(averageRating) ? undefined : averageRating,
                images: question.images,
              }}
              session={session}
            />
          </div>
        );
      })}
      {isFetchingNextPage && <SkeletonQuestionPost />}
    </>
  );
}
