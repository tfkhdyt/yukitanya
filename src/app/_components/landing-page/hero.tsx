'use client';

import Image from 'next/image';
import { Element } from 'react-scroll';

export function Hero() {
  return (
    <Element
      name='home'
      className='h-auto bg-[url(/img/hero_bg.svg)] bg-cover bg-no-repeat'
    >
      <div className='container mx-auto flex items-center px-4 pb-96 pt-32 font-poppins'>
        <div className='w-1/2 space-y-5'>
          <p className='text-lg text-[#696984]'>
            Ayo ajukan pertanyaanmu disini!
          </p>
          <p className='text-5xl font-extrabold text-[#F48C06] drop-shadow-2xl'>
            Jangan Malu
          </p>
          <p className='text-5xl font-extrabold text-[#77425A] drop-shadow-2xl'>
            Untuk Bertanya!
          </p>
          <div className='flex w-fit items-center rounded-full bg-white font-light shadow-md'>
            <input
              className='rounded-full px-8 py-1 text-xl text-[#77425A] placeholder:text-[#939090] focus:outline-none'
              type='text'
              placeholder='Mulai bertanya...!'
            />
            <button className='m-2 rounded-full border-2 border-black bg-[#EADBC8] p-2'>
              <Image
                src='/img/search.svg'
                alt='Search Button'
                width={24}
                height={25}
              />
            </button>
          </div>
        </div>
        <div className='w-1/2'>
          <Image
            src='/img/hero_img.svg'
            alt='Yukitanay hero logo'
            width={445}
            height={398}
            className='ml-auto w-3/4'
          />
        </div>
      </div>
    </Element>
  );
}
