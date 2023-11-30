'use client';

import { type Session } from 'next-auth';

import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { QuestionPost } from '@/components/question/question-post';
import { SkeletonQuestionPost } from '@/components/question/skeleton-question-post';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

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
	const favorites = api.favorite.findAllFavoritedQuestions.useQuery(user.id);

	if (favorites.isLoading && !favorites.data) {
		return <SkeletonQuestionPost />;
	}

	if (favorites.isError) {
		return (
			<PertanyaanKosong
				title={favorites.error?.message}
				showTanyakanButton={false}
			/>
		);
	}

	if (favorites.data.length === 0) {
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
			{favorites.data.map((favorite) => {
				const bestAnswerRatings =
					favorite.question.answers.find(
						(answer) => answer.isBestAnswer === true,
					)?.ratings ?? [];
				const totalRating =
					bestAnswerRatings?.reduce(
						(accumulator, rating) => accumulator + rating.value,
						0,
					) ?? 0;
				const averageRating = totalRating / bestAnswerRatings?.length;

				return (
					<QuestionPost
						key={favorite.question.id}
						question={{
							content: favorite.question.content,
							createdAt: favorite.question.createdAt,
							id: favorite.question.id,
							numberOfAnswers: favorite.question.answers.length,
							numberOfFavorites: favorite.question.favorites.length,
							owner: {
								...favorite.question.owner,
								initial: createInitial(favorite.question.owner.name),
							},
							slug: favorite.question.slug,
							subject: favorite.question.subject,
							updatedAt: favorite.question.updatedAt,
							isFavorited: favorite.question.favorites.some(
								(favorite) => favorite.userId === session?.user.id,
							),
							rating: Number.isNaN(averageRating) ? undefined : averageRating,
						}}
						session={session}
					/>
				);
			})}
		</>
	);
}
