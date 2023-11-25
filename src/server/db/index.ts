import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { environment } from '@/environment.mjs';
import * as schema from '@/server/db/schema';

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var database: PostgresJsDatabase<typeof schema> | undefined;
}

let database: PostgresJsDatabase<typeof schema>;

// for query purposes
const queryClient = postgres(environment.DATABASE_URL);
if (environment.NODE_ENV === 'production') {
  database = drizzle(queryClient, { schema });
} else {
  if (!global.database) global.database = drizzle(queryClient, { schema });

  database = global.database;
}

export { database as db };
