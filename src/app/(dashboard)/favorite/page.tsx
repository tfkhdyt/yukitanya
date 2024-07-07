import type { Metadata } from 'next';

import { getServerAuthSession } from '@/server/auth';

import { redirect } from 'next/navigation';
import { FavoriteQuestionList } from './favorite-question-list';

export const metadata: Metadata = {
  title: 'Favorit - Yukitanya',
};

export default async function Favorit() {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect('/home');
  }

  return (
    <>
      <FavoriteQuestionList session={session} />
    </>
  );
}
