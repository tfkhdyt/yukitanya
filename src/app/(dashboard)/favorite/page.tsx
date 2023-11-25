import { type Metadata } from 'next';

import { QuestionPost } from '@/components/question/question-post';
import { questions } from '@/constants/question';

export const metadata: Metadata = {
  title: 'Favorit - Yukitanya',
};

export default function FavoritePage() {
  return (
    <main>
      {questions.map((question) => (
        <QuestionPost
          key={question.id}
          question={{
            content: question.content,
            createdAt: question.date,
            id: question.id,
            isFavorited: true,
            numberOfAnswers: question.numberOfAnswers,
            numberOfFavorites: question.numberOfFavorites,
            rating: question.rating,
            subject: question.subject,
          }}
          user={question.user}
        />
      ))}
    </main>
  );
}
