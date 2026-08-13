import Link from 'next/link'
import { ArrowRight, CheckCircle2, Network, ShieldCheck } from 'lucide-react'
import { buildPublicPath, type SupportedLocale } from '@/lib/marketing.utils'
import type { MarketingPage } from '@/types/marketing.types'

export function PublicPage({ page, locale }: { page: MarketingPage; locale: SupportedLocale }) {
  const contactPath = buildPublicPath(locale, '/contact')
  return (
    <main>
      <section className="relative overflow-hidden border-b px-4 py-20 sm:px-6 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_38%)]" />
        <div className="mx-auto max-w-7xl">
          <p className="text-primary font-mono text-xs font-bold tracking-[0.22em] uppercase">
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
              Request a demo <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/app/login"
              className="bg-card inline-flex items-center gap-2 rounded-md border px-5 py-3 font-bold"
            >
              Go to app
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-primary font-mono text-xs tracking-widest uppercase">
            From signal to decision
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Built for security work that cannot lose context
          </h2>
          <p className="text-muted-foreground mt-5 leading-7">
            AuraSpear connects telemetry, findings, analyst reasoning, approvals, and response
            history. Teams gain a defensible operational record while reducing the handoffs that
            slow investigations.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {page.capabilities.map(capability => (
            <article key={capability} className="bg-card rounded-xl border p-6">
              <CheckCircle2 className="text-primary size-5" />
              <h3 className="mt-4 font-bold">{capability}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Designed for repeatable operations, clear ownership, and evidence that remains
                connected throughout the security lifecycle.
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-muted/40 border-y">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
          <article>
            <Network className="text-primary size-6" />
            <h2 className="mt-4 text-xl font-bold">Connect your stack</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Bring existing detection, observability, intelligence, automation, and AI providers
              into one governed workspace.
            </p>
          </article>
          <article>
            <ShieldCheck className="text-primary size-6" />
            <h2 className="mt-4 text-xl font-bold">Preserve tenant boundaries</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Role-aware access and tenant-scoped operations keep sensitive security contexts
              separated.
            </p>
          </article>
          <article>
            <CheckCircle2 className="text-primary size-6" />
            <h2 className="mt-4 text-xl font-bold">Keep humans accountable</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Approval gates, attribution, confidence, and audit trails keep automation explainable.
            </p>
          </article>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-bold">See AuraSpear in your environment</h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
          Tell us about your telemetry, teams, tenants, and response workflows. We will shape a
          focused walkthrough around your operational reality.
        </p>
        <Link
          href={contactPath}
          className="bg-primary text-primary-foreground mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 font-bold"
        >
          Request your demo <ArrowRight className="size-4" />
        </Link>
      </section>
    </main>
  )
}
