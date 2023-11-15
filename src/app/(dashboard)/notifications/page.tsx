import { type Metadata } from 'next';
import { NotificationItem } from './notification-item';

export const metadata: Metadata = {
  title: 'Notifikasi - Yukitanya',
};

export default function NotifPage() {
  return (
    <main>
      <NotificationItem
        type='favorite'
        hasBeenRead={false}
        timestamp={new Date('2023-11-15T19:37:00')}
        user={{
          avatar: {
            imageUrl: 'https://github.com/tfkhdyt.png',
            fallback: 'TH',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
        questionId='question-123'
      />
      <NotificationItem
        type='rating'
        hasBeenRead={false}
        timestamp={new Date('2023-11-15T19:37:00')}
        user={{
          avatar: {
            imageUrl: 'https://github.com/tfkhdyt.png',
            fallback: 'TH',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
        questionId='question-123'
        answerId='answer-123'
        rating={4.5}
      />
      <NotificationItem
        type='new-answer'
        hasBeenRead={true}
        timestamp={new Date('2023-11-15T19:37:00')}
        user={{
          avatar: {
            imageUrl: 'https://github.com/tfkhdyt.png',
            fallback: 'TH',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
        questionId='question-123'
        answerId='answer-123'
        answer='Gak tau'
      />
      <NotificationItem
        type='best-answer'
        hasBeenRead={true}
        timestamp={new Date('2023-11-15T19:37:00')}
        user={{
          avatar: {
            imageUrl: 'https://github.com/tfkhdyt.png',
            fallback: 'TH',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
        questionId='question-123'
        answerId='answer-123'
        answer='Hmm apa yaa???'
      />
    </main>
  );
}
