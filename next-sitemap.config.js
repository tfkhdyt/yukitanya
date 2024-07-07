/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  generateRobotsTxt: true, // (optional)
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [`${process.env.NEXTAUTH_URL}/server-sitemap.xml`],
  },
  generateIndexSitemap: false,
};
