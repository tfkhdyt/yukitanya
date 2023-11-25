import { type Config } from 'drizzle-kit';

import { environment } from '@/environment.mjs';

export default {
  dbCredentials: {
    connectionString: environment.DATABASE_URL,
  },
  driver: 'pg',
  out: './drizzle',
  schema: './src/server/db/schema.ts',
} satisfies Config;
