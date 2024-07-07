import { environment } from '@/environment.mjs';
import { db } from '@/server/db';
import { questions } from '@/server/db/schema';
import { getServerSideSitemapIndex } from 'next-sitemap';

export async function GET(_: Request) {
  const questionsData = await db
    .select({ slug: questions.slug })
    .from(questions);

  const urls = questionsData.map(
    (question) => `${environment.NEXTAUTH_URL}/questions/${question.slug}`,
  );

  return getServerSideSitemapIndex(urls);
}
