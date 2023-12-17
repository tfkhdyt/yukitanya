/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import withPWAInit from '@ducanh2912/next-pwa';

await import('./src/environment.mjs');

// const withBundleAnalyzer = bundleAnalyzer({
// 	enabled: process.env.ANALYZE === 'true',
// });

const withPWA = withPWAInit({
	dest: 'public',
	// cacheOnFrontEndNav: true,
	// aggressiveFrontEndNavCaching: true,
	fallbacks: {
		document: '/~offline',
	},
});

// const withSerwist = withSerwistInit({
// 	cacheOnFrontEndNav: true,
// 	swSrc: 'src/app/sw.ts',
// 	swDest: 'public/sw.js',
// 	disable: process.env.NODE_ENV === 'development',
// });

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: 'utfs.io',
			},
		],
	},
};

export default withPWA(config);
