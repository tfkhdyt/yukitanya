'use client';

import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { mapel } from '@/constants/mapel';
import { questions } from '@/constants/question';
import { useDebounce } from '@uidotdev/usehooks';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { QuestionModal } from '../home/question/question-modal';
import { QuestionPost } from '../home/question/question-post';

export function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q');
  const s = searchParams.get('s');

  const [query, setQuery] = useState(q ?? '');
  const [subject, setSubject] = useState(s ?? 'all');

  const debouncedQuery = useDebounce(query, 500);
  const debouncedSubject = useDebounce(subject, 500);

  const filteredPost = questions
    .filter((question) => {
      if (subject === 'all') {
        return true;
      } else {
        return question.subject.id === subject;
      }
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
          onChange={(e) => setQuery(e.target.value)}
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
          : debouncedQuery && (
              <div className='p-6'>
                <Image
                  alt='Pertanyaan Kosong'
                  className='mx-auto'
                  height={178}
                  src='/img/questions/jawaban-kosong.png'
                  width={213}
                />
                <p className='text-center text-sm font-medium text-gray-500'>
                  Pertanyaan yang kamu cari tidak ditemukan
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
      </div>
    </>
  );
}
