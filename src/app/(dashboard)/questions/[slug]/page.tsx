import { redirect } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';

import { AnswerList } from './answer-list';
import { DetailedQuestion } from './detailed-question';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const question = await api.question.findQuestionContentBySlug.query(slug);

  if (question.length > 0) {
    return {
      title: `${match(question[0]?.content.length)
        .with(P.number.gte(50), () => question[0]?.content.slice(0, 50) + '...')
        .otherwise(() => question[0]?.content)} - Yukitanya`,
      description: question[0]?.content,
    };
  }
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

  return (
    <div>
      <DetailedQuestion
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
      <div>
        <AnswerList
          question={{
            ...question,
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
      </div>
    </div>
  );
}
