'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { useProviders } from '@/hooks/useProviders'
import type { ProvidersProps } from '@/types'

export function Providers({ children, messages, locale }: ProvidersProps) {
  const { queryClient } = useProviders()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
