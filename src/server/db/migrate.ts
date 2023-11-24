import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { env } from '@/env.mjs';

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
  await migrationClient.end();
})();
