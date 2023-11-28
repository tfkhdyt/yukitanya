'use client';

import { useRouter } from 'next/navigation';
import { type Session } from 'next-auth';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AnswerTabContent } from './answer-tab-content';
import { FavoriteTabContent } from './favorite-tab-content';
import { QuestionTabContent } from './question-tab-content';

export function UserTabs({
  session,
  user,
  activeTab,
}: {
  session: Session | null;
  user: {
    id: string;
    name: string;
    username: string;
  };
  activeTab: string;
}) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.replace(`/users/${user.username}?tab=${value}`);
  };

  return (
    <Tabs
      className='w-full'
      defaultValue='Pertanyaan'
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0'>
        {['Pertanyaan', 'Jawaban', 'Favorit'].map((each) => (
          <TabsTrigger
            className='relative h-9 w-full rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none'
            key={each}
            value={each}
          >
            {each}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent className='-mt-0.5' value='Pertanyaan'>
        <QuestionTabContent
          session={session}
          user={{
            id: user.id,
            name: user.name ?? user.username,
          }}
        />
      </TabsContent>
      <TabsContent className='-mt-0.5' value='Jawaban'>
        <AnswerTabContent
          session={session}
          user={{
            id: user.id,
            name: user.name ?? user.username,
          }}
        />
      </TabsContent>
      <TabsContent className='-mt-0.5' value='Favorit'>
        <FavoriteTabContent
          session={session}
          user={{
            id: user.id,
            name: user.name ?? user.username,
          }}
        />
      </TabsContent>
    </Tabs>
  );
}
