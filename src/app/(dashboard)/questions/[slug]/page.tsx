import { redirect } from 'next/navigation';
import { P, match } from 'ts-pattern';

import { createInitial } from '@/lib/utils';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';

import dayjs from 'dayjs';
import { AnswerList } from './answer-list';
import { DetailedQuestion } from './detailed-question';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const question = await api.question.findQuestionContentBySlug.query(slug);
  if (!question) return {};

  return {
    title: `${match(question.content.length)
      .with(P.number.gte(50), () => `${question.content.slice(0, 50)}...`)
      .otherwise(() => question.content)} - Yukitanya`,
    description: question.content,
  };
}

export default async function Question({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();
  const question = await api.question.findQuestionBySlug.query(params.slug);
  if (!question) {
    return redirect('/home');
  }

  const membership = question.owner.memberships.find((membership) =>
    dayjs().isBefore(membership.expiresAt),
  );

  return (
    <div>
      <DetailedQuestion
        question={{
          content: question.content,
          createdAt: question.createdAt,
          id: question.id,
          subject: question.subject,
          updatedAt: question.updatedAt,
          slug: question.slug,
          owner: {
            ...question.owner,
            membership,
            initial: createInitial(question.owner.name ?? undefined),
          },
          images: question.images,
        }}
        session={session ?? undefined}
      />
      <div>
        <AnswerList
          question={{
            ...question,
            owner: {
              ...question.owner,
              membership,
              initial: createInitial(question.owner.name ?? undefined),
            },
          }}
          session={session ?? undefined}
        />
      </div>
    </div>
  );
}
