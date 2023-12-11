import clsx from 'clsx';
import { MessageSquarePlusIcon } from 'lucide-react';

import { QuestionModal } from '@/components/modals/question-modal';
import { type User } from '@/server/auth';

import { Button } from '../ui/button';

export function TanyakanSekarangButton({
	center = false,
	fullWidth = false,
	user,
	defaultSubject,
}: {
	center?: boolean;
	user: User;
	defaultSubject?: string;
	fullWidth?: boolean;
}) {
	return (
		<QuestionModal user={user} defaultSubject={defaultSubject}>
			<Button
				className={clsx(
					'flex items-center space-x-2 rounded-full font-semibold',
					fullWidth && 'text-base w-full',
					center && 'mx-auto',
				)}
			>
				<MessageSquarePlusIcon size={20} className='mr-2' />
				Tanyakan Sekarang!
			</Button>
		</QuestionModal>
	);
}
