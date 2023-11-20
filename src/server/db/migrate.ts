import { env } from '@/env.mjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
void migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' }).then(
  async () => {
    await migrationClient.end();
  },
);
