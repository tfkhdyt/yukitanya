import { db } from '@/server/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import * as argon2 from 'argon2';
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export type User = {
  // ...other properties
  // role: UserRole;
  id: string;
  initial: string;
  username: string;
} & DefaultSession['user'];

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      // ...other properties
      // role: UserRole;
      id: string;
      initial: string;
      username: string;
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  //   id: string;
  //   initial: string;
  //   username: string;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        initial: user.name
          ?.split(' ')
          .map((name) => name.slice(0, 1))
          .join(),
      },
    }),
  },
  pages: {
    error: undefined, // Error code passed in query string as ?error=
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
    signIn: '/auth/sign-in',
    // signOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, _) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.username, credentials.username),
        });

        if (!user) {
          throw new Error('User tidak ditemukan');
        }

        const isPasswordMatch = await argon2.verify(
          user.password,
          credentials.password,
        );

        if (!isPasswordMatch) {
          throw new Error('Password tidak valid');
        }

        return user;
      },

      credentials: {
        password: { label: 'Password', type: 'password' },
        username: { label: 'Username', placeholder: 'jsmith', type: 'text' },
      },
      name: 'Credentials',
    }),
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
