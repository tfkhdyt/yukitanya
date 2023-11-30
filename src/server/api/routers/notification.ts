import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { notifications } from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const notificationRouter = createTRPCRouter({
  findAllNotificationByReceiverUserId: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: receiverUserId }) => {
      return ctx.db.query.notifications.findMany({
        where: eq(notifications.receiverUserId, receiverUserId),
        with: {
          question: true,
          transmitterUser: true,
        },
        orderBy: desc(notifications.createdAt),
      });
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
});
