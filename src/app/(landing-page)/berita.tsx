import Image from 'next/image';

type TBerita = {
  description: string;
  imageUrl: string;
  title: string;
};

export function Berita() {
  const berita: TBerita[] = [
    {
      description:
        'Ayo minum susu ultra milk yang enak banget ini lochhhhh......',
      imageUrl: '/img/berita/ultra_milk.png',
      title:
        'Susu ultra milk adalah susu paling enak didunia, dan cocok dikonsumsi untuk anak maupun orang dewasa.',
    },
    {
      description:
        'Shopee memberikan promo besar-besaran dalam rangka birthday sale,....',
      imageUrl: '/img/berita/shopee.png',
      title:
        'Ayo berbelanja di shopee 12.12 sale karena ada banyak promo dan hadiah menarik!',
    },
    {
      description:
        'Tahun ini, investor telah memperoleh keuntungan finansial yang besar dari Zoom...',
      imageUrl: '/img/berita/zoom.png',
      title:
        'Mantan CEO Blackboard Mengumpulkan $16 Juta untuk Menghadirkan Fitur LMS ke Ruang Kelas Zoom',
    },
  ];

  return (
    <section className='container space-y-12 px-12 pb-24 lg:px-0 lg:py-32'>
      <h2 className='text-center text-2xl font-semibold text-[#77425A]'>
        Berita dan Sejumlah Iklan Terbaru
      </h2>
      <p className='text-center text-[#696984]'>
        Melihat perkembangan yang terjadi pada anak di indonesia
      </p>
      <div className='mx-auto flex flex-col gap-12 md:flex-row md:pt-16 lg:px-32'>
        <div className='space-y-6 md:w-1/2 md:space-y-10'>
          <Image
            alt='Anya'
            height={220}
            src='/img/berita/anya.jpg'
            width={375}
          />
          <div className='space-y-2 pb-6 md:space-y-4'>
            <div className='mb-4 w-fit rounded-full bg-[#F48C06] px-5 py-0.5 text-sm font-medium text-black'>
              BERITA
            </div>
            <a
              className='font-medium text-[#252641] underline'
              href='http://www.kompas.com/edu/read/2023/08/15/114844371/kisah-anya-siswa-kelas-6-sd-yang-raih-belasan-medali-olimpiade-matematika'
            >
              Kisah Anya, Siswa Kelas 6 SD yang Raih Belasan Medali Olimpiade...
            </a>
            <p className='text-sm text-[#696984]'>
              Anya memulai perjalanan pengembangan minatnya di bidang Matematika
              sejak kelas 3 SD......
            </p>
          </div>
          <a className='text-[#696984] underline' href='#'>
            Baca lebih banyak
          </a>
        </div>
        <div className='space-y-12 md:w-1/2 md:space-y-8'>
          {berita.map((each) => (
            <div
              className='flex flex-col items-start gap-6 md:flex-row'
              key={each.title}
            >
              <Image
                alt={each.title}
                className='w-full md:w-1/2'
                height={140}
                src={each.imageUrl}
                width={179}
              />
              <div className='space-y-2'>
                <h3 className='font-medium text-[#252641]'>{each.title}</h3>
                <p className='text-sm text-[#696984]'>{each.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
