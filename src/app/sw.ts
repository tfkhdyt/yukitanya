import type { PrecacheEntry } from '@serwist/precaching';
import { installSerwist } from '@serwist/sw';

declare const self: ServiceWorkerGlobalScope & {
	// Change this attribute's name to your `injectionPoint`.
	__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: [
		{
			urlPattern: () => true,
			handler: 'CacheFirst',
			options: {
				cacheName: 'fallback',
				plugins: [
					{
						handlerDidError: async () => {
							const fallbackResponse = await caches.match('/~offline', {
								ignoreSearch: true,
							});
							if (fallbackResponse !== undefined) return fallbackResponse;
							return Response.error();
						},
					},
				],
			},
		},
	],
});
