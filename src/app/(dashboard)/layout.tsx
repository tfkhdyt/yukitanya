import { getServerAuthSession } from '@/server/auth';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { type ReactNode } from 'react';

import { Button } from '../_components/ui/button';
import { QuestionModal } from './home/question/question-modal';
import { Sidebar } from './home/sidebar/sidebar';
import { MainContent } from './main-content';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();
  console.log({ session });

  return (
    <section className='flex lg:container'>
      <aside className='sticky top-0 hidden h-screen border-r-2 md:inline md:w-1/3 lg:w-1/4'>
        <Sidebar user={session?.user} />
      </aside>
      <MainContent user={session?.user}>{children}</MainContent>
      <aside className='sticky top-0 hidden h-screen w-1/4 space-y-4 border-l-2 p-6 text-2xl font-extrabold text-[#F48C06] lg:inline'>
        <h2 className='text-xl font-extrabold'>JANGAN MALU UNTUK BERTANYA!</h2>
        <Image
          alt='Mari bertanya'
          height={129}
          src='/img/home/mari-bertanya.png'
          width={168}
        />
        <QuestionModal
          avatar={{
            fallback: session?.user.initial ?? '',
            imageUrl: session?.user.image ?? '',
          }}
          fullName={session?.user.name ?? ''}
          username={session?.user.username ?? ''}
        >
          <Button className='flex items-center space-x-2 rounded-full font-semibold'>
            <PencilIcon size={16} />
            <p>Tanyakan Sekarang!</p>
          </Button>
        </QuestionModal>
      </aside>
    </section>
  );
}
