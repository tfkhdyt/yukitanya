/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  generateRobotsTxt: true, // (optional)
  exclude: ['/server-sitemap-index.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://example.com/server-sitemap-index.xml', // <==== Add here
    ],
  },
};
