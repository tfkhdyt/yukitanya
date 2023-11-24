import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { match,P } from 'ts-pattern';

import { Button } from '@/app/_components/ui/button';
import { answers } from '@/constants/answer';
import { questions } from '@/constants/question';

import { AnswerModal } from './answer/answer-modal';
import { AnswerPost } from './answer/answer-post';
import { DetailedQuestion } from './detailed-question';

export function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  const question = questions.find((question) => question.id === id);

  return {
    title: `${match(question?.content.length)
      .with(P.number.gte(25), () => question?.content.slice(0, 25) + '...')
      .otherwise(() => question?.content)} - Yukitanya`,
  };
}

export default function Question({ params }: { params: { id: string } }) {
  const question = questions.find((qst) => qst.id === params.id)!;

  return (
    <div>
      <DetailedQuestion
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
      <div>
        {answers.length > 0 ? (
          answers.map((answer) => (
            <AnswerPost
              answer={{
                content: answer.content,
                date: answer.date,
                id: answer.id,
                isBestAnswer: answer.isBestAnswer,
                numberOfVotes: answer.numberOfVotes,
                rating: answer.rating,
              }}
              key={answer.id}
              question={question}
              user={answer.user}
            />
          ))
        ) : (
          <div className='p-6'>
            <Image
              alt='Jawaban Kosong'
              className='mx-auto'
              height={178}
              src='/img/questions/jawaban-kosong.png'
              width={213}
            />
            <p className='text-center text-sm font-medium text-gray-500'>
              Taufik Hidayat yang ganteng menunggu bantuan jawabanmu
            </p>
            <AnswerModal
              question={{
                content: question.content,
                createdAt: question.date,
                id: question.id,
                subject: question.subject,
              }}
              user={question.user}
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
