'use client';

import { useDebounce } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { match } from 'ts-pattern';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mapel } from '@/constants/mapel';

import { QuestionList } from './question-list';
import { UserList } from './user-list';

export function SearchForm({ session }: { session: Session | null }) {
  const searchParameters = useSearchParams();
  const router = useRouter();

  const q = searchParameters.get('query');
  const s = searchParameters.get('subject');
  const t = searchParameters.get('type');

  const [query, setQuery] = useState(q ?? '');
  const [subject, setSubject] = useState(s ?? 'all');
  const [searchType, setSearchType] = useState(t ?? 'question');

  const debouncedQuery = useDebounce(query, 500);
  const debouncedSubject = useDebounce(subject, 500);
  const debouncedType = useDebounce(searchType, 500);

  useEffect(() => {
    if (debouncedType === 'question') {
      router.push(
        `/search?type=${debouncedType}&subject=${debouncedSubject}&query=${debouncedQuery}`,
      );
    } else if (debouncedType === 'user') {
      router.push(`/search?type=${debouncedType}&query=${debouncedQuery}`);
    }
  }, [debouncedQuery, debouncedSubject, debouncedType, router]);

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
        <Select onValueChange={setSearchType} value={searchType}>
          <SelectTrigger
            className={clsx(
              'max-w-2/4 w-max',
              searchType === 'user' ? 'rounded-r-full' : 'rounded-none',
            )}
          >
            <SelectValue placeholder='Jenis' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='question'>Pertanyaan</SelectItem>
            <SelectItem value='user'>Pengguna</SelectItem>
          </SelectContent>
        </Select>
        {searchType === 'question' && (
          <Select onValueChange={setSubject} value={subject}>
            <SelectTrigger className='max-w-2/4 w-fit rounded-r-full'>
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
        )}
      </form>
      <div>
        {match(Boolean(debouncedQuery))
          .with(true, () =>
            match(debouncedType)
              .with('question', () => (
                <QuestionList
                  query={debouncedQuery}
                  subjectId={debouncedSubject}
                  session={session}
                />
              ))
              .with('user', () => <UserList query={debouncedQuery} />)
              .otherwise(() => ''),
          )
          .otherwise(() => '')}
      </div>
    </>
  );
}
