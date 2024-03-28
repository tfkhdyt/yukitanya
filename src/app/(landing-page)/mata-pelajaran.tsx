'use client';

import Image from 'next/image';

import { mapel } from '@/constants/mapel';

export function MataPelajaran() {
  return (
    <section
      className='scroll-mt-20 bg-[url(/img/mapel/bg.svg)] bg-cover py-12 lg:pb-24'
      id='tentang-kami'
    >
      <div className='container space-y-16 text-[#696984] md:px-12'>
        <p className='text-center text-2xl font-bold text-[#77425A]'>
          Yuk tanya{' '}
          <span className='text-[#F48C06]'>pelajaran favoritmu disini!</span>
        </p>
        <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-7'>
          {mapel.map((each) => (
            <div className='flex flex-col items-center' key={each.name}>
              <Image
                alt={each.name}
                height={105}
                src={each.imageUrl}
                width={110}
              />
              <p className='text-center text-sm font-medium'>{each.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
