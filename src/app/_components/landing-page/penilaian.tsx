import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Star,
  StarHalf,
} from 'lucide-react';
import Image from 'next/image';

export function Penilaian() {
  return (
    <section className='bg-[url(/img/testimoni/bg.svg)] bg-cover pb-[25rem] pt-64'>
      <div className='container mx-auto font-poppins'>
        <div className='mx-auto w-fit space-y-16 rounded-3xl bg-white p-16 shadow-lg'>
          <h2 className='text-center text-2xl tracking-widest'>Penilaian</h2>
          <div className='flex items-center space-x-8'>
            <button className='mr-16' title='Previous'>
              <ArrowLeftCircle color='#696984' size={32} />
            </button>
            <div className='relative rounded-3xl border-[3px] border-[#77425A]'>
              <Image
                src='/img/testimoni/yulianti.svg'
                alt='Testimoni Yulianti'
                width={138}
                height={139}
                className='absolute -left-16 -top-16'
              />
              <div className='ml-20 flex items-center justify-between p-4'>
                <p className='text-[#696984]'>Yulianti</p>
                <span className='flex'>
                  <Star color='#F48C06' fill='#F48C06' />
                  <Star color='#F48C06' fill='#F48C06' />
                  <Star color='#F48C06' fill='#F48C06' />
                  <Star color='#F48C06' fill='#F48C06' />
                  <StarHalf color='#F48C06' fill='#F48C06' />
                </span>
              </div>
              <div className='border-t-2 border-[#CFCFDE] p-8 text-[#696984]'>
                <p className='max-w-lg'>
                  Saya suka banget aplikasinya, anak saya jadi betah belajar di
                  aplikasi ini.. terimakasih yukitanya.
                </p>
              </div>
            </div>
            <button>
              <ArrowRightCircle color='#696984' size={32} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
