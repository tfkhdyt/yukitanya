import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { environment } from '@/environment.mjs';

const migrationClient = postgres(environment.DATABASE_URL, { max: 1 });

(async () => {
  await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
  await migrationClient.end();
})();
