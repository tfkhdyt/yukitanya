'use client';

import { type Session } from 'next-auth';

import { AnswerPost } from '@/components/answer/answer-post';
import { SkeletonAnswerPost } from '@/components/answer/skeleton-answer-post';
import { JawabanKosong } from '@/components/jawaban-kosong';
import { createInitial } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

type Question = {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  subject: {
    id: string;
    name: string;
  };
  owner: User;
  slug: string;
};

export function AnswerList({
  question,
  session,
}: {
  question: Question;
  session: Session | null;
}) {
  const answers = api.answer.findAllAnswersByQuestionId.useQuery(question.id);

  if (answers.isLoading) {
    return <SkeletonAnswerPost />;
  }

  if (answers.isError) {
    return (
      <JawabanKosong
        title={answers.error?.message}
        question={question}
        session={session}
      />
    );
  }

  if (answers.data.length === 0) {
    return (
      <JawabanKosong
        title={`${question.owner.name} menunggu jawaban mu`}
        question={question}
        session={session}
      />
    );
  }

  return (
    <>
      {answers.data.map((answer) => (
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
            content: question.content,
            createdAt: question.createdAt,
            id: question.id,
            subject: question.subject,
            updatedAt: question.updatedAt,
            owner: {
              ...question.owner,
              initial: createInitial(question.owner.name),
            },
            slug: question.slug,
          }}
          session={session}
        />
      ))}
    </>
  );
}
