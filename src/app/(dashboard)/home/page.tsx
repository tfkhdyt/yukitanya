import { TanyakanSekarangBtn } from '@/app/_components/buttons/tanyakan-sekarang';
import { PertanyaanKosong } from '@/app/_components/pertanyaan-kosong';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import clsx from 'clsx';
import { type Metadata } from 'next';
import Image from 'next/image';

import { QuestionPost } from './question/question-post';

export const metadata: Metadata = {
  title: 'Beranda - Yukitanya',
};

export default async function Home() {
  const session = await getServerAuthSession();
  const questions = await api.question.findAllQuestions.query();

  console.log({ questions });

  const bestAnswerIds = questions
    .map((question) => question.answers[0]?.id ?? '')
    .filter((question) => question !== '');
  let questionsBestAnswerRatings: {
    averageRating: number;
    questionId: string;
  }[] = [];
  if (bestAnswerIds.length > 0) {
    questionsBestAnswerRatings =
      await api.rating.getQuestionBestAnswerRating.query(bestAnswerIds);
  }

  return (
    <>
      <div
        className={clsx(
          'flex border-b-2 p-6 md:items-center lg:hidden',
          session?.user ?? 'hidden',
        )}
      >
        <div className='w-2/3 space-y-4 pr-2'>
          <h2 className='text-xl font-extrabold'>
            JANGAN MALU UNTUK BERTANYA!
          </h2>
          <TanyakanSekarangBtn user={session?.user} />
        </div>
        <div className='w-1/3'>
          <Image
            alt='Mari bertanya'
            className='mx-auto'
            height={129}
            src='/img/home/mari-bertanya.png'
            width={168}
          />
        </div>
      </div>
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionPost
            key={question.id}
            question={{
              content: question.content,
              createdAt: question.createdAt,
              id: question.id,
              numberOfAnswers: question.answers.length,
              numberOfFavorites: question.favorites.length,
              rating: questionsBestAnswerRatings.find(
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
        ))
      ) : (
        <PertanyaanKosong user={session?.user} />
      )}
    </>
  );
}
