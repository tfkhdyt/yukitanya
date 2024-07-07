import { type Config } from 'drizzle-kit';

import { environment } from '@/environment.mjs';

export default {
  dbCredentials: {
    url: environment.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/server/db/schema.ts',
} satisfies Config;
