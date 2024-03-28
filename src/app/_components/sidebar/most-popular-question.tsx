'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import ReactShowMoreText from 'react-show-more-text';

import { formatLongDateTime } from '@/lib/datetime';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

import { AvatarWithBadge } from '../avatar-with-badge';
import { badgeVariants } from '../ui/badge';
import { SkeletonMostPopularQuestionSection } from './skeleton-most-popular-question';

export function MostPopularQuestionSection({
  subject,
  setSheetOpen,
}: {
  subject?: {
    id?: string;
    name?: string;
  };
  setSheetOpen?: () => void;
}) {
  const { data, isLoading } = api.question.findMostPopularQuestion.useQuery(
    subject?.id,
  );

  if (isLoading) {
    return <SkeletonMostPopularQuestionSection subject={subject} />;
  }

  if (data && data.popularity > 0) {
    return (
      <div className='space-y-4'>
        <h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
          PERTANYAAN {subject?.name} TERPOPULER MINGGU INI
        </h2>

        <div>
          <div className='flex items-center space-x-2'>
            <Link
              href={`/users/${data.owner.username}`}
              aria-label={data.owner.username}
              onClick={setSheetOpen}
            >
              <AvatarWithBadge
                user={{
                  ...data.owner,
                  membership: data.owner.membership,
                  initial: createInitial(data.owner.name ?? undefined),
                }}
              />
            </Link>
            <div className='text-[#696984]'>
              <Link
                className='max-w-[10rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem] block text-base'
                href={`/users/${data.owner.username}`}
                onClick={setSheetOpen}
                title={data.owner.name ?? data.owner.username}
              >
                {data.owner.name}
              </Link>
              <Link
                className='max-w-[10rem] truncate font-normal md:max-w-[12rem] block text-base'
                href={`/users/${data.owner.username}`}
                onClick={setSheetOpen}
                title={`@${data.owner.username}`}
              >
                @{data.owner.username}
              </Link>
            </div>
          </div>
          <Link
            href={`/questions/${data.question.slug}`}
            onClick={setSheetOpen}
          >
            <ReactShowMoreText
              more='Tampilkan lebih banyak'
              less='Tampilkan lebih sedikit'
              anchorClass='text-sm font-medium text-[#696984] hover:underline -ml-1 cursor-pointer'
              className='whitespace-pre-wrap pt-2 text-sm leading-relaxed text-[#696984] font-normal'
              truncatedEndingComponent='...  '
            >
              {data.question.content}
            </ReactShowMoreText>
          </Link>
          {data.images.length > 0 && (
            <PhotoProvider>
              <div
                className={clsx(
                  'grid gap-2 w-5/6 pt-2',
                  data.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
                )}
              >
                {data.images.map((img, idx) => (
                  <PhotoView key={img.id} src={img.url}>
                    <Image
                      src={img.url}
                      alt={img.id}
                      key={img.id}
                      height={360}
                      width={360}
                      className={clsx(
                        'object-cover',
                        idx + 1 === 3 && data.images.length === 3
                          ? 'col-span-2 aspect-[2.7/1]'
                          : 'aspect-[4/3]',
                      )}
                    />
                  </PhotoView>
                ))}
              </div>
            </PhotoProvider>
          )}
          <div className='flex items-center gap-2 pt-4 flex-wrap-reverse justify-between'>
            <div className='text-sm font-medium text-[#696984] flex flex-wrap gap-1'>
              {formatLongDateTime(data.question.createdAt)}
              {data.question.createdAt.getTime() !==
                data.question.updatedAt.getTime() && (
                <span
                  className='hover:underline'
                  title={`Diedit pada ${formatLongDateTime(
                    data.question.updatedAt,
                  )}`}
                >
                  *
                </span>
              )}
              <p>·</p>
              <p className='font-semibold'>{data.numberOfFavorites} favorit</p>
              <p>·</p>
              <p className='font-semibold'>{data.numberOfAnswers} jawaban</p>
            </div>
            <Link
              href={`/subjects/${data.subject.id}`}
              onClick={setSheetOpen}
              className={clsx(
                badgeVariants({ variant: 'secondary' }),
                'hover:bg-gray-200',
              )}
            >
              {data.subject.name}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
