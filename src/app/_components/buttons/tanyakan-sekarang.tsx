import clsx from 'clsx';
import { MessageSquarePlusIcon } from 'lucide-react';

import { QuestionModal } from '@/components/modals/question-modal';
import type { User } from '@/server/auth';

import { Button } from '../ui/button';

export function TanyakanSekarangButton({
	fullWidth = false,
	user,
	defaultSubject,
}: {
	user: User;
	defaultSubject?: string;
	fullWidth?: boolean;
}) {
	return (
		<QuestionModal user={user} defaultSubject={defaultSubject}>
			<Button
				className={clsx(
					'rounded-full font-semibold',
					fullWidth && 'text-base w-full py-7',
				)}
			>
				<MessageSquarePlusIcon size={20} className='mr-2' />
				<span className='truncate'>Buat pertanyaan</span>
			</Button>
		</QuestionModal>
	);
}
