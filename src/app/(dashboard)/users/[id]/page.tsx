import dayjs from 'dayjs';
import { MessageCircleIcon } from 'lucide-react';
import Image from 'next/image';

import { AnswerPost } from '@/components/answer/answer-post';
import { AnswerModal } from '@/components/modals/answer-modal';
import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { answers } from '@/constants/answer';
import { questions } from '@/constants/question';
import { getServerAuthSession } from '@/server/auth';

export default async function UserPage() {
  const session = await getServerAuthSession();
  const filteredQuestion = questions.filter(
    (question) => question.user.username === 'tfkhdyt',
  );

  return (
    <main className=''>
      <div className='m-8 mb-8 flex space-x-8 text-[#696984]'>
        <Avatar className='h-36 w-36'>
          <AvatarImage src='https://github.com/tfkhdyt.png' />
          <AvatarFallback>TH</AvatarFallback>
        </Avatar>
        <div className='space-y-2'>
          <div className='flex flex-wrap space-x-2 text-lg'>
            <p className='font-semibold'>Taufik Hidayat</p>
            <p>·</p>
            <p className='font-light'>@tfkhdyt</p>
          </div>
          <ol className='flex space-x-8'>
            <li>
              <span className='font-semibold'>6</span> pertanyaan
            </li>
            <li>
              <span className='font-semibold'>9</span> jawaban
            </li>
            <li>
              <span className='font-semibold'>42</span> favorit
            </li>
          </ol>
          <p>
            Bergabung sejak{' '}
            <span title='2020-04-01'>{dayjs('2023-09-01').fromNow()}</span>
          </p>
        </div>
      </div>
      <div className='w-full'>
        <Tabs className='w-full' defaultValue='Pertanyaan'>
          <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0'>
            {['Pertanyaan', 'Jawaban', 'Favorit'].map((each) => (
              <TabsTrigger
                className='relative h-9 w-full rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none'
                key={each}
                value={each}
              >
                {each}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent className='-mt-0.5' value='Pertanyaan'>
            {filteredQuestion.length > 0 ? (
              filteredQuestion.map((question) => (
                <QuestionPost
                  key={question.id}
                  question={{
                    content: question.content,
                    createdAt: question.date,
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
              <PertanyaanKosong
                title='Kamu belum membuat pertanyaan'
                user={session?.user}
              />
            )}
          </TabsContent>
          <TabsContent className='-mt-0.5' value='Jawaban'>
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
                  question={filteredQuestion[0]!}
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
                  Taufik Hidayat yang ganteng menunggu jawabanmu
                </p>
                <AnswerModal
                  question={{
                    content: filteredQuestion[0]!.content,
                    createdAt: filteredQuestion[0]!.date,
                    id: filteredQuestion[0]!.id,
                    subject: filteredQuestion[0]!.subject,
                  }}
                  user={filteredQuestion[0]!.user}
                >
                  <Button className='mx-auto mt-4 flex items-center space-x-2 rounded-full font-semibold'>
                    <MessageCircleIcon size={16} />
                    <p>Tambahkan Jawabanmu!</p>
                  </Button>
                </AnswerModal>
              </div>
            )}
          </TabsContent>
          <TabsContent className='-mt-0.5' value='Favorit'>
            {filteredQuestion.length > 0 ? (
              filteredQuestion.map((question) => (
                <QuestionPost
                  key={question.id}
                  question={{
                    content: question.content,
                    createdAt: question.date,
                    id: question.id,
                    isFavorited: true,
                    numberOfAnswers: question.numberOfAnswers,
                    numberOfFavorites: question.numberOfFavorites,
                    rating: question.rating,
                    subject: question.subject,
                  }}
                  user={question.user}
                />
              ))
            ) : (
              <PertanyaanKosong
                title='Kamu belum membuat pertanyaan'
                user={session?.user}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
