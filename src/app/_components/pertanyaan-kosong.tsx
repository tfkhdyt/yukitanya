import Image from 'next/image';

import type { User } from '@/server/auth';

import { TanyakanSekarangButton } from './buttons/tanyakan-sekarang';

export function PertanyaanKosong({
  title = 'Belum ada pertanyaan yang tersedia',
  user,
  defaultSubject,
  showTanyakanButton = true,
}: {
  title?: string;
  user?: User;
  defaultSubject?: string;
  showTanyakanButton?: boolean;
}) {
  return (
    <div className='p-6'>
      <Image
        alt='Pertanyaan Kosong'
        className='mx-auto'
        height={178}
        src='/img/questions/jawaban-kosong.png'
        width={213}
      />
      <p className='pb-4 text-center text-sm font-medium text-gray-500'>
        {title}
      </p>
      {user && showTanyakanButton && (
        <div className='flex justify-center'>
          <TanyakanSekarangButton user={user} defaultSubject={defaultSubject} />
        </div>
      )}
    </div>
  );
}
