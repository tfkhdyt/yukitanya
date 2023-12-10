'use client';

import { type Session } from 'next-auth';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { SkeletonQuestionPost } from '@/components/question/skeleton-question-post';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect } from 'react';

export function FavoriteTabContent({
	session,
	user,
}: {
	session: Session | null;
	user: {
		id: string;
		name: string;
	};
}) {
	const { fetchNextPage, data, isLoading, isError, error } =
		api.favorite.findAllFavoritedQuestions.useInfiniteQuery(
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

	const questions = data?.pages.flatMap((page) => page.data);

	if (isLoading) {
		return <SkeletonQuestionPost />;
	}

	if (isError) {
		return (
			<PertanyaanKosong title={error?.message} showTanyakanButton={false} />
		);
	}

	if (questions?.length === 0 || !questions) {
		return (
			<PertanyaanKosong
				user={session?.user}
				title={`${user.name} belum mempunyai favorit`}
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

				return (
					<div
						key={question.questionId}
						ref={index === questions.length - 1 ? reference : undefined}
					>
						<QuestionPost
							question={{
								content: question.question.content,
								createdAt: question.question.createdAt,
								id: question.question.id,
								numberOfAnswers: question.question.answers.length,
								numberOfFavorites: question.question.favorites.length,
								owner: {
									...question.question.owner,
									initial: createInitial(question.question.owner.name),
								},
								slug: question.question.slug,
								subject: question.question.subject,
								updatedAt: question.question.updatedAt,
								isFavorited: question.question.favorites.some(
									(favorite) => favorite.userId === session?.user.id,
								),
								rating: Number.isNaN(averageRating) ? undefined : averageRating,
								images: question.question.images,
							}}
							session={session}
						/>
					</div>
				);
			})}
		</>
	);
}
