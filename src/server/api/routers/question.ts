import { asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { answers, insertQuestionSchema, questions } from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const questionRouter = createTRPCRouter({
  createQuestion: protectedProcedure
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
  deleteQuestionById: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: questionId }) => {
      return ctx.db.delete(questions).where(eq(questions.id, questionId));
    }),
  findAllQuestions: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.questions.findMany({
      orderBy: [desc(questions.createdAt)],
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
    });
  }),
  findQuestionBySlug: publicProcedure
    .input(z.string())
    .query(({ ctx, input: slug }) => {
      return ctx.db.query.questions.findFirst({
        where: eq(questions.slug, slug),
        with: {
          owner: true,
          subject: true,
        },
      });
    }),
  findQuestionMetadata: publicProcedure
    .input(z.string())
    .query(({ ctx, input: questionId }) => {
      return ctx.db.query.questions.findFirst({
        where: eq(questions.id, questionId),
        columns: {
          id: true,
        },
        with: {
          answers: {
            orderBy: [asc(answers.isBestAnswer), asc(answers.createdAt)],
            with: {
              owner: true,
            },
          },
          favorites: {
            columns: {
              userId: true,
            },
          },
        },
      });
    }),
  findQuestionContentBySlug: publicProcedure
    .input(z.string())
    .query(({ ctx, input: slug }) => {
      return ctx.db
        .select({ content: questions.content })
        .from(questions)
        .where(eq(questions.slug, slug))
        .limit(1);
    }),
  updateQuestionById: protectedProcedure
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
    }),
});
