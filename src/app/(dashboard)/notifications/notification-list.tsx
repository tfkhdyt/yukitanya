'use client';

import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

import { NotificationItem } from './notification-item';

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
    return 'Loading...';
  }

  if (notifications.isError) {
    return 'Error';
  }

  if (notifications.data.length === 0) {
    return 'Kosong';
  }

  console.log(notifications.data);

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
