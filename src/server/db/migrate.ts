import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { environment } from '@/environment.mjs';

const migrationClient = postgres(environment.DATABASE_URL, { max: 1 });

// eslint-disable-next-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
(async () => {
  await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
  await migrationClient.end();
})();
