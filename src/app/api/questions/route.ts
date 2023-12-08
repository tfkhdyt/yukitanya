import { db } from '@/server/db';
import { questions } from '@/server/db/schema';

export async function GET() {
	const data = await db.select().from(questions);

	return Response.json(data);
}
