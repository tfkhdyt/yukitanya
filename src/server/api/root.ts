import { createTRPCRouter } from '@/server/api/trpc';

import { answerRouter } from './routers/answer';
import { favoriteRouter } from './routers/favorite';
import { notificationRouter } from './routers/notification';
import { paymentRouter } from './routers/payment';
import { questionRouter } from './routers/question';
import { ratingRouter } from './routers/rating';
import { subjectRouter } from './routers/subject';
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
	answer: answerRouter,
	notification: notificationRouter,
	subject: subjectRouter,
	payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
