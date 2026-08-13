import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import { ContactFormContainer } from '@/components/marketing/contact-form.container'
import { getMarketingContent } from '@/lib/marketing-content'
import type { SupportedLocale } from '@/lib/marketing.utils'

export function ContactPublicPage({ locale }: { locale: SupportedLocale }) {
  const copy = getMarketingContent(locale).shared
  return (
    <main className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
      <section>
        <p className="text-primary font-mono text-xs font-bold tracking-widest uppercase">
          {copy.contactEyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
          {copy.contactTitle}
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">{copy.contactBody}</p>
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
            href="https://www.linkedin.com/in/ihabkhaled94/"
          >
            <Linkedin className="text-primary size-5" />
            {copy.linkedinLabel}
          </a>
        </div>
      </section>
      <section className="bg-card rounded-2xl border p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{copy.requestYourDemo}</h2>
        <p className="text-muted-foreground mt-2 mb-6 text-sm">{copy.contactPrivacy}</p>
        <ContactFormContainer
          emailPlaceholder={copy.emailPlaceholder}
          subjectPlaceholder={copy.subjectPlaceholder}
          messagePlaceholder={copy.messagePlaceholder}
        />
      </section>
    </main>
  )
}
