import { TanyakanSekarangBtn } from '@/app/_components/buttons/tanyakan-sekarang';
import { PertanyaanKosong } from '@/app/_components/pertanyaan-kosong';
import { questions } from '@/constants/question';
import { getServerAuthSession } from '@/server/auth';
import { type Metadata } from 'next';
import Image from 'next/image';

import { QuestionPost } from './question/question-post';

export const metadata: Metadata = {
  title: 'Beranda - Yukitanya',
};

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <div className='flex border-b-2 p-6 md:items-center lg:hidden'>
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
              date: question.date,
              id: question.id,
              numberOfAnswers: question.numberOfAnswers,
              numberOfFavorites: question.numberOfFavorites,
              rating: question.rating,
              subject: question.subject,
            }}
            user={question.user}
          />
        ))
      ) : (
        <PertanyaanKosong user={session?.user} />
      )}
    </>
  );
}
