import cuid from 'cuid';

import { db } from '@/server/db';
import { memberships } from '@/server/db/schema';
import dayjs from 'dayjs';

export async function POST(req: Request) {
  // eslint-disable-next-line
  const body = await req.json();

  if (body.transaction_status !== 'settlement') {
    return new Response('Status should be settlement', { status: 200 });
  }

  // eslint-disable-next-line
  const [premiumType, duration, userId] = body.order_id.split('_');

  const currentDate = dayjs();
  // eslint-disable-next-line
  const expiresAt = currentDate.add(duration, 'month');

  await db.insert(memberships).values({
    id: `membership-${cuid()}`,
    // eslint-disable-next-line
    userId,
    // eslint-disable-next-line
    type: premiumType,
    expiresAt: expiresAt.toDate(),
  });

  return Response.json({
    message: 'success',
  });
}
