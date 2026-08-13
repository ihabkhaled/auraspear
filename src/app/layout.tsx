import { cookies, headers } from 'next/headers'
import { Toaster } from 'sonner'
import { isRtlLocale, resolveDocumentLocale } from '@/lib/marketing.utils'
import { Providers } from './providers'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#135bec',
}

const siteUrl =
  process.env['NEXT_PUBLIC_APP_URL'] ??
  (process.env['VERCEL_URL'] ? `https://${process.env['VERCEL_URL']}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AuraSpear SOC — AI-Powered Security Operations',
    template: '%s | AuraSpear SOC',
  },
  description:
    'Unified multi-tenant security operations for detection, investigation, threat intelligence, automation, governance, and AI-assisted response.',
  keywords: [
    'security operations center',
    'SOC platform',
    'SIEM',
    'SOAR',
    'threat hunting',
    'Wazuh',
    'Logstash',
    'multi-tenant SOC',
    'AI cybersecurity',
  ],
  authors: [{ name: 'Ihab Khaled', url: 'https://github.com/ihabkhaled' }],
  creator: 'Ihab Khaled',
  publisher: 'AuraSpear SOC',
  applicationName: 'AuraSpear SOC',
  category: 'Cybersecurity',
  other: { 'google-adsense-account': 'ca-pub-2415314275784926' },
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
