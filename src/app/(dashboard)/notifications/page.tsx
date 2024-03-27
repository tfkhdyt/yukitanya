import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';

import { NotificationList } from './notification-list';

export const metadata: Metadata = {
	title: 'Notifikasi - Yukitanya',
};

export default async function NotifPage() {
	const session = await getServerAuthSession();
	if (!session) return redirect('/home');

	return (
		<main>
			{session?.user && <NotificationList receiverUserId={session.user.id} />}
		</main>
	);
}
