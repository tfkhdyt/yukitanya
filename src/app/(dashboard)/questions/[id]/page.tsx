import { Button } from '@/app/_components/ui/button';
import { answers } from '@/constants/answer';
import { questions } from '@/constants/question';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { AnswerModal } from './answer/answer-modal';
import { AnswerPost } from './answer/answer-post';
import { DetailedQuestion } from './detailed-question';

export default function Question({ params }: { params: { id: string } }) {
  const question = questions.find((qst) => qst.id === params.id)!;

  return (
    <div>
      <DetailedQuestion
        user={question.user}
        post={{
          id: question.id,
          content: question.content,
          date: question.date,
          numberOfAnswers: question.numberOfAnswers,
          numberOfFavorites: question.numberOfFavorites,
          subject: question.subject,
          rating: question.rating,
        }}
      />
      <div>
        {answers.length > 0 ? (
          answers.map((answer) => (
            <AnswerPost
              user={answer.user}
              post={{
                id: answer.id,
                content: answer.content,
                date: answer.date,
                isBestAnswer: answer.isBestAnswer,
                rating: answer.rating,
                numberOfVotes: answer.numberOfVotes,
              }}
              key={answer.id}
            />
          ))
        ) : (
          <div className='p-6'>
            <Image
              src='/img/questions/jawaban-kosong.png'
              alt='Jawaban Kosong'
              height={178}
              width={213}
              className='mx-auto'
            />
            <p className='text-center text-sm font-medium text-gray-500'>
              Taufik Hidayat yang ganteng menunggu bantuan jawabanmu
            </p>
            <AnswerModal
              user={question.user}
              post={{
                id: question.id,
                content: question.content,
                date: question.date,
                numberOfAnswers: question.numberOfAnswers,
                numberOfFavorites: question.numberOfFavorites,
                subject: question.subject,
                rating: question.rating,
              }}
            >
              <Button className='mx-auto mt-4 flex items-center space-x-2 rounded-full font-semibold'>
                <MessageCircle size={16} />
                <p>Tambahkan Jawabanmu!</p>
              </Button>
            </AnswerModal>
          </div>
        )}
      </div>
    </div>
  );
}
