import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const sourceBySurface = {
  'marketing topbar': readFileSync('src/components/marketing/public-shell.component.tsx', 'utf8'),
  'login topbar': readFileSync('src/app/(auth)/login/page.tsx', 'utf8'),
  'application topbar': readFileSync('src/components/layout/Topbar.tsx', 'utf8'),
} as const

describe('public navigation surfaces', () => {
  it('links contact visitors directly to Ihab Khaled LinkedIn profile', () => {
    const contactPage = readFileSync(
      'src/components/marketing/contact-public-page.component.tsx',
      'utf8'
    )

    expect(contactPage).toContain('https://www.linkedin.com/in/ihabkhaled94/')
    expect(contactPage).not.toContain('linkedin.com/search/results/people')
  })

  it.each(Object.entries(sourceBySurface))(
    'provides an accessible landing-page home link in the %s',
    (_surface, source) => {
      expect(source).toMatch(/href=(?:"\/"|\{buildPublicPath\(locale, '\/'\)\})/u)
      expect(source).toMatch(/aria-label=\{[^}]*home[^}]*\}|aria-label="[^"]*home[^"]*"/iu)
      expect(source).toContain('<Home')
    }
  )
})
