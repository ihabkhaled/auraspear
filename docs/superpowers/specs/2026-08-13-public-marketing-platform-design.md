# AuraSpear Public Marketing Platform Design

## Objective

Turn AuraSpear from an internal-only console into a crawlable multilingual product site while preserving the authenticated application as a private surface. The public site must explain the platform deeply, provide at least 25 substantive pages, support thirteen locales, expose complete discovery artifacts, and convert visitors through clear demo and contact paths.

## URL architecture

- English is canonical without a locale prefix: `/`, `/about`, `/features/alert-management`.
- `/en` and `/en/*` permanently redirect to the equivalent unprefixed English URL.
- Other public locales use a first segment: `/fr`, `/ar/about`, `/ja/features/alert-management`.
- Supported locales are English, Spanish, Italian, French, Arabic, German, Russian, Simplified Chinese, Korean, Thai, Portuguese, Persian, and Japanese.
- Arabic and Persian render RTL. All other locales render LTR.
- The authenticated console is publicly addressed only below `/app`: `/app/login`, `/app/dashboard`, and `/app/*` for all other internal routes.
- Legacy internal paths permanently redirect to `/app/*`. API, service-worker, framework, and static-asset paths remain unchanged.
- Public pages link to `/app/login`; the application top bar links back to `/`.

## Public information architecture

The shared page catalog contains landing, about, contact, security, tenant isolation, integrations overview, platform overview, and detailed feature and integration pages. It includes more than 25 stable page slugs across these groups:

- Platform: overview, architecture, multi-tenant SOC, security, tenant isolation.
- Operations: dashboards, alert management, incident management, case management, case cycles, reporting, notifications, jobs, system health.
- Detection and intelligence: detection rules, correlation engine, threat hunting, threat intelligence, entities and risk, vulnerabilities, UEBA, cloud security, compliance, attack paths.
- Automation and AI: SOAR, AI co-analyst, AI agents, AI chat, AI search, AI findings, AI memory and RAG, AI evaluation, AI simulations, AI governance, AI FinOps.
- Data and integrations: connector framework, data explorer, normalization pipelines, Wazuh, Logstash, Graylog, Grafana, MISP, Shuffle, Velociraptor, InfluxDB, and LLM providers.
- Company and conversion: about, contact/request demo, open source, and responsible security.

Each detail page includes a unique title, summary, operational explanation, capability list, workflow, outcomes, related pages, and conversion CTA. Page content is server-rendered and discoverable without JavaScript.

## Design direction

AuraSpear's public identity uses the visual language of a security operations evidence graph rather than a generic SaaS gradient. The memorable signature is an interactive-looking but server-rendered “signal spine”: a disciplined line of event nodes connecting telemetry, reasoning, decision, and response through the hero and major sections.

The palette extends the product's existing blue with deep navy, telemetry cyan, verified green, warm evidence amber, and neutral slate. Manrope remains the highly readable body face, while JetBrains Mono labels evidence, routes, protocols, and operational metadata. Layouts are dense but ordered: compact utility labels, long-form readable columns, capability matrices, and a directory-scale footer. Motion is restrained and disabled under reduced-motion preferences. Both themes are first-class.

## Content and localization model

A typed catalog is the source of truth for routes, page metadata, navigation, footer groups, related links, sitemap entries, and feed entries. Shared interface strings use the existing locale JSON system. New locales must contain the complete application key tree so selecting a locale never produces missing-key failures. Public-page copy is selected by locale with an explicit English fallback, allowing incremental editorial improvement without broken pages.

Locale switching preserves the current public page slug. Inside the application it updates the locale cookie and refreshes the current `/app/*` route. Locale names are displayed in their native form.

## SEO and discovery

- Every public page has unique localized metadata, canonical URL, complete `hreflang` alternates, Open Graph data, Twitter card data, and crawlable headings.
- Organization, WebSite, SoftwareApplication, BreadcrumbList, FAQPage, and ContactPage JSON-LD are emitted where applicable.
- `sitemap.xml` contains every public page in every locale and excludes authenticated/application and API routes.
- `feed.xml` contains the full public catalog as RSS entries with localized variants and stable GUIDs.
- `robots.txt` allows all well-behaved crawlers for public content and disallows `/app/`, `/api/`, framework internals, callback routes, and service-worker endpoints.
- `/ads.txt` contains the supplied publisher declaration.
- The AdSense loader and account meta tag are present globally, and CSP permits the required Google origins.
- The root metadata includes descriptive title templates, keywords, authorship, robots policy, application identity, and social previews.
- Public pages use semantic HTML, accessible focus states, correct language/direction, descriptive link text, and lightweight server components to protect Core Web Vitals.

No implementation can guarantee a literal “10/10” SEO score or rankings; the acceptance target is technical completeness, indexability, rich metadata, strong content coverage, and clean automated audits.

## Contact and trust

The contact page provides the form plus direct email, telephone, GitHub, and LinkedIn surfaces. The configured email is `ihab.khaled94@gmail.com`, inferred by correcting the supplied `mgail.com` typo. Telephone is `+20 100 156 8256`. GitHub resolves to the repository owner and project repository. LinkedIn links directly to the verified profile at `https://www.linkedin.com/in/ihabkhaled94/`.

## Internal/public isolation

Search engines never receive internal routes in sitemaps or feeds. Internal pages emit `noindex, nofollow`, require the existing authentication and role guards, and remain tenant-aware. The routing migration does not change API paths or backend contracts. Public content contains product descriptions only and never exposes tenant data, customer telemetry, credentials, internal configuration, or authenticated navigation state.

## Testing and release

- Unit tests cover locale routing, canonical URL generation, catalog uniqueness, sitemap/feed inclusion, robots exclusions, and application path mapping.
- Playwright coverage checks representative public, localized RTL, feature, contact, and `/app/login` routes.
- Repository `validate:full`, Husky pre-commit, and GitHub-equivalent coverage commands run before release.
- The release is committed and pushed to `main`, GitHub checks are observed, then a production Vercel deployment is verified with live HTTP checks for canonical URLs, redirects, metadata, sitemap, feed, robots, ads, and application isolation.
