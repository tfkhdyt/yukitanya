import { PertanyaanKosong } from '@/app/_components/pertanyaan-kosong';
import { mapel } from '@/constants/mapel';
import { questions } from '@/constants/question';
import { getServerAuthSession } from '@/server/auth';

import { QuestionPost } from '../../home/question/question-post';

export function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  const mapel_ = mapel.find((mpl) => mpl.id === id);

  return {
    title: `${mapel_?.name ?? '404'} - Yukitanya`,
  };
}

export default async function SubjectDetail({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();
  const filteredPost = questions.filter(
    (question) => question.subject.id === params.id,
  );

  return (
    <main>
      {filteredPost.length > 0 ? (
        filteredPost.map((question) => (
          <QuestionPost
            key={question.id}
            question={{
              content: question.content,
              createdAt: question.date,
              id: question.id,
              numberOfAnswers: question.numberOfAnswers,
              numberOfFavorites: question.numberOfFavorites,
              rating: question.rating,
              subject: question.subject,
            }}
            user={question.user}
          />
        ))
      ) : (
        <PertanyaanKosong user={session?.user} />
      )}
    </main>
  );
}
