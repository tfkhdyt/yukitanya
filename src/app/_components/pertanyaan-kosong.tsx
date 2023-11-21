import { type User } from '@/server/auth';
import Image from 'next/image';

import { TanyakanSekarangBtn } from './buttons/tanyakan-sekarang';

export function PertanyaanKosong({
  title = 'Belum ada pertanyaan yang tersedia',
  user,
}: {
  title?: string;
  user: User | undefined;
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
      <TanyakanSekarangBtn center user={user} />
    </div>
  );
}
