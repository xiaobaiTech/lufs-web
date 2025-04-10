/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lufs-meter.top',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: ['/'],
      },
    ],
  },
  changefreq: 'monthly',
  priority: 0.7,
  lastmod: new Date().toISOString(),
  exclude: ['/404'],
} 