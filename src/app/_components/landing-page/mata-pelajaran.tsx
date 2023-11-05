'use client';

import Image from 'next/image';

type Mapel = {
  name: string;
  imageUrl: string;
};

export function MataPelajaran() {
  const mapel: Mapel[] = [
    {
      name: 'Ilmu Pengetahuan Alam',
      imageUrl: '/img/mapel/ipa.png',
    },
    {
      name: 'PPKn',
      imageUrl: '/img/mapel/ppkn.png',
    },
    {
      name: 'Matematika',
      imageUrl: '/img/mapel/matematika.png',
    },
    {
      name: 'B. Indonesia',
      imageUrl: '/img/mapel/indo.png',
    },
    {
      name: 'B. Inggris',
      imageUrl: '/img/mapel/ing.png',
    },
    {
      name: 'Ilmu Pengetahuan Sosial',
      imageUrl: '/img/mapel/ips.png',
    },
  ];

  return (
    <section
      id='tentang-kami'
      className='scroll-mt-20 bg-[url(/img/mapel/bg.svg)] bg-cover py-12 lg:pb-24'
    >
      <div className='container space-y-16 font-poppins text-[#696984] md:px-12'>
        <p className='text-center text-2xl font-bold text-[#77425A]'>
          Yuk tanya{' '}
          <span className='text-[#F48C06]'>pelajaran favoritmu disini!</span>
        </p>
        <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
          {mapel.map((each) => (
            <div className='flex flex-col items-center' key={each.name}>
              <Image
                src={each.imageUrl}
                alt={each.name}
                width={110}
                height={105}
              />
              <p className='text-center text-sm font-medium'>{each.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
