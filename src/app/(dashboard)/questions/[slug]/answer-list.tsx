'use client';

import { type Session } from 'next-auth';

import { AnswerPost } from '@/components/answer/answer-post';
import { JawabanKosong } from '@/components/jawaban-kosong';
import { SkeletonQuestionPost } from '@/components/question/skeleton-question-post';
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
    return <SkeletonQuestionPost />;
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
            rating:
              answer.ratings.length > 0
                ? answer.ratings.reduce(
                    (accumulator, rating) => accumulator + rating.value,
                    0,
                  ) / answer.ratings.length
                : 0,
            owner: {
              ...answer.owner,
              initial:
                answer.owner.name
                  ?.split(' ')
                  .map((name) => name.slice(0, 1))
                  .join('') ?? '',
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
              initial:
                question.owner.name
                  ?.split(' ')
                  .map((name) => name.slice(0, 1))
                  .join('') ?? '',
            },
          }}
          session={session}
        />
      ))}
    </>
  );
}
