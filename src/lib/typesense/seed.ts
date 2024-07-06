import { questions } from '@/server/db/schema';
import postgres from 'postgres';
import { environment } from '@/environment.mjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import Typesense from 'typesense';

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: environment.TYPESENSE_HOST,
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: environment.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

const seedClient = postgres(environment.DATABASE_URL, { max: 1 });

(async () => {
  const isQuestionSchemaExists = await typesenseClient
    .collections('questions')
    .exists();

  if (!isQuestionSchemaExists) {
    typesenseClient.collections().create({
      name: 'questions',
      fields: [
        { name: 'id', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'subjectId', type: 'string' },
      ],
    });
  }

  const database = drizzle(seedClient);

  const questionsData = await database
    .select({
      id: questions.id,
      content: questions.content,
      subjectId: questions.subjectId,
    })
    .from(questions);

  await typesenseClient
    .collections('questions')
    .documents()
    .import(questionsData, { action: 'upsert' });

  await seedClient.end();
})();
