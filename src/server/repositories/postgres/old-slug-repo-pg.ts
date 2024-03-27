import cuid from 'cuid';
import { eq } from 'drizzle-orm';

import { type Pg, db } from '@/server/db';

import { oldSlug } from './../../db/schema';

class OldSlugRepoPg {
	constructor(private readonly db: Pg) {}

	async findOldSlug(slug: string) {
		return await this.db.query.oldSlug.findFirst({
			where: eq(oldSlug.slug, slug),
			columns: {
				questionId: true,
			},
		});
	}

	async addOldSlug(questionId: string, slug: string) {
		return await this.db.insert(oldSlug).values({
			id: `old-slug-${cuid()}`,
			questionId,
			slug,
		});
	}
}

export { OldSlugRepoPg };

export const oldSlugRepoPg = new OldSlugRepoPg(db);
