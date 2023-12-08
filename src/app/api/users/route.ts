import { db } from '@/server/db';
import { users } from '@/server/db/schema';

export async function GET() {
	const data = await db
		.select({
			id: users.id,
			name: users.name,
			username: users.username,
			image: users.image,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
		})
		.from(users);

	return Response.json(data);
}
