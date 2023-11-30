import { asc, desc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import {
  answers,
  insertAnswerSchema,
  notifications,
  questions,
  updateAnswerSchema,
} from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const answerRouter = createTRPCRouter({
  createAnswer: protectedProcedure
    .input(insertAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.query.questions.findFirst({
        where: eq(questions.id, input.questionId),
      });

      const answer = await ctx.db.insert(answers).values(input).returning();

      if (input.userId !== question?.userId && answer[0] && question)
        await ctx.db.insert(notifications).values({
          id: `notification-${nanoid()}`,
          questionId: input.questionId,
          description: answer[0].content.slice(0, 100),
          receiverUserId: question.userId,
          transmitterUserId: input.userId,
          type: 'new-answer',
        });
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
        userId: z.string(),
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

      if (input.userId !== answer[0]?.userId && answer[0]) {
        await ctx.db.insert(notifications).values({
          id: `notification-${nanoid()}`,
          questionId: input.questionId,
          description: answer[0].content.slice(0, 100),
          receiverUserId: answer[0].userId,
          transmitterUserId: input.userId,
          type: 'best-answer',
        });
      }

      return ctx.db
        .update(answers)
        .set({ isBestAnswer: true })
        .where(eq(answers.id, input.answerId));
    }),
});
