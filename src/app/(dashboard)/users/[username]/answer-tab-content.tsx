'use client';

import type { Session } from 'next-auth';

import { AnswerPost } from '@/components/answer/answer-post';
import { SkeletonAnswerPost } from '@/components/answer/skeleton-answer-post';
import { JawabanKosong } from '@/components/jawaban-kosong';
import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export function AnswerTabContent({
	session,
	user,
}: {
	session: Session | null;
	user: {
		id: string;
		name: string;
	};
}) {
	const { fetchNextPage, data, isLoading, isError, error, isFetchingNextPage } =
		api.answer.findAllAnswersByUserId.useInfiniteQuery(
			{
				userId: user.id,
				limit: 10,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		);

	const [reference, entry] = useIntersectionObserver({ threshold: 0 });
	useEffect(() => {
		if (entry?.isIntersecting) {
			void fetchNextPage();
		}
	}, [entry, fetchNextPage]);

	const answers = data?.pages.flatMap((page) => page.data);

	if (isLoading) {
		return <SkeletonAnswerPost />;
	}

	if (isError) {
		return <JawabanKosong title={error?.message} session={session} />;
	}

	if (answers?.length === 0 || !answers) {
		return (
			<PertanyaanKosong
				user={session?.user}
				title={`${user.name} belum membuat jawaban`}
				showTanyakanButton={false}
			/>
		);
	}

	return (
		<>
			{answers.map((answer, index) => {
				const membership = answer.owner.memberships.find((mb) =>
					dayjs().isBefore(mb.expiresAt),
				);

				return (
					<div
						key={answer.id}
						ref={index === answers.length - 1 ? reference : undefined}
					>
						<AnswerPost
							answer={{
								content: answer.content,
								createdAt: answer.createdAt,
								updatedAt: answer.updatedAt,
								id: answer.id,
								isBestAnswer: answer.isBestAnswer,
								numberOfVotes: answer.ratings.length,
								ratings: answer.ratings,
								owner: {
									...answer.owner,
									membership,
									initial: createInitial(answer.owner.name),
								},
							}}
							key={answer.id}
							question={{
								content: answer.question.content,
								createdAt: answer.question.createdAt,
								id: answer.question.id,
								subject: answer.question.subject,
								updatedAt: answer.question.updatedAt,
								owner: {
									...answer.question.owner,
									membership: answer.question.owner.memberships.find((mb) =>
										dayjs().isBefore(mb.expiresAt),
									),
									initial: createInitial(answer.question.owner.name),
								},
								slug: answer.question.slug,
							}}
							session={session}
						/>
					</div>
				);
			})}
			{isFetchingNextPage && <SkeletonAnswerPost />}
		</>
	);
}
