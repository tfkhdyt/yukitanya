import { environment } from '@/environment.mjs';
import { db } from '@/server/db';
import { questions } from '@/server/db/schema';
import { getServerSideSitemap } from 'next-sitemap';

export async function GET(_: Request) {
  const questionsData = await db
    .select({ slug: questions.slug })
    .from(questions);

  const urls = questionsData.map((question) => ({
    loc: `${environment.NEXTAUTH_URL}/questions/${question.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily' as const,
    priority: 0.7,
  }));

  return getServerSideSitemap(urls);
}
