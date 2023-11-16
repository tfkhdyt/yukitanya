import { type Metadata } from 'next';
import { QuestionPost } from '../home/question/question-post';
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
          user={question.user}
          post={{
            id: question.id,
            content: question.content,
            date: question.date,
            numberOfAnswers: question.numberOfAnswers,
            numberOfFavorites: question.numberOfFavorites,
            subject: question.subject,
            rating: question.rating,
            isFavorited: true,
          }}
        />
      ))}
    </main>
  );
}
