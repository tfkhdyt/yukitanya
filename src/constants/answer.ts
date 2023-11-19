export type Answer = {
  content: string;
  date: Date;
  id: string;
  isBestAnswer: boolean;
  numberOfVotes: number;
  questionId: string;
  rating: number;
  user: {
    avatar: {
      fallback: string;
      imageUrl: string;
    };
    fullName: string;
    username: string;
  };
};

export const answers: Answer[] = [
  {
    content: 'Maaf gak tau hehe',
    date: new Date('2023-11-08T18:27:45'),
    id: 'answer-123',
    isBestAnswer: true,
    numberOfVotes: 10,
    questionId: 'question-123',
    rating: 4.5,
    user: {
      avatar: {
        fallback: 'RA',
        imageUrl: 'https://github.com/Rabiatul9.png',
      },
      fullName: 'Rabiatul Adawiyah',
      username: 'Rabiatul9',
    },
  },
  {
    content: 'B. sejajar dengan warga lainnya',
    date: new Date('2023-11-08T19:18:00'),
    id: 'answer-124',
    isBestAnswer: false,
    numberOfVotes: 2,
    questionId: 'question-123',
    rating: 2.0,
    user: {
      avatar: {
        fallback: 'MIR',
        imageUrl: 'https://github.com/ihsanrzi.png',
      },
      fullName: 'Muhammad Ihsan Rizaldi',
      username: 'ihsanrzi',
    },
  },
];
