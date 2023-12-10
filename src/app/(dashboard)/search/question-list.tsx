'use client';

import { useIntersectionObserver } from '@uidotdev/usehooks';
import { type Session } from 'next-auth';
import { useEffect } from 'react';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { SkeletonQuestionPost } from '@/components/question/skeleton-question-post';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

export function QuestionList({
	query,
	subjectId,
	session,
}: {
	query: string;
	subjectId: string;
	session: Session | null;
}) {
	const { isLoading, data, fetchNextPage, isFetchingNextPage, error, isError } =
		api.question.findAllQuestionsByQueryAndSubject.useInfiniteQuery(
			{
				query,
				subjectId,
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
		return <PertanyaanKosong title={error?.message} />;
	}

	if (questions?.length === 0 || !questions) {
		return (
			<PertanyaanKosong
				title='Pertanyaan yang kamu cari tidak ditemukan'
				user={session?.user}
			/>
		);
	}

	return (
		<>
			{questions.map((question, index) => {
				const bestAnswerRatings =
					question.answers.find((answer) => answer.isBestAnswer === true)
						?.ratings ?? [];
				const totalRating =
					bestAnswerRatings?.reduce(
						(accumulator, rating) => accumulator + rating.value,
						0,
					) ?? 0;
				const averageRating = totalRating / bestAnswerRatings?.length;

				return (
					<div
						ref={index === questions.length - 1 ? reference : undefined}
						key={question.id}
					>
						<QuestionPost
							highlightedWords={query.toLowerCase().split(' ')}
							question={{
								content: question.content,
								createdAt: question.createdAt,
								id: question.id,
								isFavorited: question.favorites.some(
									(favorite) => favorite.userId === session?.user.id,
								),
								numberOfAnswers: question.answers.length,
								numberOfFavorites: question.favorites.length,
								rating: Number.isNaN(averageRating) ? undefined : averageRating,
								subject: question.subject,
								updatedAt: question.updatedAt,
								slug: question.slug,
								owner: {
									...question.owner,
									initial: createInitial(question.owner.name),
								},
								images: question.images,
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
