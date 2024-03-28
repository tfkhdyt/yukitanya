import type { Session } from 'next-auth';
import Image from 'next/image';

import type { User } from '@/server/auth';

import { JawabSekarangButton } from './buttons/jawab-sekarang';

type Question = {
  content: string;
  createdAt: Date;
  subject: {
    id: string;
    name: string;
  };
  updatedAt: Date;
  owner: User;
  id: string;
};

export function JawabanKosong({
  title = 'Belum ada jawaban yang tersedia',
  session,
  question,
}: {
  title?: string;
  session: Session | null;
  question?: Question;
}) {
  return (
    <div className='p-6'>
      <Image
        alt='Jawaban Kosong'
        className='mx-auto'
        height={178}
        src='/img/questions/jawaban-kosong.png'
        width={213}
      />
      <p className='pb-4 text-center text-sm font-medium text-gray-500'>
        {title}
      </p>
      {session && question && (
        <JawabSekarangButton center session={session} question={question} />
      )}
    </div>
  );
}
