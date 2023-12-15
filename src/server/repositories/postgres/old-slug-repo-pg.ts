import { eq } from 'drizzle-orm';

import { Pg, db } from '@/server/db';

import { oldSlug } from './../../db/schema';

export class OldSlugRepoPg {
	constructor(private readonly db: Pg) {}

	async findOldSlug(slug: string) {
		return await this.db.query.oldSlug.findFirst({
			where: eq(oldSlug.slug, slug),
			columns: {
				questionId: true,
			},
		});
	}
}

export const oldSlugRepoPg = new OldSlugRepoPg(db);
