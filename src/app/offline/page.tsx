import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline - Yukitanya',
};

export default function Page() {
  return (
    <div className='grid h-screen place-content-center bg-white px-4'>
      <div className='text-center'>
        <Image
          src='/img/offline.svg'
          height={256}
          width={341}
          alt='Offline'
          className='mx-auto'
        />

        <h1 className='mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Ooops! Anda sedang offline.
        </h1>

        <p className='my-4 text-gray-500 max-w-xl'>
          Maaf, nampaknya Anda sedang tidak terhubung ke internet. Harap mencoba
          lagi setelah berhasil terhubung kembali ke jaringan.
        </p>
        <Link href='/home'>
          <Button variant='outline' className='rounded-full'>
            <RefreshCwIcon size={20} className='mr-2' />
            Refresh
          </Button>
        </Link>
      </div>
    </div>
  );
}
