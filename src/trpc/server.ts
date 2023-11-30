import {
	createTRPCProxyClient,
	loggerLink,
	unstable_httpBatchStreamLink,
} from '@trpc/client';
import { headers } from 'next/headers';

import { type AppRouter } from '@/server/api/root';

import { getUrl, transformer } from './shared';

export const api = createTRPCProxyClient<AppRouter>({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === 'development' ||
				(op.direction === 'down' && op.result instanceof Error),
		}),
		unstable_httpBatchStreamLink({
			headers() {
				const heads = new Map(headers());
				heads.set('x-trpc-source', 'rsc');
				return Object.fromEntries(heads);
			},
			url: getUrl(),
		}),
	],
	transformer,
});
