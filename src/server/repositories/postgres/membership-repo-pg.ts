import { and, eq, gt } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { db } from '@/server/db';
import * as schema from '@/server/db/schema';
import { memberships } from '@/server/db/schema';

export class MembershipRepoPg {
	constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

	async findValidMembership(userId: string) {
		return await this.db.query.memberships.findFirst({
			where: and(
				eq(memberships.userId, userId),
				gt(memberships.expiresAt, new Date()),
			),
		});
	}
}

export const membershipRepoPg = new MembershipRepoPg(db);
