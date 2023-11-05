import { PencilIcon } from 'lucide-react';
import { type Metadata } from 'next';
import Image from 'next/image';

import { Button } from '../../_components/ui/button';
import { Post } from './post/post';

export const metadata: Metadata = {
  title: 'Home - Yukitanya',
};

export default function Home() {
  return (
    <>
      <div className='flex border-b-2 p-6 lg:hidden'>
        <div className='w-2/3 space-y-6'>
          <h2 className='text-xl font-extrabold'>
            AYO BERTANYA, JANGAN MALU-MALU YA...!
          </h2>
          <Button className='flex items-center space-x-2 rounded-full font-extrabold'>
            <p>Tanyakan Sekarang!</p>
            <PencilIcon size={16} />
          </Button>
        </div>
        <div className='w-1/3'>
          <Image
            src='/img/home/mari-bertanya.png'
            alt='Mari bertanya'
            width={168}
            height={129}
            className='mx-auto'
          />
        </div>
      </div>
      <Post
        user={{
          avatar: {
            imageUrl: 'https://github.com/tfkhdyt.png',
            fallback: 'TH',
          },
          fullName: 'Taufik Hidayat',
          username: 'tfkhdyt',
        }}
        post={{
          id: 'question-123',
          content:
            'Pada masa Daulah Abbasiyah, kedudukan kaum muslim di Bagdad berada .... a. lebih tinggi daripada warga lainnya b. sejajar dengan warga lainnya c. lebih rendah daripada warga lainnya d. sebagai warga yang istimewa',
          date: new Date('2023-11-02T21:43:20'),
          numberOfAnswers: 2,
          numberOfFavorites: 5,
          subject: {
            id: 'pai',
            title: 'Pendidikan Agama Islam',
          },
          rating: 4.5,
        }}
      />
    </>
  );
}
