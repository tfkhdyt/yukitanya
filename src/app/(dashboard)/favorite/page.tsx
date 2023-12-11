import { type Metadata } from 'next';

import { getServerAuthSession } from '@/server/auth';

import { FavoriteQuestionList } from './favorite-question-list';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Favorit - Yukitanya',
};

export default async function Favorit() {
	const session = await getServerAuthSession();
	if (!session?.user.membership) {
		return redirect('/home');
	}

	return (
		<>
			<FavoriteQuestionList session={session} />
		</>
	);
}
