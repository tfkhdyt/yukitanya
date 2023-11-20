import { env } from '@/env.mjs';
import { type Config } from 'drizzle-kit';

export default {
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  driver: 'pg',
  out: './drizzle',
  schema: './src/server/db/schema.ts',
} satisfies Config;
