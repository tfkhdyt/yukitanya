import { createTRPCRouter } from '@/server/api/trpc';

import { favoriteRouter } from './routers/favorite';
import { questionRouter } from './routers/question';
import { ratingRouter } from './routers/rating';
import { userRouter } from './routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  favorite: favoriteRouter,
  question: questionRouter,
  rating: ratingRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
