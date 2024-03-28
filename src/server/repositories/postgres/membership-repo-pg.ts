import { and, eq, gt } from 'drizzle-orm';

import { type Pg, db } from '@/server/db';
import { memberships } from '@/server/db/schema';

class MembershipRepoPg {
  constructor(private readonly db: Pg) {}

  async findValidMembership(userId: string) {
    return await this.db.query.memberships.findFirst({
      where: and(
        eq(memberships.userId, userId),
        gt(memberships.expiresAt, new Date()),
      ),
    });
  }
}

export { MembershipRepoPg };

export const membershipRepoPg = new MembershipRepoPg(db);
