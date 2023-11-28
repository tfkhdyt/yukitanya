'use client';

import { type Session } from 'next-auth';

import { AnswerPost } from '@/components/answer/answer-post';
import { SkeletonAnswerPost } from '@/components/answer/skeleton-answer-post';
import { JawabanKosong } from '@/components/jawaban-kosong';
import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

export function AnswerTabContent({
  session,
  user,
}: {
  session: Session | null;
  user: {
    id: string;
    name: string;
  };
}) {
  const answers = api.answer.findAllAnswersByUserId.useQuery(user.id);

  if (answers.isLoading && !answers.data) {
    return <SkeletonAnswerPost />;
  }

  if (answers.isError) {
    return <JawabanKosong title={answers.error?.message} session={session} />;
  }

  if (answers.data.length === 0) {
    return (
      <PertanyaanKosong
        user={session?.user}
        title={`${user.name} belum membuat jawaban`}
        showTanyakanButton={false}
      />
    );
  }

  return (
    <>
      {answers.data.map((answer) => {
        return (
          <AnswerPost
            answer={{
              content: answer.content,
              createdAt: answer.createdAt,
              updatedAt: answer.updatedAt,
              id: answer.id,
              isBestAnswer: answer.isBestAnswer,
              numberOfVotes: answer.ratings.length,
              ratings: answer.ratings,
              owner: {
                ...answer.owner,
                initial: createInitial(answer.owner.name),
              },
            }}
            key={answer.id}
            question={{
              content: answer.question.content,
              createdAt: answer.question.createdAt,
              id: answer.question.id,
              subject: answer.question.subject,
              updatedAt: answer.question.updatedAt,
              owner: {
                ...answer.question.owner,
                initial: createInitial(answer.question.owner.name),
              },
              slug: answer.question.slug,
            }}
            session={session}
          />
        );
      })}
    </>
  );
}
