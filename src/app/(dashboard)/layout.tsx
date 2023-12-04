import { type ReactNode } from 'react';

import { LeftSidebar } from '@/components/sidebar/left-sidebar';
import { RightSidebar } from '@/components/sidebar/right-sidebar';
import { getServerAuthSession } from '@/server/auth';

import { MainContent } from './main-content';

export default async function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getServerAuthSession();

	return (
		<section className='flex lg:container'>
			<LeftSidebar user={session?.user} />
			<MainContent user={session?.user}>{children}</MainContent>
			<RightSidebar session={session} />
		</section>
	);
}
