import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import { ContactFormContainer } from '@/components/marketing/contact-form.container'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { buildLanguageAlternates } from '@/lib/marketing.utils'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Request an AuraSpear demo',
  description:
    'Contact AuraSpear for a security operations platform demo, integrations discussion, or deployment questions.',
  alternates: { canonical: '/contact', languages: buildLanguageAlternates('/contact') },
}
export default function ContactPage() {
  return (
    <PublicShell locale="en">
      <main className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <section>
          <p className="text-primary font-mono text-xs font-bold tracking-widest uppercase">
            Contact / Request a demo
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Bring your security operations challenge
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
            Share your team structure, tenant model, telemetry sources, and response goals. We will
            arrange a focused AuraSpear walkthrough.
          </p>
          <div className="mt-10 space-y-4">
            <a
              className="flex items-center gap-3 font-semibold"
              href="mailto:ihab.khaled94@gmail.com"
            >
              <Mail className="text-primary size-5" />
              ihab.khaled94@gmail.com
            </a>
            <a className="flex items-center gap-3 font-semibold" href="tel:+201001568256">
              <Phone className="text-primary size-5" />
              +20 100 156 8256
            </a>
            <a
              className="flex items-center gap-3 font-semibold"
              href="https://github.com/ihabkhaled/auraspear"
            >
              <Github className="text-primary size-5" />
              github.com/ihabkhaled/auraspear
            </a>
            <a
              className="flex items-center gap-3 font-semibold"
              href="https://www.linkedin.com/search/results/people/?keywords=Ihab%20Khaled"
            >
              <Linkedin className="text-primary size-5" />
              Find Ihab Khaled on LinkedIn
            </a>
          </div>
        </section>
        <section className="bg-card rounded-2xl border p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Request your demo</h2>
          <p className="text-muted-foreground mt-2 mb-6 text-sm">
            We use these details only to respond to your request.
          </p>
          <ContactFormContainer />
        </section>
      </main>
    </PublicShell>
  )
}
