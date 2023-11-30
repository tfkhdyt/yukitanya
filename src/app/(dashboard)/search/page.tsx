import { type Metadata } from 'next';

import { getServerAuthSession } from '@/server/auth';

import { SearchForm } from './search-form';

export const metadata: Metadata = {
	title: 'Cari - Yukitanya',
};

export default async function SearchPage() {
	const session = await getServerAuthSession();

	return (
		<main>
			<SearchForm session={session} />
		</main>
	);
}
