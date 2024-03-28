'use client';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

import { useIntersectionObserver } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { NotificationItem } from './notification-item';
import { SkeletonNotificationItem } from './skeleton-notification-item';

export function NotificationList({
  receiverUserId,
}: {
  receiverUserId: string;
}) {
  const { isLoading, fetchNextPage, data, isFetchingNextPage } =
    api.notification.findAllNotificationByReceiverUserId.useInfiniteQuery(
      {
        receiverUserId,
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

  const notifications = data?.pages.flatMap((page) => page.data);

  if (isLoading) {
    return <SkeletonNotificationItem />;
  }

  if (notifications?.length === 0 || !notifications) {
    return (
      <PertanyaanKosong
        title='Notifikasi masih kosong'
        showTanyakanButton={false}
      />
    );
  }

  return (
    <>
      {notifications.map((notif, index) => {
        const membership = notif.transmitterUser.memberships.find(
          (membership) => dayjs().isBefore(membership.expiresAt),
        );

        return (
          <div
            key={notif.id}
            ref={index === notifications.length - 1 ? reference : undefined}
          >
            <NotificationItem
              id={notif.id}
              createdAt={notif.createdAt}
              hasBeenRead={Boolean(notif.readAt)}
              question={notif.question}
              transmitterUser={{
                ...notif.transmitterUser,
                membership,
                initial: createInitial(notif.transmitterUser.name ?? undefined),
              }}
              type={notif.type}
              rating={notif.rating ?? undefined}
              description={notif.description}
            />
          </div>
        );
      })}
      {isFetchingNextPage && <SkeletonNotificationItem />}
    </>
  );
}
