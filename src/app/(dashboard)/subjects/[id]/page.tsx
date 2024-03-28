import { redirect } from 'next/navigation';

import { mapel } from '@/constants/mapel';
import { getServerAuthSession } from '@/server/auth';

import { QuestionList } from './question-list';

export function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
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
  if (!mapel.some((mpl) => mpl.id === params.id)) {
    return redirect('/subjects');
  }

  return (
    <main>
      <QuestionList subjectId={params.id} session={session ?? undefined} />
    </main>
  );
}
