import clsx from 'clsx';
import { PencilIcon } from 'lucide-react';

import { QuestionModal } from '@/components/modals/question-modal';
import { type User } from '@/server/auth';

import { Button } from '../ui/button';

export function TanyakanSekarangButton({
  center = false,
  user,
}: {
  center?: boolean;
  user: User;
}) {
  return (
    <QuestionModal user={user}>
      <Button
        className={clsx(
          'flex items-center space-x-2 rounded-full font-semibold',
          center && 'mx-auto',
        )}
      >
        <PencilIcon size={16} />
        <p>Tanyakan Sekarang!</p>
      </Button>
    </QuestionModal>
  );
}
