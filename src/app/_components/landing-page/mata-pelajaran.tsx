'use client';

import Image from 'next/image';
import { Element } from 'react-scroll';

type Mapel = {
  name: string;
  imageUrl: string;
};

export function MataPelajaran() {
  const mapel: Mapel[] = [
    {
      name: 'Ilmu Pengetahuan Sosial',
      imageUrl: '/img/mapel/ips.svg',
    },
    {
      name: 'Penjaskes',
      imageUrl: '/img/mapel/penjas.svg',
    },
    {
      name: 'Sejarah',
      imageUrl: '/img/mapel/sejarah.svg',
    },
    {
      name: 'Matematika',
      imageUrl: '/img/mapel/matematika.svg',
    },
    {
      name: 'B. Indonesia',
      imageUrl: '/img/mapel/indo.svg',
    },
    {
      name: 'B. Inggris',
      imageUrl: '/img/mapel/ing.svg',
    },
    {
      name: 'Ilmu Pengetahuan Alam',
      imageUrl: '/img/mapel/ipa.svg',
    },
  ];

  return (
    <Element
      name='tentang-kami'
      className='bg-[url(/img/mapel/bg.svg)] bg-cover py-12 lg:pb-24'
    >
      <div className='container space-y-16 px-12 font-poppins text-[#696984] lg:px-0'>
        <p className='text-center text-2xl font-bold text-[#77425A]'>
          Yuk tanya{' '}
          <span className='text-[#F48C06]'>pelajaran favoritmu disini!</span>
        </p>
        <div className='grid grid-cols-3 gap-4 lg:grid-cols-7'>
          {mapel.map((each) => (
            <div className='flex flex-col items-center' key={each.name}>
              <Image
                src={each.imageUrl}
                alt={each.name}
                width={110}
                height={105}
              />
              <p className='text-sm font-medium'>{each.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Element>
  );
}
