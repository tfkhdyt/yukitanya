'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type ReactNode, useState } from 'react';

import type { AppRouter } from '@/server/api/root';

import { getUrl, transformer } from './shared';

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(properties: {
	children: ReactNode;
	headers: Headers;
}) {
	const [queryClient] = useState(() => new QueryClient());

	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === 'development' ||
						(op.direction === 'down' && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					headers() {
						const heads = new Map(properties.headers);
						heads.set('x-trpc-source', 'react');
						heads.delete('connection');
						return Object.fromEntries(heads);
					},
					url: getUrl(),
				}),
			],
			transformer,
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{properties.children}
			</api.Provider>
		</QueryClientProvider>
	);
}
