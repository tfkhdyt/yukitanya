import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { Button } from '@/app/_components/ui/button';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';

import { AnswerModal } from './answer/answer-modal';
import { AnswerPost } from './answer/answer-post';
import { DetailedQuestion } from './detailed-question';

// export function generateMetadata({ params }: { params: { id: string } }) {
//   const id = params.id;
//   const question = questions.find((question) => question.id === id);

//   return {
//     title: `${match(question?.content.length)
//       .with(P.number.gte(25), () => question?.content.slice(0, 25) + '...')
//       .otherwise(() => question?.content)} - Yukitanya`,
//   };
// }

export const revalidate = 0;

export default async function Question({
  params,
}: {
  params: { slug: string };
}) {
  const question = await api.question.findQuestionBySlug.query(params.slug);
  if (!question) {
    return redirect('/home');
  }
  const answerIds = question?.answers.map((answer) => answer.id) ?? [];
  const session = await getServerAuthSession();
  let ratings: {
    answerId: string;
    average: number;
    numberOfVotes: number;
  }[] = [];
  if (answerIds.length > 0) {
    ratings = await api.rating.getAnswerRatings.query(answerIds);
  }

  return (
    <div>
      <DetailedQuestion
        question={{
          content: question.content,
          answers: question.answers,
          createdAt: question.createdAt,
          favorites: question.favorites,
          id: question.id,
          subject: question.subject,
          updatedAt: question.updatedAt,
        }}
        user={{
          ...question.owner,
          initial:
            question.owner.name
              ?.split(' ')
              .map((name) => name.slice(0, 1))
              .join('') ?? '',
        }}
        session={session}
      />
      <div>
        {question.answers.length > 0 ? (
          question.answers.map((answer) => (
            <AnswerPost
              answer={{
                content: answer.content,
                createdAt: answer.createdAt,
                updatedAt: answer.updatedAt,
                id: answer.id,
                isBestAnswer: answer.isBestAnswer,
                numberOfVotes:
                  ratings.find((rating) => rating.answerId === answer.id)
                    ?.numberOfVotes ?? 0,
                rating:
                  ratings.find((rating) => rating.answerId === answer.id)
                    ?.average ?? 0,
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
              user={{
                ...answer.owner,
                initial:
                  answer.owner.name
                    ?.split(' ')
                    .map((name) => name.slice(0, 1))
                    .join('') ?? '',
              }}
            />
          ))
        ) : (
          <div className='p-6'>
            <Image
              alt='Jawaban Kosong'
              className='mx-auto'
              height={178}
              src='/img/questions/jawaban-kosong.png'
              width={213}
            />
            <p className='text-center text-sm font-medium text-gray-500'>
              {question.owner.name} menunggu jawabanmu
            </p>
            {session && (
              <AnswerModal
                question={question}
                user={{
                  ...question.owner,
                  initial:
                    question.owner.name
                      ?.split(' ')
                      .map((name) => name.slice(0, 1))
                      .join('') ?? '',
                }}
                session={session}
              >
                <Button className='mx-auto mt-4 flex items-center space-x-2 rounded-full font-semibold'>
                  <MessageCircle size={16} />
                  <p>Tambahkan Jawabanmu!</p>
                </Button>
              </AnswerModal>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
