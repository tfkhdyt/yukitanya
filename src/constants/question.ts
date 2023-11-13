import { mapel } from './mapel';

export type Question = {
  user: {
    avatar: {
      imageUrl: string;
      fallback: string;
    };
    fullName: string;
    username: string;
  };
  id: string;
  date: Date;
  content: string;
  subject: {
    id: string;
    name: string;
  };
  rating: number;
  numberOfAnswers: number;
  numberOfFavorites: number;
};

export const questions: Question[] = [
  {
    user: {
      avatar: {
        imageUrl: 'https://github.com/tfkhdyt.png',
        fallback: 'TH',
      },
      fullName: 'Taufik Hidayat yang ganteng',
      username: 'tfkhdyt',
    },
    id: 'question-123',
    content:
      'Pada masa Daulah Abbasiyah, kedudukan kaum muslim di Bagdad berada .... a. lebih tinggi daripada warga lainnya b. sejajar dengan warga lainnya c. lebih rendah daripada warga lainnya d. sebagai warga yang istimewa',
    date: new Date('2023-11-02T21:43:20'),
    numberOfAnswers: 2,
    numberOfFavorites: 5,
    subject: mapel.find((mpl) => mpl.id === 'other')!,
    rating: 4.5,
  },
];
