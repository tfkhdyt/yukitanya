import clsx from 'clsx';
import { MessageCircleIcon } from 'lucide-react';
import { type Session } from 'next-auth';

import { type User } from '@/server/auth';

import { AnswerModal } from '../modals/answer-modal';
import { Button } from '../ui/button';

type Question = {
	content: string;
	createdAt: Date;
	subject: {
		id: string;
		name: string;
	};
	updatedAt: Date;
	owner: User;
	id: string;
};

export function JawabSekarangButton({
	center = false,
	question,
	session,
}: {
	center?: boolean;
	question: Question;
	session: Session;
}) {
	return (
		<AnswerModal question={question} session={session}>
			<Button
				className={clsx(
					'flex items-center space-x-2 rounded-full font-semibold',
					center && 'mx-auto',
				)}
			>
				<MessageCircleIcon size={16} />
				<p>Jawab Sekarang!</p>
			</Button>
		</AnswerModal>
	);
}
