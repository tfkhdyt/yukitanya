import { MetadataRoute } from 'next';

import { environment } from '@/environment.mjs';
import { db } from '@/server/db';
import { questions, users } from '@/server/db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [_questions, _users] = await Promise.allSettled([
		db.select().from(questions),
		db.select().from(users),
	]);

	let questionsSitemaps: MetadataRoute.Sitemap = [];
	if (_questions.status === 'fulfilled') {
		questionsSitemaps = _questions.value.map((post) => ({
			url: `${environment.NEXT_PUBLIC_BASE_PATH}/questions/${post.slug}`,
			lastModified: post.updatedAt,
			changeFrequency: 'weekly',
			priority: 0.9,
		}));
	}

	let usersSitemaps: MetadataRoute.Sitemap = [];
	if (_users.status === 'fulfilled') {
		usersSitemaps = _users.value.map((user) => ({
			url: `${environment.NEXT_PUBLIC_BASE_PATH}/users/${user.username}`,
			lastModified: user.updatedAt,
			changeFrequency: 'weekly',
			priority: 0.7,
		}));
	}

	return [
		...questionsSitemaps,
		...usersSitemaps,
		{
			url: environment.NEXT_PUBLIC_BASE_PATH,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
		{
			url: `${environment.NEXT_PUBLIC_BASE_PATH}/subjects`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${environment.NEXT_PUBLIC_BASE_PATH}/auth/sign-in`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${environment.NEXT_PUBLIC_BASE_PATH}/auth/sign-up`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
	];
}
