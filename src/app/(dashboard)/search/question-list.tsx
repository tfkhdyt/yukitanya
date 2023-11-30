'use client';

import { type Session } from 'next-auth';

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
	const questions = api.question.findAllQuestionsByQueryAndSubject.useQuery({
		query,
		subjectId,
	});

	if (questions.isLoading || !questions.data) {
		return <SkeletonQuestionPost />;
	}

	if (questions.isError) {
		return <PertanyaanKosong title={questions.error?.message} />;
	}

	if (questions.data.length === 0) {
		return (
			<PertanyaanKosong
				title='Pertanyaan yang kamu cari tidak ditemukan'
				user={session?.user}
			/>
		);
	}

	return (
		<>
			{questions.data.map((question) => {
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
					<QuestionPost
						highlightedWords={query.toLowerCase().split(' ')}
						key={question.id}
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
						}}
						session={session}
					/>
				);
			})}
		</>
	);
}
