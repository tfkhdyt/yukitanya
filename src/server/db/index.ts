import { env } from '@/env.mjs';
import * as schema from '@/server/db/schema';
import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

// for query purposes
const queryClient = postgres(env.DATABASE_URL);
if (env.NODE_ENV === 'production') {
  db = drizzle(queryClient, { schema });
} else {
  if (!global.db) global.db = drizzle(queryClient, { schema });

  db = global.db;
}

export { db };
