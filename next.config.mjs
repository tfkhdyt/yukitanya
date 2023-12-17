/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import nextPWA from 'next-pwa';
import path from 'path';

await import('./src/environment.mjs');

// const withBundleAnalyzer = bundleAnalyzer({
// 	enabled: process.env.ANALYZE === 'true',
// });

const withPWA = nextPWA({
	dest: 'public',
	buildExcludes: ['app-build-manifest.json'],
});

const generateAppDirEntry = (/** @type {() => Promise<any>} */ entry) => {
	const packagePath = require.resolve('next-pwa');
	const packageDirectory = path.dirname(packagePath);
	const registerJs = path.join(packageDirectory, 'register.js');

	return entry().then((entries) => {
		// Register SW on App directory, solution: https://github.com/shadowwalker/next-pwa/pull/427
		if (entries['main-app'] && !entries['main-app'].includes(registerJs)) {
			if (Array.isArray(entries['main-app'])) {
				entries['main-app'].unshift(registerJs);
			} else if (typeof entries['main-app'] === 'string') {
				entries['main-app'] = [registerJs, entries['main-app']];
			}
		}
		return entries;
	});
};

// /** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: 'utfs.io',
			},
		],
	},
	webpack: (
		/** @type {{ entry: { (): Promise<any>; (): Promise<any>; }; }} */ config,
	) => {
		const entry = generateAppDirEntry(config.entry);
		config.entry = () => entry;

		return config;
	},
};

export default withPWA(config);
