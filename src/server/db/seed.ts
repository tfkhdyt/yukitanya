import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { environment } from '@/environment.mjs';

import { subjects } from './schema';

const seedClient = postgres(environment.DATABASE_URL, { max: 1 });

(async () => {
  const database = drizzle(seedClient);
  await database
    .insert(subjects)
    .values([
      {
        id: 'ipa',
        name: 'IPA',
      },
      {
        id: 'ips',
        name: 'IPS',
      },
      {
        id: 'mtk',
        name: 'Matematika',
      },
      {
        id: 'indo',
        name: 'B. Indonesia',
      },
      {
        id: 'inggris',
        name: 'B. Inggris',
      },
      {
        id: 'ppkn',
        name: 'PPKn',
      },
      {
        id: 'other',
        name: 'Lainnya',
      },
    ])
    .onConflictDoNothing();
  await seedClient.end();
})();
