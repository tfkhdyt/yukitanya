'use client';

import { useDebounce } from '@uidotdev/usehooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mapel } from '@/constants/mapel';
import { questions } from '@/constants/question';
import { type User } from '@/server/auth';

export function SearchForm({ user }: { user: User | undefined }) {
  const searchParameters = useSearchParams();
  const router = useRouter();

  const q = searchParameters.get('q');
  const s = searchParameters.get('s');

  const [query, setQuery] = useState(q ?? '');
  const [subject, setSubject] = useState(s ?? 'all');

  const debouncedQuery = useDebounce(query, 500);
  const debouncedSubject = useDebounce(subject, 500);

  const filteredPost = questions
    .filter((question) => {
      return subject === 'all' ? true : question.subject.id === subject;
    })
    .filter((question) => {
      const searchKeywords = debouncedQuery.toLowerCase().split(' ');

      return searchKeywords.every((word) =>
        question.content.toLowerCase().includes(word),
      );
    });

  useEffect(() => {
    router.push(`/search?q=${debouncedQuery}&s=${debouncedSubject}`);
  }, [debouncedQuery, debouncedSubject, router]);

  return (
    <>
      <form className='flex w-full items-center space-x-1 p-4'>
        <Input
          className='rounded-l-full'
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Cari...'
          type='text'
          value={query}
        />
        <Select onValueChange={setSubject} value={subject}>
          <SelectTrigger className='w-44 rounded-r-full'>
            <SelectValue placeholder='Mata Pelajaran' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua</SelectItem>
            {mapel.map((mpl) => (
              <SelectItem key={mpl.id} value={mpl.id}>
                {mpl.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
      <div>
        {debouncedQuery && filteredPost.length > 0
          ? filteredPost.map((question) => (
              <QuestionPost
                highlightedWords={debouncedQuery.toLowerCase().split(' ')}
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
          : debouncedQuery && (
              <PertanyaanKosong
                title='Pertanyaan yang kamu cari tidak ditemukan'
                user={user}
              />
            )}
      </div>
    </>
  );
}
