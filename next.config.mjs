/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import nextPWA from 'next-pwa';

await import('./src/environment.mjs');

// const withBundleAnalyzer = bundleAnalyzer({
// 	enabled: process.env.ANALYZE === 'true',
// });

const withPWA = nextPWA({
	dest: 'public',
});

// /** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: 'utfs.io',
			},
		],
	},
};

export default withPWA(config);
