import { db } from '@/server/db';
import { questions } from '@/server/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  // const data = await db
  // 	.select({
  // 		id: questions.id,
  // 		content: questions.content,
  // 		subjectId: questions.subjectId,
  // 	})
  // 	.from(questions);
  const data = await db.query.questions.findMany({
    orderBy: desc(questions.createdAt),
  });

  return Response.json(data);
}
