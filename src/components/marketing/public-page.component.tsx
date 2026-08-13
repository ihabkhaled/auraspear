import Link from 'next/link'
import { ArrowRight, CheckCircle2, Network, ShieldCheck } from 'lucide-react'
import { getMarketingContent } from '@/lib/marketing-content'
import { buildPublicPath, type SupportedLocale } from '@/lib/marketing.utils'
import { publicPageJsonLd, serializeJsonLd } from '@/lib/seo'
import type { MarketingPage } from '@/types/marketing.types'

export function PublicPage({ page, locale }: { page: MarketingPage; locale: SupportedLocale }) {
  const copy = getMarketingContent(locale).shared
  const contactPath = buildPublicPath(locale, '/contact')
  const schemas = publicPageJsonLd(page, locale)
  return (
    <main>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {serializeJsonLd(schema)}
        </script>
      ))}
      <section className="relative overflow-hidden border-x border-b px-4 py-20 sm:border-x-0 sm:px-6 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_38%)]" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-bold tracking-[0.22em] text-blue-400 uppercase">
            {page.category} / AuraSpear SOC
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl leading-[1.05] font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            {page.title}
          </h1>
          <p className="text-muted-foreground mt-7 max-w-3xl text-lg leading-8 sm:text-xl">
            {page.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={contactPath}
              className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-5 py-3 font-bold"
            >
              {copy.requestDemo} <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/app/login"
              className="bg-card inline-flex items-center gap-2 rounded-md border px-5 py-3 font-bold"
            >
              {copy.goToApp}
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs tracking-widest text-blue-400 uppercase">
            {copy.fromSignalToDecision}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">{copy.contextTitle}</h2>
          <p className="text-muted-foreground mt-5 leading-7">{copy.contextBody}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {page.capabilities.map(capability => (
            <article key={capability} className="bg-card rounded-xl border p-6">
              <CheckCircle2 className="size-5 text-blue-400" />
              <h3 className="mt-4 font-bold">{capability}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{copy.capabilityBody}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-muted/40 border">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
          <article>
            <Network className="size-6 text-blue-400" />
            <h2 className="mt-4 text-xl font-bold">{copy.connectTitle}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{copy.connectBody}</p>
          </article>
          <article>
            <ShieldCheck className="size-6 text-blue-400" />
            <h2 className="mt-4 text-xl font-bold">{copy.tenantTitle}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{copy.tenantBody}</p>
          </article>
          <article>
            <CheckCircle2 className="size-6 text-blue-400" />
            <h2 className="mt-4 text-xl font-bold">{copy.accountableTitle}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{copy.accountableBody}</p>
          </article>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-bold">{copy.seeTitle}</h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">{copy.seeBody}</p>
        <Link
          href={contactPath}
          className="bg-primary text-primary-foreground mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 font-bold"
        >
          {copy.requestYourDemo} <ArrowRight className="size-4" />
        </Link>
      </section>
    </main>
  )
}
