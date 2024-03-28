import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { environment } from '@/environment.mjs';
import type { AppRouter } from '@/server/api/root';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.NODE_ENV === 'production') return environment.NEXTAUTH_URL;
  // If (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function getUrl() {
  return `${getBaseUrl()}/api/trpc`;
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export { default as transformer } from 'superjson';
