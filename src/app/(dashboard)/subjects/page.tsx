import { mapel } from '@/constants/mapel';
import clsx from 'clsx';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mata Pelajaran - Yukitanya',
};

export default function SubjectsPage() {
  return (
    <main className='grid grid-cols-2'>
      {mapel.map((mpl, idx) => (
        <Link
          className={clsx(
            `border-b-2 p-6 transition hover:bg-slate-50`,
            (idx + 1) % 2 !== 0 && 'border-r-2',
          )}
          href={`/subjects/${mpl.id}`}
          key={mpl.id}
        >
          <Image
            alt={mpl.name}
            className='mx-auto'
            height={100}
            src={mpl.imageUrl}
            width={100}
          />
          <p className='text-center text-sm font-medium text-[#696984]'>
            {mpl.name}
          </p>
        </Link>
      ))}
    </main>
  );
}
