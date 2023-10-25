import Image from 'next/image';

type TKeunggulan = {
  image: {
    url: string;
    alt: string;
  };
  text: string;
};

export function Keunggulan() {
  const keunggulan: TKeunggulan[] = [
    {
      image: {
        url: '/img/fitur/unik.svg',
        alt: 'Fitur unik',
      },
      text: 'Memiliki fitur yang berbeda dari web lainnya karena dapat memfasilitasi para siswa SD untuk saling berdiskusi mengenai mata pelajaran SD.',
    },
    {
      image: {
        url: '/img/fitur/menarik.svg',
        alt: 'Tampilan menarik',
      },
      text: 'Tampilan platform menarik dan sederhana. Sehingga memudahkan pengguna untuk mencari fitur yang ada pada platform.',
    },
    {
      image: {
        url: '/img/fitur/verifikasi.svg',
        alt: 'Verifikasi Jawaban',
      },
      text: 'Memiliki fitur verifikasi jawaban untuk menilai keakuratan dari jawaban tersebut sehingga memperkuat tingkat kebenarannya.',
    },
  ];

  return (
    <section className='bg-[url(/img/fitur/bg.svg)] bg-cover py-32'>
      <div className='container mx-auto space-y-12 font-poppins'>
        <p className='text-center text-2xl font-bold text-[#F48C06]'>
          <span className='text-[#77425A]'>Keunggulan</span> Platform Kami
        </p>
        <p className='mx-auto max-w-4xl text-lg leading-loose text-[#696984]'>
          Yukitanya adalah salah satu platform tanya jawab online yang
          menggabungkan semua alat yang diperlukan untuk menunjang tugas
          sekolah.
        </p>
        <div className='grid grid-cols-3 gap-16 pb-96 pt-52'>
          {keunggulan.map((each) => (
            <div
              className='relative flex items-center rounded-2xl bg-white px-12 py-24 shadow-lg'
              key={each.text}
            >
              <Image
                src={each.image.url}
                width={146}
                height={179}
                alt={each.image.alt}
                className='absolute inset-x-0 -top-32 mx-auto'
              />
              <p className='text-center font-medium leading-loose text-[#77425A]'>
                {each.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
