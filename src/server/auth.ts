import * as argon2 from 'argon2';
import dayjs from 'dayjs';
import { ilike } from 'drizzle-orm';
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider, {
  type FacebookProfile,
} from 'next-auth/providers/facebook';
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google';

import { environment } from '@/environment.mjs';
import { createInitial } from '@/lib/utils';
import { db } from '@/server/db';

import { CustomDrizzleAdapter } from './custom-drizzle-adapter';
import { users } from './db/schema';

export type User = {
  // ...other properties
  // role: UserRole;
  id: string;
  initial: string;
  username: string;
  membership?:
    | {
        type?: 'standard' | 'plus';
        expiresAt?: Date;
      }
    | undefined;
} & DefaultSession['user'];

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  // @ts-expect-error i don't care
  type Session = {
    token: string;
    user: {
      // ...other properties
      id: string;
      initial: string;
      // Role: UserRole;
      username: string;
      membership?:
        | {
            type?: 'standard' | 'plus';
            expiresAt?: Date;
          }
        | undefined;
    } & DefaultSession['user'];
  };

  // Interface User {
  //   // ...other properties
  //   // role: UserRole;
  //   id: string;
  //   initial: string;
  //   username: string;
  // }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  // @ts-expect-error i don't care
  type JWT = {
    id: string;
  };
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // @ts-expect-error i don't care
  adapter: CustomDrizzleAdapter(db), // eslint-disable-line
  callbacks: {
    jwt({ account, token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token = { ...token, id: user.id };
      }

      if (account) {
        // @ts-expect-error i don't care
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, token.id),
          with: {
            memberships: true,
          },
        });

        if (!user) {
          throw new Error('User tidak ditemukan');
        }

        const membership = user.memberships.find((membership) =>
          dayjs().isBefore(membership.expiresAt),
        );

        session = {
          ...session,
          user: {
            email: user.email,
            // @ts-expect-error i don't care
            id: user.id,
            image: user.image,
            // @ts-expect-error i don't care
            initial: createInitial(user.name),
            name: user.name,
            username: user.username,
            membership,
          },
        };
      }

      return session;
    },
  },
  pages: {
    error: undefined, // Error code passed in query string as ?error=
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
    signIn: '/auth/sign-in',
    // SignOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  providers: [
    // eslint-disable-next-line
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username atau Password tidak boleh kosong');
        }

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.username, credentials.username),
        });

        if (!user) {
          throw new Error('User tidak ditemukan');
        }

        if (['google', 'facebook'].includes(user.password)) {
          throw new Error(`User login menggunakan ${user.password}`);
        }

        const isPasswordMatch = await argon2.verify(
          user.password,
          credentials.password,
        );

        if (!isPasswordMatch) {
          throw new Error('Password tidak valid');
        }

        return { id: user.id };
      },

      credentials: {
        password: { label: 'Password', type: 'password' },
        username: { label: 'Username', placeholder: 'jsmith', type: 'text' },
      },
      name: 'Credentials',
    }),
    // eslint-disable-next-line
    GoogleProvider({
      clientId: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
      async profile(profile: GoogleProfile) {
        // Const isEmailUsed = await db.query.users.findFirst({
        // 	where: eq(users.email, profile.email),
        // 	columns: { id: true },
        // });
        // if (isEmailUsed) {
        // 	throw new Error('Email telah digunakan');
        // }

        let username = profile.email
          .split('@')[0]
          ?.replace(/[^a-zA-Z0-9-_]/g, '')
          .slice(0, 23);
        const isUsernameUsed = await db.query.users.findMany({
          where: ilike(users.username, `%${username}%`),
          columns: { id: true },
        });
        if (isUsernameUsed.length > 0) {
          username = `${username}-${isUsernameUsed.length + 1}`;
        }

        return {
          id: profile.sub,
          name: profile.name,
          username,
          email: profile.email,
          image: profile.picture,
          password: 'google',
        };
      },
    }),
    // eslint-disable-next-line
    FacebookProvider({
      clientId: environment.FB_CLIENT_ID,
      clientSecret: environment.FB_CLIENT_SECRET,
      async profile(profile: FacebookProfile) {
        let username = (profile.email as string)
          .split('@')[0]
          ?.replace(/[^a-zA-Z0-9-_]/g, '')
          .slice(0, 23);
        const isUsernameUsed = await db.query.users.findMany({
          where: ilike(users.username, `%${username}%`),
          columns: { id: true },
        });
        if (isUsernameUsed.length > 0) {
          username = `${username}-${isUsernameUsed.length + 1}`;
        }

        return {
          id: profile.id,
          // eslint-disable-next-line
          name: profile.name,
          username,
          // eslint-disable-next-line
          email: profile.email,
          image: profile.picture.data.url,
          password: 'facebook',
        };
      },
    }),
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
  secret: environment.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async () => getServerSession(authOptions);
