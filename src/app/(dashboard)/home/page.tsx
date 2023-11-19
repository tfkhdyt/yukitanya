import { questions } from '@/constants/question';
import { PencilIcon } from 'lucide-react';
import { type Metadata } from 'next';
import Image from 'next/image';

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
            avatar={{
              fallback: 'TH',
              imageUrl: 'https://github.com/tfkhdyt.png',
            }}
            fullName='Taufik Hidayat'
            username='tfkhdyt'
          >
            <Button className='flex items-center space-x-2 rounded-full font-semibold'>
              <PencilIcon size={16} />
              <p>Tanyakan Sekarang!</p>
            </Button>
          </QuestionModal>
        </div>
        <div className='w-1/3'>
          <Image
            alt='Mari bertanya'
            className='mx-auto'
            height={129}
            src='/img/home/mari-bertanya.png'
            width={168}
          />
        </div>
      </div>
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionPost
            key={question.id}
            question={{
              content: question.content,
              date: question.date,
              id: question.id,
              numberOfAnswers: question.numberOfAnswers,
              numberOfFavorites: question.numberOfFavorites,
              rating: question.rating,
              subject: question.subject,
            }}
            user={question.user}
          />
        ))
      ) : (
        <div className='p-6'>
          <Image
            alt='Pertanyaan Kosong'
            className='mx-auto'
            height={178}
            src='/img/questions/jawaban-kosong.png'
            width={213}
          />
          <p className='text-center text-sm font-medium text-gray-500'>
            Belum ada pertanyaan yang tersedia
          </p>
          <QuestionModal
            avatar={{
              fallback: 'TH',
              imageUrl: 'https://github.com/tfkhdyt.png',
            }}
            fullName='Taufik Hidayat'
            username='tfkhdyt'
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
