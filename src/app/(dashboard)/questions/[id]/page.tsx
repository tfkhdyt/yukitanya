import { Answer } from './answer';
import { DetailedQuestion } from './detailed-question';

export default function Question() {
  return (
    <div>
      <DetailedQuestion
        user={{
          avatar: {
            imageUrl: 'https://github.com/tfkhdyt.png',
            fallback: 'TH',
          },
          fullName: 'Taufik Hidayat yang ganteng',
          username: 'tfkhdyt',
        }}
        post={{
          id: 'question-123',
          content:
            'Pada masa Daulah Abbasiyah, kedudukan kaum muslim di Bagdad berada .... a. lebih tinggi daripada warga lainnya b. sejajar dengan warga lainnya c. lebih rendah daripada warga lainnya d. sebagai warga yang istimewa',
          date: new Date('2023-11-02T21:43:20'),
          numberOfAnswers: 2,
          numberOfFavorites: 5,
          subject: {
            id: 'pai',
            title: 'PAI',
          },
          rating: 4.5,
        }}
      />
      <div>
        <Answer
          user={{
            avatar: {
              imageUrl: 'https://github.com/Rabiatul9.png',
              fallback: 'RA',
            },
            fullName: 'Rabiatul Adawiyah',
            username: 'Rabiatul9',
          }}
          post={{
            id: 'answer-123',
            content: 'Maaf gak tau hehe',
            date: new Date('2023-11-08T18:27:45'),
            numberOfVotes: 10,
            rating: 4.5,
            isBestAnswer: true,
          }}
        />
        <Answer
          user={{
            avatar: {
              imageUrl: 'https://github.com/ihsanrzi.png',
              fallback: 'MIR',
            },
            fullName: 'Muhammad Ihsan Rizaldi',
            username: 'ihsanrzi',
          }}
          post={{
            id: 'answer-124',
            content: 'B. sejajar dengan warga lainnya',
            date: new Date('2023-11-08T19:18:00'),
            numberOfVotes: 2,
            rating: 2.0,
            isBestAnswer: false,
          }}
        />
      </div>
    </div>
  );
}
