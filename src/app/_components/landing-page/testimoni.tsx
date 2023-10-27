import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Star,
  StarHalf,
} from 'lucide-react';
import Image from 'next/image';

export function Testimoni() {
  return (
    <section className='bg-[url(/img/testimoni/bg.svg)] bg-cover pb-[25rem] pt-64'>
      <div className='container font-poppins md:px-12'>
        <div className='mx-auto w-fit space-y-16 rounded-3xl bg-white px-4 py-8 shadow-lg md:p-16'>
          <h2 className='text-center text-2xl tracking-widest'>Testimoni</h2>
          <div className='flex items-center space-x-2 md:space-x-8'>
            <button className='md:mr-16' title='Previous'>
              <ArrowLeftCircle color='#696984' size={32} />
            </button>
            <div className='relative rounded-3xl border-2 border-[#77425A] md:border-[3px]'>
              <Image
                src='/img/testimoni/yulianti.png'
                alt='Testimoni Yulianti'
                width={138}
                height={139}
                className='absolute -left-10 -top-10 w-20 md:-left-16 md:-top-16 md:w-32'
              />
              <div className='flex flex-col items-center justify-between gap-2 p-4 md:ml-20 md:flex-row'>
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
