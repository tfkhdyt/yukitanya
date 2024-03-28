import { environment } from '@/environment.mjs';
import algoliasearch from 'algoliasearch';

const algoliaClient = algoliasearch(
  environment.ALGOLIA_APP_ID,
  environment.ALGOLIA_API_KEY,
);
export const questionIndex = algoliaClient.initIndex('questions');
