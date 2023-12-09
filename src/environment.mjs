import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const environment = createEnv({
	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
		NEXT_PUBLIC_BASE_PATH: z.string().url(),
		NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string(),
	},

	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		FB_CLIENT_ID: process.env.FB_CLIENT_ID,
		FB_CLIENT_SECRET: process.env.FB_CLIENT_SECRET,
		NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
		TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
		ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
		ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
		UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
		UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET
		// DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
		// DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
	},
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z
			.string()
			.url()
			.refine(
				(string_) => !string_.includes('YOUR_POSTGRES_URL_HERE'),
				'You forgot to change the default URL',
			),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === 'production'
				? z.string()
				: z.string().optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(string_) => process.env.VERCEL_URL ?? string_,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string() : z.string().url(),
		),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		FB_CLIENT_ID: z.string(),
		FB_CLIENT_SECRET: z.string(),
		TURNSTILE_SECRET_KEY: z.string(),
		ALGOLIA_APP_ID: z.string(),
		ALGOLIA_API_KEY: z.string(),
		UPLOADTHING_APP_ID: z.string(),
		UPLOADTHING_SECRET: z.string()
		// Add ` on ID and SECRET if you want to make sure they're not empty
		// DISCORD_CLIENT_ID: z.string(),
		// DISCORD_CLIENT_SECRET: z.string(),
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
