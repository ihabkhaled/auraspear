import { cookies } from 'next/headers'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const SUPPORTED_LOCALES = ['en', 'es', 'it', 'fr', 'ar', 'de'] as const

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#135bec',
}

export const metadata: Metadata = {
  title: 'AuraSpear SOC',
  description: 'Security Operations Center',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AuraSpear SOC',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('locale')?.value ?? ''
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)
    ? cookieLocale
    : 'en'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const messages = (await import(`@/i18n/${locale}.json`)).default as Record<string, unknown>

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers messages={messages} locale={locale}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-card text-card-foreground border-border',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
