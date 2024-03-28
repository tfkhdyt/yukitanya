import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { environment } from '@/environment.mjs';
import * as schema from '@/server/db/schema';

export type Pg = PostgresJsDatabase<typeof schema>;

declare global {
  var database: Pg | undefined; // eslint-disable-line
}

let db: Pg;

// For query purposes
const queryClient = postgres(environment.DATABASE_URL);
if (environment.NODE_ENV === 'production') {
  db = drizzle(queryClient, { schema });
} else {
  global.database ||= drizzle(queryClient, { schema });

  db = global.database;
}

export { db };
