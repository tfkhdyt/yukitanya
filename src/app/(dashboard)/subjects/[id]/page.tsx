import { Button } from '@/app/_components/ui/button';
import { mapel } from '@/constants/mapel';
import { questions } from '@/constants/question';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { QuestionModal } from '../../home/question/question-modal';
import { QuestionPost } from '../../home/question/question-post';

export function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  const mapel_ = mapel.find((mpl) => mpl.id === id);

  return {
    title: `${mapel_?.name ?? '404'} - Yukitanya`,
  };
}

export default function SubjectDetail({ params }: { params: { id: string } }) {
  const filteredPost = questions.filter(
    (question) => question.subject.id === params.id,
  );

  return (
    <main>
      {filteredPost.length > 0 ? (
        filteredPost.map((question) => (
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
            defaultSubject={params.id}
          >
            <Button className='mx-auto mt-4 flex items-center space-x-2 rounded-full font-semibold'>
              <PencilIcon size={16} />
              <p>Tanyakan Sekarang!</p>
            </Button>
          </QuestionModal>
        </div>
      )}
    </main>
  );
}
