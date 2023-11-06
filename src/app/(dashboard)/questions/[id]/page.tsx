import { DetailedPost } from './detailed-post';

export default function Question() {
  return (
    <div>
      <DetailedPost
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
    </div>
  );
}
