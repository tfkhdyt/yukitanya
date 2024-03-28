import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { environment } from '@/environment.mjs';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

const handler = (request: NextRequest) =>
  fetchRequestHandler({
    createContext: () => createTRPCContext({ req: request }),
    endpoint: '/api/trpc',
    onError:
      environment.NODE_ENV === 'development'
        ? ({ error, path }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
    req: request,
    router: appRouter,
  });

export { handler as GET, handler as POST };
