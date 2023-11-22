import { env } from '@/env.mjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { subjects } from './schema';

const seedClient = postgres(env.DATABASE_URL, { max: 1 });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const db = drizzle(seedClient);
  await db
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
