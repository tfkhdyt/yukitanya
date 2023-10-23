import Image from 'next/image';

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
    <section className='container mx-auto my-8 space-y-16 bg-[url(/img/mapel/bg.svg)] bg-cover bg-no-repeat font-poppins text-[#696984]'>
      <p className='text-center text-lg'>
        Yuk tanya pelajaran favoritmu disini!
      </p>
      <div className='grid lg:grid-cols-7'>
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
    </section>
  );
}
