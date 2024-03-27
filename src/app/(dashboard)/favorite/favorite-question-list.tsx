'use client';

import { useIntersectionObserver } from '@uidotdev/usehooks';
import type { Session } from 'next-auth';
import { useEffect } from 'react';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { SkeletonQuestionPost } from '@/components/question/skeleton-question-post';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';
import dayjs from 'dayjs';

export function FavoriteQuestionList({ session }: { session: Session }) {
	const { isLoading, data, fetchNextPage, isFetchingNextPage } =
		api.favorite.findAllFavoritedQuestions.useInfiniteQuery(
			{
				limit: 10,
				userId: session.user.id,
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

	const questions = data?.pages.flatMap((page) => page.data);

	if (isLoading) {
		return <SkeletonQuestionPost />;
	}

	if (questions?.length === 0 || !questions) {
		return (
			<PertanyaanKosong
				user={session?.user}
				title='Kamu belum mempunyai pertanyaan favorit'
				showTanyakanButton={false}
			/>
		);
	}

	return (
		<>
			{questions.map((question, index) => {
				const bestAnswerRatings =
					question.question.answers.find(
						(answer) => answer.isBestAnswer === true,
					)?.ratings ?? [];
				const totalRating =
					bestAnswerRatings?.reduce(
						(accumulator, rating) => accumulator + rating.value,
						0,
					) ?? 0;
				const averageRating = totalRating / bestAnswerRatings?.length;
				const membership = question.question.owner.memberships.find((mb) =>
					dayjs().isBefore(mb.expiresAt),
				);

				return (
					<div
						ref={index === questions.length - 1 ? reference : undefined}
						key={question.questionId}
					>
						<QuestionPost
							question={{
								content: question.question.content,
								createdAt: question.question.createdAt,
								id: question.questionId,
								isFavorited: question.question.favorites.some(
									(favorite) => favorite.userId === session?.user.id,
								),
								numberOfAnswers: question.question.answers.length,
								numberOfFavorites: question.question.favorites.length,
								rating: Number.isNaN(averageRating) ? undefined : averageRating,
								subject: question.question.subject,
								updatedAt: question.question.updatedAt,
								slug: question.question.slug,
								owner: {
									...question.question.owner,
									membership,
									initial: createInitial(question.question.owner.name),
								},
								images: question.question.images,
							}}
							session={session}
						/>
					</div>
				);
			})}
			{isFetchingNextPage && <SkeletonQuestionPost />}
		</>
	);
}
