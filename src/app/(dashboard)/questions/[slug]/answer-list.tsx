'use client';

import type { Session } from 'next-auth';

import { AnswerPost } from '@/components/answer/answer-post';
import { SkeletonAnswerPost } from '@/components/answer/skeleton-answer-post';
import { JawabanKosong } from '@/components/jawaban-kosong';
import { createInitial } from '@/lib/utils';
import type { User } from '@/server/auth';
import { api } from '@/trpc/react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';

type Question = {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	id: string;
	subject: {
		id: string;
		name: string;
	};
	owner: User;
	slug: string;
};

export function AnswerList({
	question,
	session,
}: {
	question: Question;
	session: Session | null;
}) {
	const bestAnswer = api.answer.findBestAnswerByQuestionId.useQuery(
		question.id,
	);
	const { isLoading, data, fetchNextPage, isError, error, isFetchingNextPage } =
		api.answer.findAllAnswersByQuestionId.useInfiniteQuery(
			{
				limit: 5,
				questionId: question.id,
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

	if (isLoading || bestAnswer.isLoading) {
		return <SkeletonAnswerPost />;
	}

	if (isError || bestAnswer.isError) {
		return (
			<JawabanKosong
				title={error?.message}
				question={question}
				session={session}
			/>
		);
	}

	if (answers?.length === 0 && !bestAnswer.data) {
		return (
			<JawabanKosong
				title={`${question.owner.name} menunggu jawaban mu`}
				question={question}
				session={session}
			/>
		);
	}

	const bestAnswerOwnerMembership = bestAnswer.data?.owner.memberships.find(
		(membership) => dayjs().isBefore(membership.expiresAt),
	);

	return (
		<>
			{bestAnswer.data && (
				<AnswerPost
					answer={{
						content: bestAnswer.data.content,
						createdAt: bestAnswer.data.createdAt,
						updatedAt: bestAnswer.data.updatedAt,
						id: bestAnswer.data.id,
						isBestAnswer: bestAnswer.data.isBestAnswer,
						numberOfVotes: bestAnswer.data.ratings.length,
						ratings: bestAnswer.data.ratings,
						owner: {
							...bestAnswer.data.owner,
							membership: bestAnswerOwnerMembership,
							initial: createInitial(bestAnswer.data.owner.name),
						},
					}}
					key={bestAnswer.data.id}
					question={{
						content: question.content,
						createdAt: question.createdAt,
						id: question.id,
						subject: question.subject,
						updatedAt: question.updatedAt,
						owner: {
							...question.owner,
							initial: createInitial(question.owner.name),
						},
						slug: question.slug,
					}}
					session={session}
				/>
			)}
			{answers &&
				answers.length > 0 &&
				answers.map((answer, index) => {
					const membership = answer.owner.memberships.find((membership) =>
						dayjs().isBefore(membership.expiresAt),
					);

					return (
						<div
							ref={index === answers.length - 1 ? reference : undefined}
							key={answer.id}
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
								question={{
									content: question.content,
									createdAt: question.createdAt,
									id: question.id,
									subject: question.subject,
									updatedAt: question.updatedAt,
									owner: {
										...question.owner,
										initial: createInitial(question.owner.name),
									},
									slug: question.slug,
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
