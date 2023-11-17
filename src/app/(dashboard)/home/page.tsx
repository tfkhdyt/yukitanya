import { PencilIcon } from 'lucide-react';
import { type Metadata } from 'next';
import Image from 'next/image';

import { questions } from '@/constants/question';
import { Button } from '../../_components/ui/button';
import { QuestionModal } from './question/question-modal';
import { QuestionPost } from './question/question-post';

export const metadata: Metadata = {
  title: 'Beranda - Yukitanya',
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
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionPost
            key={question.id}
            user={question.user}
            question={{
              id: question.id,
              content: question.content,
              date: question.date,
              numberOfAnswers: question.numberOfAnswers,
              numberOfFavorites: question.numberOfFavorites,
              subject: question.subject,
              rating: question.rating,
            }}
          />
        ))
      ) : (
        <div className='p-6'>
          <Image
            src='/img/questions/jawaban-kosong.png'
            alt='Pertanyaan Kosong'
            height={178}
            width={213}
            className='mx-auto'
          />
          <p className='text-center text-sm font-medium text-gray-500'>
            Belum ada pertanyaan yang tersedia
          </p>
          <QuestionModal
            fullName='Taufik Hidayat'
            username='tfkhdyt'
            avatar={{
              imageUrl: 'https://github.com/tfkhdyt.png',
              fallback: 'TH',
            }}
          >
            <Button className='mx-auto mt-4 flex items-center space-x-2 rounded-full font-semibold'>
              <PencilIcon size={16} />
              <p>Tanyakan Sekarang!</p>
            </Button>
          </QuestionModal>
        </div>
      )}
    </>
  );
}
