import Image from 'next/image';

export function TentangKami() {
  return (
    <section className='bg-[url(/img/tentang_kami_bg.svg)] bg-cover pt-10'>
      <div className='container space-y-12 md:px-16'>
        <p className='text-center text-2xl font-bold text-[#77425A]'>
          <span className='text-[#F48C06]'>Apa itu</span> Yukitanya?
        </p>
        <p className='mx-auto max-w-4xl text-center leading-loose text-[#696984] lg:text-lg lg:leading-loose'>
          Yukitanya adalah sebuah website yang menghubungkan banyak siswa ke
          dalam sebuah forum diskusi untuk menyelesaikan tugas sekolah secara
          bersama. Website ini memungkinkan seorang siswa untuk menanyakan
          sebuah pertanyaan, kemudian siswa lain dapat membantu dengan menjawab
          pertanyaan tersebut. Apabila siswa telah puas dengan jawabannya, maka
          para siswa dapat memberi rating kepada pertanyaan tersebut.
        </p>
      </div>
      <Image
        alt='wave'
        className='mt-24 h-auto w-full'
        height={200}
        src='/img/tentang_kami_wave.svg'
        width={1920}
      />
    </section>
  );
}
