import { type Metadata } from 'next';

import { NotificationItem } from './notification-item';

export const metadata: Metadata = {
  title: 'Notifikasi - Yukitanya',
};

export default function NotifPage() {
  return (
    <main>
      <NotificationItem
        description='Lorem ipsum'
        hasBeenRead={false}
        questionId='question-123'
        timestamp={new Date('2023-11-15T19:37:00')}
        type='favorite'
        user={{
          avatar: {
            fallback: 'TH',
            imageUrl: 'https://github.com/tfkhdyt.png',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
      />
      <NotificationItem
        answerId='answer-123'
        description='dolor sit amet'
        hasBeenRead={false}
        questionId='question-123'
        rating={4.5}
        timestamp={new Date('2023-11-15T19:37:00')}
        type='rating'
        user={{
          avatar: {
            fallback: 'TH',
            imageUrl: 'https://github.com/tfkhdyt.png',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
      />
      <NotificationItem
        answerId='answer-123'
        description='Gak tau'
        hasBeenRead={true}
        questionId='question-123'
        timestamp={new Date('2023-11-15T19:37:00')}
        type='new-answer'
        user={{
          avatar: {
            fallback: 'TH',
            imageUrl: 'https://github.com/tfkhdyt.png',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
      />
      <NotificationItem
        answerId='answer-123'
        description='Hmm apa yaa???'
        hasBeenRead={true}
        questionId='question-123'
        timestamp={new Date('2023-11-15T19:37:00')}
        type='best-answer'
        user={{
          avatar: {
            fallback: 'TH',
            imageUrl: 'https://github.com/tfkhdyt.png',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
      />
    </main>
  );
}
