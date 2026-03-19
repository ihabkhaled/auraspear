import withSerwistInit from '@serwist/next'
import type { NextConfig } from 'next'

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
})

/**
 * Content-Security-Policy directives.
 *
 * Why 'unsafe-inline' for script-src:
 *   Next.js injects inline <script> tags for hydration data, chunk loading,
 *   and the __NEXT_DATA__ payload. next-themes also injects an inline script
 *   to prevent FOUC. Without 'unsafe-inline', these break in production.
 *   A nonce-based CSP (via middleware) is the ideal upgrade path but requires
 *   per-request nonce generation — tracked as a future enhancement.
 *
 * Why 'unsafe-inline' for style-src:
 *   Tailwind CSS and shadcn/ui apply inline styles for dynamic values
 *   (e.g., CSS custom properties on elements, style attributes from Radix UI).
 */
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
]

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '0' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {},
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withSerwist(nextConfig)
