# AuraSpear Public Marketing Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a dense, multilingual, SEO-complete public AuraSpear site while moving the authenticated console to `/app/*`.

**Architecture:** A typed marketing catalog drives server-rendered public routes, metadata, navigation, footer, sitemap, and RSS. Next.js redirects and rewrites expose the existing authenticated route tree under `/app/*` without changing API contracts, while locale-aware route shells render English unprefixed and twelve additional prefixed editions.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, next-intl, Tailwind CSS 4, Vitest, Playwright, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-13-public-marketing-platform-design.md`

## Global Constraints

- Canonical English routes are unprefixed; `/en/*` permanently redirects.
- All authenticated pages are addressed below `/app/*` and excluded from indexing.
- Public catalog has at least 25 substantive pages in all 13 supported locale route sets.
- API and backend contracts remain unchanged.
- TSX files remain render-focused and all user-facing interface strings use localization data.
- All new behavior follows test-first red/green cycles.
- Release requires `npm run validate:full`, pre-commit execution, GitHub checks, production deploy, and live verification.

---

### Task 1: Route, locale, and catalog foundations

**Files:**

- Modify: `src/lib/constants/locales.ts`
- Create: `src/lib/constants/marketing.ts`
- Create: `src/lib/marketing.utils.ts`
- Create: `src/types/marketing.types.ts`
- Modify: `src/types/index.ts`
- Test: `test/marketing-utils.test.ts`

**Interfaces:**

- Produces `MARKETING_PAGES`, `buildPublicPath`, `resolvePublicRoute`, `buildLanguageAlternates`, and `toAppPath` for every later task.

- [ ] Write tests asserting 13 locales, unique catalog slugs, 25+ pages, root-English canonical paths, localized paths, RTL locale detection, `/en` normalization, and `/app` mapping.
- [ ] Run `npm test -- test/marketing-utils.test.ts` and confirm failures are caused by missing exports.
- [ ] Implement the typed catalog and pure routing utilities with no React dependency.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Application URL migration and cross-navigation

**Files:**

- Modify: `next.config.ts`
- Modify: `src/app/(portal)/layout.tsx`
- Modify: `src/app/(auth)/layout.tsx`
- Modify: `src/components/layout/Topbar.tsx`
- Modify: `src/hooks/useLoginForm.ts`
- Modify: internal link helpers/constants as identified by route search
- Test: `test/app-routing.test.ts`

**Interfaces:**

- Consumes `toAppPath`.
- Produces canonical `/app/*` browser URLs and public-home controls.

- [ ] Add failing tests for redirect/rewrite tables and route conversion.
- [ ] Run the focused tests to observe expected failures.
- [ ] Add explicit public-route exclusions, `/app/:path*` rewrites, legacy internal redirects, noindex metadata, and home links in top bars/login surfaces.
- [ ] Update programmatic navigation and stable internal href catalogs to `/app/*`.
- [ ] Re-run focused tests.

### Task 3: Public design system and shared chrome

**Files:**

- Modify: `src/app/globals.css`
- Replace: `src/components/marketing/marketing-nav.component.tsx`
- Replace: `src/components/marketing/marketing-footer.component.tsx`
- Create focused components under `src/components/marketing/`
- Create hooks under `src/hooks/` for interactive locale/theme/navigation controls
- Modify barrels and marketing prop types

**Interfaces:**

- Consumes catalog/navigation groups and locale-aware path builders.
- Produces shared header, signal-spine hero primitives, section shells, CTA, breadcrumbs, and dense footer.

- [ ] Add component tests for localized links, app CTA, theme/locale controls, keyboard labels, and dense footer coverage.
- [ ] Run tests and confirm missing behavior failures.
- [ ] Implement the token extension and render-only components.
- [ ] Re-run component tests and accessibility lint.

### Task 4: Landing, company, security, and contact pages

**Files:**

- Replace: `src/app/(marketing)/page.tsx`
- Replace: `src/app/(marketing)/about/page.tsx`
- Replace: `src/app/(marketing)/contact/page.tsx`
- Add public page shells and structured-data components
- Modify contact form translations and placeholders

**Interfaces:**

- Produces canonical English landing/company conversion routes consumed by localized route templates.

- [ ] Add failing route-render tests for semantic headings, direct communication links, organization/contact JSON-LD, and contact validation labels.
- [ ] Run tests to verify failures.
- [ ] Implement the dense landing narrative, about, security, isolation, integrations overview, and contact conversion content.
- [ ] Re-run focused tests.

### Task 5: Feature and integration detail routing

**Files:**

- Create: `src/app/(marketing)/features/[slug]/page.tsx`
- Create: `src/app/(marketing)/integrations/[slug]/page.tsx`
- Create: `src/app/(marketing)/platform/[slug]/page.tsx`
- Create shared feature-detail components
- Test: `test/marketing-catalog-pages.test.ts`

**Interfaces:**

- Consumes `MARKETING_PAGES` and renders catalog-driven detail documents.

- [ ] Add failing tests for valid slug generation, invalid slug 404 behavior, unique metadata, related links, workflow sections, and CTAs.
- [ ] Run focused tests to prove red.
- [ ] Implement static params, metadata, breadcrumb JSON-LD, and detailed page renderer.
- [ ] Re-run tests to green.

### Task 6: Thirteen-language public and application localization

**Files:**

- Modify: all `src/i18n/*.json`
- Create: `src/i18n/ru.json`, `zh.json`, `ko.json`, `th.json`, `pt.json`, `fa.json`, `ja.json`
- Create localized public route templates below `src/app/(marketing)/[locale]/`
- Modify locale switching hooks and root layout language/direction resolution
- Test: `test/locales.test.ts`

**Interfaces:**

- Consumes the English public route renderers and locale path utilities.
- Produces complete locale key parity and prefixed localized routes.

- [ ] Add failing parity tests comparing all locale key trees and verifying RTL/LTR direction.
- [ ] Run tests and confirm missing locale failures.
- [ ] Add complete locale trees, native locale labels, localized marketing vocabulary, route templates, and locale-preserving switch logic.
- [ ] Re-run parity and route tests.

### Task 7: Metadata, structured data, AdSense, and discovery artifacts

**Files:**

- Modify: `src/app/layout.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/feed.xml/route.ts`
- Create: `public/ads.txt`
- Modify: `next.config.ts` CSP
- Test: `test/seo-artifacts.test.ts`

**Interfaces:**

- Consumes catalog and locale path utilities.
- Produces metadata, sitemap, robots, RSS, ads declaration, and AdSense permissions.

- [ ] Add failing tests for every localized catalog URL, internal exclusions, RSS item coverage, AdSense values, hreflang, and structured data serialization.
- [ ] Run tests and confirm red.
- [ ] Implement metadata templates, Google tags/script, XML artifacts, robots policy, ads file, JSON-LD, and CSP origins.
- [ ] Re-run tests to green.

### Task 8: Browser coverage, gates, release, and deployment

**Files:**

- Create: `e2e/marketing.spec.ts`
- Modify: deployment documentation if routing requires it

**Interfaces:**

- Verifies the complete public/internal boundary and production artifact.

- [ ] Add Playwright checks for `/`, `/fr`, `/ar`, representative detail pages, contact, `/app/login`, legacy redirects, theme, locale switching, sitemap, robots, feed, and ads.
- [ ] Run focused browser tests against a production build.
- [ ] Run formatting, `npm run validate:full`, coverage command matching GitHub CI, and `.husky/pre-commit`.
- [ ] Review `git diff --check`, secrets, route inventory, and spec coverage.
- [ ] Commit and push `main`; inspect GitHub checks until terminal.
- [ ] Deploy the verified artifact to Vercel production.
- [ ] Verify live status, canonical tags, redirects, locale pages, discovery files, AdSense tags, internal noindex, and error logs.
