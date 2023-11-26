import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { answers, insertQuestionSchema, questions } from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const answerRouter = createTRPCRouter({
  createAnswer: protectedProcedure
    .input(insertQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.query.questions.findFirst({
        where: eq(questions.slug, input.slug),
      });
      if (question) {
        throw new Error('Pertanyaan yang sama telah ada!');
      }

      return ctx.db.insert(questions).values(input);
    }),
  deleteAnswerById: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: questionId }) => {
      return ctx.db.delete(questions).where(eq(questions.id, questionId));
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
