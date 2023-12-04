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
			<aside className='sticky top-0 hidden h-screen border-r-2 md:inline md:w-1/3 lg:w-1/4'>
				<LeftSidebar session={session} />
			</aside>
			<MainContent user={session?.user}>{children}</MainContent>
			<aside className='sticky top-0 hidden min-h-[100svh] w-1/4 border-l-2 p-6 lg:inline'>
				<RightSidebar session={session} />
			</aside>
		</section>
	);
}
