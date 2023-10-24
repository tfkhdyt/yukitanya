import clsx from 'clsx';
import Image from 'next/image';

type TFitur = {
  image: {
    url: string;
    alt: string;
  };
  title: string[];
  description: string;
};

export function Fitur() {
  const fitur: TFitur[] = [
    {
      image: {
        url: '/img/fitur/tts.svg',
        alt: 'Text to speech',
      },
      title: ['Speech', 'to text'],
      description:
        'Suatu fitur pelengkap yang memberikan kemudahan dalam melakukan diskusi untuk merubah suara dalam bentuk tulisan.',
    },
    {
      image: {
        url: '/img/fitur/chatroom.svg',
        alt: 'Chat room',
      },
      title: ["Course's", 'chat room'],
      description:
        'Fitur ini memudahkan siswa dalam berdiskusi sesuai dengan mata pelajaran yang sedang mereka tempuh dalam jenjang pendidikan sekolah dasar.',
    },
    {
      image: {
        url: '/img/fitur/forum_tanya_jawab.svg',
        alt: 'Forum Tanya Jawab',
      },
      title: ['Forum', 'tanya jawab'],
      description:
        'Fitur ini memungkinkan siswa untuk mengajukan pertanyaan menggunakan teks atau gambar. Kemudian, siswa lain dapat memberikan jawaban atas pertanyaan tersebut. Selain itu, siswa lain juga dapat memberikan penilaian untuk setiap jawaban.',
    },
    {
      image: {
        url: '/img/fitur/music.svg',
        alt: 'Background music instrumental',
      },
      title: ['Background music', 'instrumental'],
      description:
        'Fitur ini bertujuan untuk merefleksikan atau memberikan suasana yang pas terhadap mood siswa layaknya seperti video game, biasanya ketika adegan semangat maka akan memberikan sound yang semangat juga. Sehingga siswa terbawa suasananya menjadi semangat, tenang dan fokus dalam belajar. Fitur ini juga bisa di nonaktifkan jika siswa tidak mau mengaktifkannya.',
    },
    {
      image: {
        url: '/img/fitur/private_chat.svg',
        alt: 'Private chat',
      },
      title: ['Private chat', 'antar siswa'],
      description:
        'Fitur ini dapat di akses siswa ketika hendak berdiskusi lebih dalam dengan siswa lainnya yang membantu memberi jawaban di fitur tanya jawab maupun fitur course’s room chat secara private.',
    },
  ];

  return (
    <section className='bg-[url(/img/fitur/bg_2.svg)] bg-cover bg-center py-48'>
      <div className='container mx-auto space-y-12 font-poppins'>
        <p className='text-center text-2xl font-bold text-[#F48C06]'>
          <span className='text-[#77425A]'>Fitur</span> Kami
        </p>
        <p className='text-center text-[#696984]'>
          Fitur yang sangat luar biasa ini, dapat membuat kegiatan belajar
          menjadi lebih efisien
        </p>
        {fitur.map((each, idx) => (
          <div
            className={clsx(
              'flex items-center gap-8 pt-24',
              idx % 2 === 1 && 'flex-row-reverse',
            )}
            key={each.title[0]}
          >
            <div className='w-1/2'>
              <Image
                src={each.image.url}
                alt={each.image.alt}
                width={434}
                height={405}
                className='mx-auto w-3/4'
              />
            </div>
            <div className='w-1/2 space-y-8 p-32'>
              <p
                className={clsx(
                  'text-center text-2xl font-extrabold text-[#77425A]',
                  idx % 2 === 0 ? 'text-[#77425A]' : 'text-[#F48C06]',
                )}
              >
                <span
                  className={clsx(
                    idx % 2 === 0 ? 'text-[#F48C06]' : 'text-[#77425A]',
                  )}
                >
                  {each.title[0]}
                </span>{' '}
                {each.title[1]}
              </p>
              <p className='text-center leading-loose text-[#696984]'>
                {each.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
