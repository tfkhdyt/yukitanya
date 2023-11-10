import { PencilIcon } from 'lucide-react';
import { type Metadata } from 'next';
import Image from 'next/image';

import { Button } from '../../_components/ui/button';
import { QuestionModal } from './question/question-modal';
import { QuestionPost } from './question/question-post';

export const metadata: Metadata = {
  title: 'Home - Yukitanya',
};

export default function Home() {
  return (
    <>
      <div className='flex border-b-2 p-6 md:items-center lg:hidden'>
        <div className='w-2/3 space-y-4 pr-2'>
          <h2 className='text-xl font-extrabold'>
            JANGAN MALU UNTUK BERTANYA!
          </h2>
          <QuestionModal
            fullName='Taufik Hidayat'
            username='tfkhdyt'
            avatar={{
              imageUrl: 'https://github.com/tfkhdyt.png',
              fallback: 'TH',
            }}
          >
            <Button className='flex items-center space-x-2 rounded-full font-semibold'>
              <PencilIcon size={16} />
              <p>Tanyakan Sekarang!</p>
            </Button>
          </QuestionModal>
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
      <QuestionPost
        user={{
          avatar: {
            imageUrl: 'https://github.com/tfkhdyt.png',
            fallback: 'TH',
          },
          fullName: 'Taufik Hidayat yang ganteng',
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
            title: 'PAI',
          },
          rating: 4.5,
        }}
      />
    </>
  );
}
