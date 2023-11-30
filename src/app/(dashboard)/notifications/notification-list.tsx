'use client';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

import { NotificationItem } from './notification-item';
import { SkeletonNotificationItem } from './skeleton-notification-item';

export function NotificationList({
  receiverUserId,
}: {
  receiverUserId: string;
}) {
  const notifications =
    api.notification.findAllNotificationByReceiverUserId.useQuery(
      receiverUserId,
    );

  if (notifications.isLoading) {
    return <SkeletonNotificationItem />;
  }

  if (notifications.data?.length === 0 || !notifications.data) {
    return (
      <PertanyaanKosong
        title='Notifikasi masih kosong'
        showTanyakanButton={false}
      />
    );
  }

  return (
    <>
      {notifications.data.map((notif) => (
        <NotificationItem
          key={notif.id}
          id={notif.id}
          createdAt={notif.createdAt}
          hasBeenRead={Boolean(notif.readAt)}
          question={notif.question}
          transmitterUser={{
            ...notif.transmitterUser,
            initial: createInitial(notif.transmitterUser.name),
          }}
          type={notif.type}
          rating={notif.rating}
          description={notif.description}
        />
      ))}
    </>
  );
}
