import { favorites } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const favoriteRouter = createTRPCRouter({
  toggleFavorite: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('Mutating...');
      const haveFavorited = await ctx.db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.questionId, input.questionId),
            eq(favorites.userId, input.userId),
          ),
        )
        .limit(1);

      if (haveFavorited.length > 0) {
        return ctx.db
          .delete(favorites)
          .where(
            and(
              eq(favorites.questionId, input.questionId),
              eq(favorites.userId, input.userId),
            ),
          );
      }

      return ctx.db.insert(favorites).values(input);
    }),
});
