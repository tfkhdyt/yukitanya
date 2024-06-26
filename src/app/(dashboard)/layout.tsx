import 'react-photo-view/dist/react-photo-view.css';

import type { ReactNode } from 'react';

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
      <aside className='sticky top-0 hidden h-screen border-r-2 md:inline md:w-1/3 lg:w-1/4 overflow-y-auto'>
        <LeftSidebar session={session ?? undefined} />
      </aside>
      <MainContent session={session ?? undefined}>{children}</MainContent>
      <aside className='sticky top-0 hidden h-screen w-1/4 border-l-2 p-6 lg:inline overflow-y-auto'>
        <RightSidebar />
      </aside>
    </section>
  );
}
