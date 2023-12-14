import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { environment } from '@/environment.mjs';
import * as schema from '@/server/db/schema';

export type Pg = PostgresJsDatabase<typeof schema>;

declare global {
	// eslint-disable-next-line no-var -- only var works here
	// biome-ignore lint/style/noVar: <explanation>
	var database: Pg | undefined;
}

let db: Pg;

// for query purposes
const queryClient = postgres(environment.DATABASE_URL);
if (environment.NODE_ENV === 'production') {
	db = drizzle(queryClient, { schema });
} else {
	if (!global.database) global.database = drizzle(queryClient, { schema });

	db = global.database;
}

export { db };
