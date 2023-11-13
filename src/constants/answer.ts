export type Answer = {
  user: {
    avatar: {
      imageUrl: string;
      fallback: string;
    };
    fullName: string;
    username: string;
  };
  id: string;
  content: string;
  date: Date;
  numberOfVotes: number;
  rating: number;
  isBestAnswer: boolean;
};

export const answers: Answer[] = [
  {
    user: {
      avatar: {
        imageUrl: 'https://github.com/Rabiatul9.png',
        fallback: 'RA',
      },
      fullName: 'Rabiatul Adawiyah',
      username: 'Rabiatul9',
    },
    id: 'answer-123',
    content: 'Maaf gak tau hehe',
    date: new Date('2023-11-08T18:27:45'),
    numberOfVotes: 10,
    rating: 4.5,
    isBestAnswer: true,
  },
  {
    user: {
      avatar: {
        imageUrl: 'https://github.com/ihsanrzi.png',
        fallback: 'MIR',
      },
      fullName: 'Muhammad Ihsan Rizaldi',
      username: 'ihsanrzi',
    },
    id: 'answer-124',
    content: 'B. sejajar dengan warga lainnya',
    date: new Date('2023-11-08T19:18:00'),
    numberOfVotes: 2,
    rating: 2.0,
    isBestAnswer: false,
  },
];
