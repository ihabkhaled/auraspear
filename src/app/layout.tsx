import { cookies, headers } from 'next/headers'
import { Toaster } from 'sonner'
import { CORE_SEO_KEYWORDS, PUBLIC_SITE_URL } from '@/lib/constants/seo'
import { isRtlLocale, resolveDocumentLocale } from '@/lib/marketing.utils'
import { Providers } from './providers'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#135bec',
}

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: {
    default: 'AuraSpear SOC — AI-Powered Security Operations',
    template: '%s | AuraSpear SOC',
  },
  description:
    'Unified multi-tenant security operations for detection, investigation, threat intelligence, automation, governance, and AI-assisted response.',
  keywords: [...CORE_SEO_KEYWORDS],
  authors: [{ name: 'Ihab Khaled', url: 'https://www.linkedin.com/in/ihabkhaled94/' }],
  creator: 'Ihab Khaled',
  publisher: 'AuraSpear SOC',
  applicationName: 'AuraSpear SOC',
  category: 'Cybersecurity',
  classification: 'Security Operations Software',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-2415314275784926',
    'contact:email': 'ihab.khaled94@gmail.com',
    'contact:phone_number': '+201001568256',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AuraSpear SOC',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'AuraSpear SOC',
    description: 'Security Operations Center',
    siteName: 'AuraSpear SOC',
    type: 'website',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'AuraSpear SOC',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'AuraSpear SOC',
    description: 'Security Operations Center',
    images: ['/icons/icon-512.png'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const cookieLocale = cookieStore.get('locale')?.value ?? ''
  const pathname = headerStore.get('x-auraspear-pathname') ?? '/'
  const locale = resolveDocumentLocale(pathname, cookieLocale)
  const dir = isRtlLocale(locale) ? 'rtl' : 'ltr'
  const messages = (await import(`@/i18n/${locale}.json`)).default as Record<string, unknown>

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2415314275784926"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers messages={messages} locale={locale}>
          {children}
          <Toaster
            position={dir === 'rtl' ? 'top-left' : 'top-right'}
            dir={dir}
            toastOptions={{
              className: 'bg-card text-card-foreground border-border',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
