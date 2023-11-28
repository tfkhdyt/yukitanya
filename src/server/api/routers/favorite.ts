import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { favorites } from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const favoriteRouter = createTRPCRouter({
  toggleFavorite: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
  findAllFavoritedQuestions: publicProcedure
    .input(z.string())
    .query(({ ctx, input: userId }) => {
      return ctx.db.query.favorites.findMany({
        orderBy: [desc(favorites.questionId)],
        where: eq(favorites.userId, userId),
        with: {
          question: {
            with: {
              answers: {
                columns: {
                  id: true,
                  isBestAnswer: true,
                },
                with: {
                  ratings: {
                    columns: {
                      value: true,
                    },
                  },
                },
              },
              favorites: {
                columns: {
                  userId: true,
                },
              },
              owner: true,
              subject: true,
            },
          },
        },
      });
    }),
});
