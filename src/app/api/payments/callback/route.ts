import cuid from 'cuid';

import { db } from '@/server/db';
import { memberships } from '@/server/db/schema';
import dayjs from 'dayjs';

export async function POST(req: Request) {
  const body = await req.json();

  if (body.transaction_status !== 'settlement') {
    return new Response('Status should be settlement', { status: 200 });
  }

  const [premiumType, duration, userId] = body.order_id.split('_');

  const currentDate = dayjs();
  const expiresAt = currentDate.add(duration, 'month');

  await db.insert(memberships).values({
    id: `membership-${cuid()}`,
    userId: userId,
    type: premiumType,
    expiresAt: expiresAt.toDate(),
  });

  return Response.json({
    message: 'success',
  });
}
