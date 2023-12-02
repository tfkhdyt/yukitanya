import { and, desc, eq, isNull, lte, sql } from 'drizzle-orm';
import { z } from 'zod';

import { notifications } from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const notificationRouter = createTRPCRouter({
	findAllNotificationByReceiverUserId: protectedProcedure
		.input(
			z.object({
				receiverUserId: z.string(),
				limit: z.number().min(1).max(50).default(10),
				cursor: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.notifications.findMany({
				where: input.cursor
					? and(
							eq(notifications.receiverUserId, input.receiverUserId),
							lte(notifications.id, input.cursor),
					  )
					: eq(notifications.receiverUserId, input.receiverUserId),
				limit: input.limit + 1,
				with: {
					question: true,
					transmitterUser: true,
				},
				orderBy: desc(notifications.createdAt),
			});

			let nextCursor: typeof input.cursor | undefined = undefined;
			if (data.length > input.limit) {
				const nextItem = data.pop();
				nextCursor = nextItem?.id;
			}

			return {
				data,
				nextCursor,
			};
		}),
	markHasBeenRead: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input: notifId }) => {
			await ctx.db
				.update(notifications)
				.set({ readAt: new Date() })
				.where(eq(notifications.id, notifId));
		}),
	markAllHasBeenRead: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input: userId }) => {
			await ctx.db
				.update(notifications)
				.set({ readAt: new Date() })
				.where(eq(notifications.receiverUserId, userId));
		}),
	isAllNotifHasBeenRead: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input: userId }) => {
			const notifs = await ctx.db.query.notifications.findMany({
				where: eq(notifications.receiverUserId, userId),
			});

			return notifs.every((notif) => notif.readAt !== null);
		}),
	getNotificationCount: protectedProcedure
		.input(z.string().optional())
		.query(async ({ ctx, input: receiverUserId }) => {
			if (!receiverUserId) {
				return null;
			}

			const count = await ctx.db
				.select({
					count: sql<number>`CAST(COUNT(*) as int)`,
				})
				.from(notifications)
				.where(
					and(
						eq(notifications.receiverUserId, receiverUserId),
						isNull(notifications.readAt),
					),
				)
				.limit(1);

			if (count.length === 0 || !count[0]?.count) {
				return null;
			}

			return count[0].count;
		}),
});
