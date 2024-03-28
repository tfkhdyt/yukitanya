import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { SkeletonUserEntry } from './skeleton-user-entry';
import { UserEntry } from './user-entry';

export function UserList({ query }: { query: string }) {
  const { isLoading, data, isError, error, fetchNextPage, isFetchingNextPage } =
    api.user.findUsersByUsernameOrName.useInfiniteQuery(
      {
        query,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const [reference, entry] = useIntersectionObserver({ threshold: 0 });

  useEffect(() => {
    if (entry?.isIntersecting) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const users = data?.pages.flatMap((page) => page.data);

  if (isLoading) {
    return <SkeletonUserEntry />;
  }

  if (isError) {
    return (
      <PertanyaanKosong title={error?.message} showTanyakanButton={false} />
    );
  }

  if (users?.length === 0 || !users) {
    return (
      <PertanyaanKosong
        title='Pengguna yang kamu cari tidak ditemukan'
        showTanyakanButton={false}
      />
    );
  }

  return (
    <>
      {users.map((user, index) => {
        return (
          <div
            ref={index === users.length - 1 ? reference : undefined}
            key={user.id}
          >
            <UserEntry
              user={{
                ...user,
                initial: createInitial(user.name),
              }}
            />
          </div>
        );
      })}
      {isFetchingNextPage && <SkeletonUserEntry />}
    </>
  );
}
