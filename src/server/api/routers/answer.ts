import { asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import {
  answers,
  insertAnswerSchema,
  updateAnswerSchema,
} from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const answerRouter = createTRPCRouter({
  createAnswer: protectedProcedure
    .input(insertAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(answers).values(input);
    }),
  deleteAnswerById: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: answerId }) => {
      return ctx.db.delete(answers).where(eq(answers.id, answerId));
    }),
  findAllAnswersByQuestionId: publicProcedure
    .input(z.string())
    .query(({ ctx, input: questionId }) => {
      return ctx.db.query.answers.findMany({
        where: eq(answers.questionId, questionId),
        orderBy: [desc(answers.isBestAnswer), asc(answers.createdAt)],
        with: {
          owner: true,
          ratings: true,
        },
      });
    }),
  findAllAnswersByUserId: publicProcedure
    .input(z.string())
    .query(({ ctx, input: userId }) => {
      return ctx.db.query.answers.findMany({
        where: eq(answers.userId, userId),
        orderBy: [desc(answers.createdAt)],
        with: {
          owner: true,
          ratings: true,
          question: {
            with: {
              subject: true,
              owner: true,
            },
          },
        },
      });
    }),
  updateAnswerById: protectedProcedure
    .input(updateAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(answers)
        .set({
          content: input.content,
          updatedAt: new Date(),
        })
        .where(eq(answers.id, input.id));
    }),
  toggleBestAnswer: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        answerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const answer = await ctx.db
        .select()
        .from(answers)
        .where(eq(answers.id, input.answerId))
        .limit(1);

      await ctx.db
        .update(answers)
        .set({ isBestAnswer: false })
        .where(eq(answers.questionId, input.questionId));

      if (answer.length > 0 && answer[0]?.isBestAnswer === true) {
        return;
      }

      return ctx.db
        .update(answers)
        .set({ isBestAnswer: true })
        .where(eq(answers.id, input.answerId));
    }),
});
