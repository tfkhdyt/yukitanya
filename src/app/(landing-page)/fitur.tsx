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
        url: '/img/fitur/forum_tanya_jawab.png',
      },
      title: ['Forum', 'tanya jawab'],
      isComingSoon: false,
    },
    {
      description:
        'Suatu fitur pelengkap yang memberikan kemudahan dalam melakukan diskusi untuk merubah suara dalam bentuk tulisan.',
      image: {
        alt: 'Speech to text',
        url: '/img/fitur/tts.png',
      },
      title: ['Speech', 'to text'],
      isComingSoon: true,
    },
    {
      description:
        'Fitur ini memudahkan siswa dalam berdiskusi sesuai dengan mata pelajaran yang sedang mereka tempuh dalam jenjang pendidikan sekolah dasar.',
      image: {
        alt: 'Chat room',
        url: '/img/fitur/chatroom.png',
      },
      title: ["Course's", 'chat room'],
      isComingSoon: true,
    },
    {
      description:
        'Fitur ini dapat di akses siswa ketika hendak berdiskusi lebih dalam dengan siswa lainnya yang membantu memberi jawaban di fitur tanya jawab maupun fitur course’s room chat secara private.',
      image: {
        alt: 'Private chat',
        url: '/img/fitur/private_chat.png',
      },
      title: ['Private chat', 'antar siswa'],
      isComingSoon: true,
    },
    {
      description:
        'Fitur ini bertujuan untuk merefleksikan atau memberikan suasana yang pas terhadap mood siswa layaknya seperti video game, biasanya ketika adegan semangat maka akan memberikan sound yang semangat juga. Sehingga siswa terbawa suasananya menjadi semangat, tenang dan fokus dalam belajar. Fitur ini juga bisa di nonaktifkan jika siswa tidak mau mengaktifkannya.',
      image: {
        alt: 'Background music instrumental',
        url: '/img/fitur/music.png',
      },
      title: ['Background music', 'instrumental'],
      isComingSoon: true,
    },
  ];

  return (
    <section
      className='scroll-mt-20 bg-[url(/img/fitur/bg_2.svg)] bg-cover pb-32 pt-12'
      id='fitur'
    >
      <div className='container space-y-12 md:px-12'>
        <p className='text-center text-2xl font-bold text-[#F48C06]'>
          <span className='text-[#77425A]'>Fitur</span> Kami
        </p>
        <p className='text-center leading-loose text-[#696984]'>
          Fitur yang sangat luar biasa ini, dapat membuat kegiatan belajar
          menjadi lebih efisien
        </p>
        {fitur.map((each, index) => (
          <section
            className={clsx(
              'flex scroll-mt-20 flex-col items-center gap-8 pt-12 md:flex-row lg:pt-20',
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
                  <p className='text-center text-2xl font-extrabold text-[#77425A]'>
                    <span className='text-[#F48C06]'>{each.title[0]}</span>{' '}
                    {each.title[1]}
                    {each.isComingSoon && (
                      <span className='text-xs'> (Coming soon)</span>
                    )}
                  </p>
                ))
                .otherwise(() => (
                  <p className='text-center text-2xl font-extrabold text-[#F48C06]'>
                    <span className='text-[#77425A]'>{each.title[0]}</span>{' '}
                    {each.title[1]}
                    {each.isComingSoon && (
                      <span className='text-xs'> (Coming soon)</span>
                    )}
                  </p>
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
