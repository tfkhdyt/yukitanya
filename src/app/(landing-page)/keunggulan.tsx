'use client';

import Image from 'next/image';

type TKeunggulan = {
  image: {
    alt: string;
    url: string;
  };
  text: string;
};

export function Keunggulan() {
  const keunggulan: TKeunggulan[] = [
    {
      image: {
        alt: 'Fitur unik',
        url: '/img/fitur/unik.png',
      },
      text: 'Memiliki fitur yang berbeda dari web lainnya karena dapat memfasilitasi para siswa SD untuk saling berdiskusi mengenai mata pelajaran SD.',
    },
    {
      image: {
        alt: 'Tampilan menarik',
        url: '/img/fitur/menarik.png',
      },
      text: 'Tampilan platform menarik dan sederhana. Sehingga memudahkan pengguna untuk mencari fitur yang ada pada platform.',
    },
    {
      image: {
        alt: 'Verifikasi Jawaban',
        url: '/img/fitur/verifikasi.png',
      },
      text: 'Memiliki fitur verifikasi jawaban untuk menilai keakuratan dari jawaban tersebut sehingga memperkuat tingkat kebenarannya.',
    },
  ];

  return (
    <section
      className='-mt-1 scroll-mt-20 bg-[url(/img/fitur/bg.svg)] bg-cover py-12 lg:mt-0'
      id='keunggulan'
    >
      <div className='container space-y-12 md:px-16'>
        <p className='text-center text-2xl font-bold text-[#F48C06]'>
          <span className='text-[#77425A]'>Keunggulan</span> Platform Kami
        </p>
        <p className='mx-auto max-w-4xl text-center leading-loose text-[#696984] md:text-lg md:leading-loose'>
          Yukitanya adalah salah satu platform tanya jawab online yang
          menggabungkan semua alat yang diperlukan untuk menunjang tugas
          sekolah.
        </p>
        <div className='grid grid-cols-1 gap-48 pb-96 pt-40 md:grid-cols-3 md:gap-16'>
          {keunggulan.map((each) => (
            <div
              className='relative flex rounded-2xl bg-white px-6 py-20 shadow-lg lg:px-12 lg:py-24'
              key={each.text}
            >
              <Image
                alt={each.image.alt}
                className='absolute inset-x-0 -top-32 mx-auto'
                height={179}
                src={each.image.url}
                width={146}
              />
              <p className='text-center text-sm font-medium leading-loose text-[#77425A] lg:text-base'>
                {each.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
