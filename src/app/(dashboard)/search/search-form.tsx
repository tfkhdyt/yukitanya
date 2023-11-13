'use client';

import { Input } from '@/app/_components/ui/input';
import { questions } from '@/constants/question';
import { useDebounce } from '@uidotdev/usehooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QuestionPost } from '../home/question/question-post';

export function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q');
  const [query, setQuery] = useState(q ?? '');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    router.push(`/search?q=${debouncedQuery}`);
  }, [debouncedQuery, router]);

  return (
    <>
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
        {debouncedQuery &&
          questions
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
    </>
  );
}
