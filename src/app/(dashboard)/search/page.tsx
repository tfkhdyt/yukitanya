'use client';

import { Input } from '@/app/_components/ui/input';
import { useDebounce } from '@uidotdev/usehooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QuestionPost } from '../home/question/question-post';

export default function SearchPage() {
  const questions = [
    {
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
      user: {
        avatar: {
          imageUrl: 'https://github.com/tfkhdyt.png',
          fallback: 'TH',
        },
        fullName: 'Taufik Hidayat yang ganteng',
        username: 'tfkhdyt',
      },
    },
  ];

  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(q);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    router.push(`/search?q=${debouncedQuery}`);
  }, [debouncedQuery, router]);

  return (
    <main>
      <form className='flex w-full items-center p-4'>
        <Input
          type='text'
          placeholder='Cari...'
          className='rounded-full'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div>
        {questions
          .filter((question) => {
            const searchKeywords = debouncedQuery.toLowerCase().split(' ');

            return searchKeywords.every((word) =>
              question.content.toLowerCase().includes(word),
            );
          })
          .map((question) => (
            <QuestionPost
              key={question.id}
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
              highlightedWords={debouncedQuery.toLowerCase().split(' ')}
            />
          ))}
      </div>
    </main>
  );
}
