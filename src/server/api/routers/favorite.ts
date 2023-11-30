import { and, desc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { favorites, notifications, questions } from '@/server/db/schema';

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
      const question = await ctx.db.query.questions.findFirst({
        columns: {
          id: true,
          content: true,
        },
        where: eq(questions.id, input.questionId),
        with: {
          owner: {
            columns: {
              id: true,
            },
          },
        },
      });

      if (!question) throw new Error('Pertanyaan tidak ditemukan');

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

      if (input.userId !== question.owner.id)
        await ctx.db.insert(notifications).values({
          id: `notification-${nanoid()}`,
          questionId: input.questionId,
          description: question.content.slice(0, 100),
          receiverUserId: question.owner.id,
          transmitterUserId: input.userId,
          type: 'favorite',
        });

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
