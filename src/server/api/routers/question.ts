import { and, desc, eq, ilike } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { match } from 'ts-pattern';
import { z } from 'zod';

import { insertQuestionSchema, oldSlug, questions } from '@/server/db/schema';

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
  findAllQuestionsBySubject: publicProcedure
    .input(z.string())
    .query(({ ctx, input: subjectId }) => {
      return ctx.db.query.questions.findMany({
        orderBy: [desc(questions.createdAt)],
        where: eq(questions.subjectId, subjectId),
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
  findAllQuestionsByUserId: publicProcedure
    .input(z.string())
    .query(({ ctx, input: userId }) => {
      return ctx.db.query.questions.findMany({
        orderBy: [desc(questions.createdAt)],
        where: eq(questions.userId, userId),
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
  findAllQuestionsByQueryAndSubject: publicProcedure
    .input(
      z.object({
        query: z.string(),
        subjectId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const condition = match(input.subjectId)
        .with('all', () => ilike(questions.content, `%${input.query}%`))
        .otherwise((subjectId) =>
          and(
            ilike(questions.content, `%${input.query}%`),
            eq(questions.subjectId, subjectId),
          ),
        );

      return ctx.db.query.questions.findMany({
        orderBy: [desc(questions.createdAt)],
        where: condition,
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
    .query(async ({ ctx, input: slug }) => {
      const question = await ctx.db.query.questions.findFirst({
        where: eq(questions.slug, slug),
        with: {
          owner: true,
          subject: true,
        },
      });

      if (!question) {
        const questionId = await ctx.db
          .select({ questionId: oldSlug.questionId })
          .from(oldSlug)
          .where(eq(oldSlug.slug, slug))
          .limit(1);

        if (!questionId[0]) return;

        return ctx.db.query.questions.findFirst({
          where: eq(questions.id, questionId[0].questionId),
          with: {
            owner: true,
            subject: true,
          },
        });
      }

      return question;
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
            columns: {
              id: true,
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
    .query(async ({ ctx, input: slug }) => {
      const question = await ctx.db
        .select({ content: questions.content })
        .from(questions)
        .where(eq(questions.slug, slug))
        .limit(1);

      if (!question[0]) {
        const questionId = await ctx.db
          .select({ questionId: oldSlug.questionId })
          .from(oldSlug)
          .where(eq(oldSlug.slug, slug))
          .limit(1);

        if (!questionId[0]) return;

        return ctx.db
          .select({ content: questions.content })
          .from(questions)
          .where(eq(questions.id, questionId[0].questionId))
          .limit(1);
      }

      return question;
    }),
  updateQuestionById: protectedProcedure
    .input(insertQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db
        .select({ slug: questions.slug })
        .from(questions)
        .where(eq(questions.id, input.id))
        .limit(1);

      if (question.length === 0 || !question[0])
        throw new Error('Pertanyaan tidak ditemukan');

      await ctx.db.insert(oldSlug).values({
        id: `old-slug-${nanoid()}`,
        questionId: input.id,
        slug: question[0].slug,
      });

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
