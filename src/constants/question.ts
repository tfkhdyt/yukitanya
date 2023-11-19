import { mapel } from './mapel';

export type Question = {
  content: string;
  date: Date;
  id: string;
  numberOfAnswers: number;
  numberOfFavorites: number;
  rating: number;
  subject: {
    id: string;
    name: string;
  };
  user: {
    avatar: {
      fallback: string;
      imageUrl: string;
    };
    fullName: string;
    username: string;
  };
};

export const questions: Question[] = [
  {
    content:
      'Pada masa Daulah Abbasiyah, kedudukan kaum muslim di Bagdad berada .... a. lebih tinggi daripada warga lainnya b. sejajar dengan warga lainnya c. lebih rendah daripada warga lainnya d. sebagai warga yang istimewa',
    date: new Date('2023-11-02T21:43:20'),
    id: 'question-123',
    numberOfAnswers: 2,
    numberOfFavorites: 5,
    rating: 4.5,
    subject: mapel.find((mpl) => mpl.id === 'other')!,
    user: {
      avatar: {
        fallback: 'TH',
        imageUrl: 'https://github.com/tfkhdyt.png',
      },
      fullName: 'Taufik Hidayat yang ganteng',
      username: 'tfkhdyt',
    },
  },
];
