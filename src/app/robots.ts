import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/api/', '/callback', '/serwist/', '/_next/'],
    },
    sitemap: 'https://auraspear-demo.vercel.app/sitemap.xml',
    host: 'https://auraspear-demo.vercel.app',
  }
}
