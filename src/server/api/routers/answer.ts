import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
  answers,
  insertAnswerSchema,
  insertQuestionSchema,
  questions,
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
        orderBy: [asc(answers.isBestAnswer), asc(answers.createdAt)],
        with: {
          owner: true,
          ratings: true,
        },
      });
    }),
  updateAnswerById: protectedProcedure
    .input(insertQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(questions)
        .set({
          content: input.content,
          slug: input.slug,
          subjectId: input.subjectId,
          updatedAt: new Date(),
        })
        .where(eq(questions.id, input.id));
      return revalidatePath('/');
    }),
});
