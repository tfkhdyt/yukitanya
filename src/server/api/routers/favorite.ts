import { and, desc, eq, lte } from 'drizzle-orm';
import { z } from 'zod';

import { favorites, notifications, questions } from '@/server/db/schema';

import cuid from 'cuid';
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

      if (input.userId !== question.owner.id) {
        await ctx.db
          .delete(notifications)
          .where(
            and(
              eq(notifications.questionId, input.questionId),
              eq(notifications.receiverUserId, question.owner.id),
              eq(notifications.transmitterUserId, input.userId),
              eq(notifications.type, 'favorite'),
            ),
          );

        await ctx.db.insert(notifications).values({
          id: `notification-${cuid()}`,
          questionId: input.questionId,
          description: question.content.slice(0, 100),
          receiverUserId: question.owner.id,
          transmitterUserId: input.userId,
          type: 'favorite',
        });
      }

      return ctx.db.insert(favorites).values(input);
    }),
  findAllFavoritedQuestions: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.favorites.findMany({
        orderBy: [desc(favorites.questionId)],
        where: input.cursor
          ? and(
              eq(favorites.userId, input.userId),
              lte(favorites.questionId, input.cursor),
            )
          : eq(favorites.userId, input.userId),
        limit: input.limit + 1,
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
              owner: {
                with: {
                  memberships: true,
                },
              },
              subject: true,
              images: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (data.length > input.limit) {
        const nextItem = data.pop();
        nextCursor = nextItem?.questionId;
      }

      return { data, nextCursor };
    }),
});
