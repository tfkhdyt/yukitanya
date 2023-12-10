import { type Metadata } from 'next';

import { getServerAuthSession } from '@/server/auth';

import { Timeline } from './timeline';

export const metadata: Metadata = {
	title: 'Beranda - Yukitanya',
};

export default async function Home() {
	const session = await getServerAuthSession();

	return (
		<>
			<Timeline session={session} />
		</>
	);
}
