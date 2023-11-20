import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  findUserByCredentials: publicProcedure
    .input(
      z.object({
        password: z.string().min(1),
        username: z.string().min(1).max(25),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: (users, { and, eq }) =>
          and(
            eq(users.username, input.username),
            eq(users.password, input.password),
          ),
      });
    }),
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     await ctx.db.insert(posts).values({
  //       createdById: ctx.session.user.id,
  //       name: input.name,
  //     });
  //   }),
  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),
  // getSecretMessage: protectedProcedure.query(() => {
  //   return 'you can now see this secret message!';
  // }),
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),
});
