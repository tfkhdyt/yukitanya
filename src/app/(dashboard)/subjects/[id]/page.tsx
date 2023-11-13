import { mapel } from '@/constants/mapel';
import { questions } from '@/constants/question';
import { QuestionPost } from '../../home/question/question-post';

export function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  const mapel_ = mapel.find((mpl) => mpl.id === id);

  return {
    title: `${mapel_?.name ?? '404'} - Yukitanya`,
  };
}

export default function SubjectDetail({ params }: { params: { id: string } }) {
  return (
    <main>
      {questions
        .filter((question) => question.subject.id === params.id)
        .map((question) => (
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
            }}
          />
        ))}
    </main>
  );
}
