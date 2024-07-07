'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { match } from 'ts-pattern';

type TFitur = {
  description: string;
  image: {
    alt: string;
    url: string;
  };
  title: string[];
  isComingSoon: boolean;
};

export function Fitur() {
  const fitur: TFitur[] = [
    {
      description:
        'Fitur ini memungkinkan siswa untuk mengajukan pertanyaan menggunakan teks atau gambar. Kemudian, siswa lain dapat memberikan jawaban atas pertanyaan tersebut. Selain itu, siswa lain juga dapat memberikan penilaian untuk setiap jawaban.',
      image: {
        alt: 'Forum Tanya Jawab',
        url: '/img/fitur/qna.png',
      },
      title: ['Forum', 'tanya jawab'],
      isComingSoon: false,
    },
    {
      description:
        'Fitur ini memungkinkan pengguna untuk mendapatkan jawaban instan dari kecerdasan buatan terkait tugas sekolah mereka dengan mengajukan pertanyaan secara langsung.',
      image: {
        alt: 'Tanyakan pada AI',
        url: '/img/fitur/ai.svg',
      },
      title: ['Tanyakan pada', 'AI'],
      isComingSoon: false,
    },
    {
      description:
        'Fitur ini memungkinkan pengguna untuk mendapatkan poin dari jawaban mereka dan bersaing dalam peringkat bulanan untuk meraih penghargaan dan pengakuan.',
      image: {
        alt: 'Mendaki puncak Leaderboard',
        url: '/img/fitur/leaderboard.svg',
      },
      title: ['Mendaki Puncak', 'Leaderboard'],
      isComingSoon: false,
    },
  ];

  return (
    <section
      className='scroll-mt-20 bg-[url(/img/fitur/bg_2.svg)] bg-cover pb-32 pt-12'
      id='fitur'
    >
      <div className='container space-y-6 md:px-12'>
        <div className='text-center text-2xl font-bold text-[#F48C06]'>
          <span className='text-[#77425A]'>Fitur</span> Kami
        </div>
        <p className='text-center leading-loose text-[#696984]'>
          Fitur yang sangat luar biasa ini, dapat membuat kegiatan belajar
          menjadi lebih efisien
        </p>
        {fitur.map((each, index) => (
          <section
            className={clsx(
              'flex scroll-mt-20 flex-col items-center gap-8 pt-12 md:flex-row',
              index % 2 === 1 && 'md:flex-row-reverse',
            )}
            id={each.image.alt.replaceAll(' ', '-').toLowerCase()}
            key={each.title[0]}
          >
            <div className='md:w-1/2'>
              <Image
                alt={each.image.alt}
                className='mx-auto w-3/4'
                height={405}
                src={each.image.url}
                width={434}
              />
            </div>
            <div className='space-y-8 md:w-1/2 md:p-6 lg:p-32'>
              {match(index % 2)
                .with(0, () => (
                  <div className='text-center text-2xl font-extrabold text-[#77425A]'>
                    <span className='text-[#F48C06]'>{each.title[0]}</span>{' '}
                    {each.title[1]}
                    {each.isComingSoon && (
                      <span className='text-xs'> (Coming soon)</span>
                    )}
                  </div>
                ))
                .otherwise(() => (
                  <div className='text-center text-2xl font-extrabold text-[#F48C06]'>
                    <span className='text-[#77425A]'>{each.title[0]}</span>{' '}
                    {each.title[1]}
                    {each.isComingSoon && (
                      <span className='text-xs'> (Coming soon)</span>
                    )}
                  </div>
                ))}

              <p className='text-center leading-loose text-[#696984]'>
                {each.description}
              </p>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
