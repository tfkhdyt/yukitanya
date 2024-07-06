import { environment } from '@/environment.mjs';
import Typesense from 'typesense';

export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: environment.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

const isQuestionSchemaExists = await typesenseClient
  .collections('questions')
  .exists();

if (!isQuestionSchemaExists) {
  typesenseClient.collections().create({
    name: 'questions',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'content', type: 'string' },
      { name: 'subjectId', type: 'string', facet: true },
    ],
  });
}
