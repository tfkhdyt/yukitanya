import { signupSchema } from '@/schema/signup-schema';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { users } from '@/server/db/schema';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      let user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (user) {
        throw new Error('Email telah digunakan');
      }

      user = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
      });
      if (user) {
        throw new Error('Username telah digunakan');
      }

      const hashedPwd = await argon2.hash(input.password);

      await ctx.db.insert(users).values({
        email: input.email,
        id: `user-${nanoid()}`,
        name: `${input.firstName.trim()} ${input.lastName?.trim()}`.trim(),
        password: hashedPwd,
        username: input.username,
      });
    }),
  signIn: publicProcedure
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
