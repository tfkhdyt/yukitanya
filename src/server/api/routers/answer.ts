import { and, asc, desc, eq, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
// @ts-expect-error untyped library
import badwords from 'indonesian-badwords';

import {
  answers,
  insertAnswerSchema,
  notifications,
  questions,
  updateAnswerSchema,
} from '@/server/db/schema';

import { verifyCaptchaToken } from '@/lib/turnstile';
import cuid from 'cuid';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { model } from '@/lib/gemini';

export const answerRouter = createTRPCRouter({
  createAnswer: protectedProcedure
    .input(
      z.object({
        schema: insertAnswerSchema,
        token: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (badwords.flag(input.schema.content) as boolean) {
        throw new Error('Jawaban anda mengandung kata terlarang!');
      }

      await verifyCaptchaToken(input.token);

      const question = await ctx.db.query.questions.findFirst({
        where: eq(questions.id, input.schema.questionId),
      });

      const answer = await ctx.db
        .insert(answers)
        .values(input.schema)
        .returning();

      if (input.schema.userId !== question?.userId && answer[0] && question) {
        await ctx.db.insert(notifications).values({
          id: `notification-${cuid()}`,
          questionId: input.schema.questionId,
          description: answer[0].content.slice(0, 100),
          receiverUserId: question.userId,
          transmitterUserId: input.schema.userId,
          type: 'new-answer',
        });
      }
    }),
  deleteAnswerById: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: answerId }) =>
      ctx.db.delete(answers).where(eq(answers.id, answerId)),
    ),
  findBestAnswerByQuestionId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: questionId }) => {
      const bestAnswer = await ctx.db.query.answers.findFirst({
        where: and(
          eq(answers.isBestAnswer, true),
          eq(answers.questionId, questionId),
        ),
        with: {
          owner: {
            with: {
              memberships: true,
            },
          },
          ratings: true,
        },
      });

      if (!bestAnswer) {
        return null;
      }

      return bestAnswer;
    }),
  findAllAnswersByQuestionId: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(4),
        cursor: z.string().nullish(),
        questionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.cursor
        ? and(
            eq(answers.questionId, input.questionId),
            eq(answers.isBestAnswer, false),
            gte(answers.id, input.cursor),
          )
        : and(
            eq(answers.questionId, input.questionId),
            eq(answers.isBestAnswer, false),
          );

      const data = await ctx.db.query.answers.findMany({
        where,
        orderBy: [asc(answers.createdAt)],
        limit: input.limit + 1,
        with: {
          owner: {
            with: {
              memberships: true,
            },
          },
          ratings: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined;
      if (data.length > input.limit) {
        const nextItem = data.pop();
        nextCursor = nextItem?.id;
      }

      return {
        data,
        nextCursor,
      };
    }),
  findAllAnswersByUserId: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(4),
        cursor: z.string().nullish(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.answers.findMany({
        where: input.cursor
          ? and(eq(answers.userId, input.userId), lte(answers.id, input.cursor))
          : eq(answers.userId, input.userId),
        orderBy: [desc(answers.createdAt)],
        limit: input.limit + 1,
        with: {
          owner: {
            with: {
              memberships: true,
            },
          },
          ratings: true,
          question: {
            with: {
              subject: true,
              owner: {
                with: {
                  memberships: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined;
      if (data.length > input.limit) {
        const nextItem = data.pop();
        nextCursor = nextItem?.id;
      }

      return { data, nextCursor };
    }),
  updateAnswerById: protectedProcedure
    .input(updateAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (badwords.flag(input.content) as boolean) {
        throw new Error('Jawaban anda mengandung kata terlarang!');
      }

      await verifyCaptchaToken(input.token);

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
        await ctx.db
          .delete(notifications)
          .where(
            and(
              eq(notifications.questionId, input.questionId),
              eq(notifications.receiverUserId, answer[0].userId),
              eq(notifications.transmitterUserId, input.userId),
              eq(notifications.type, 'best-answer'),
            ),
          );

        await ctx.db.insert(notifications).values({
          id: `notification-${cuid()}`,
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
  askAI: protectedProcedure
    .input(z.string())
    .query(async ({ input: question }) => {
      const result = await model.generateContent(question);
      const response = result.response.text();

      return response;
    }),
});
