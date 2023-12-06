/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import bundleAnalyzer from '@next/bundle-analyzer';

await import('./src/environment.mjs');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

/** @type {import("next").NextConfig} */
const config = {};

export default withBundleAnalyzer(config);
