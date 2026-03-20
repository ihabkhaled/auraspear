# AuraSpear SOC Platform

A multi-tenant **Security Operations Center (SOC)** platform built with Next.js 16, React 19, and TypeScript 5. Integrates with Wazuh, Graylog, Velociraptor, Grafana, InfluxDB, MISP, Shuffle, and AWS Bedrock to provide real-time threat detection, case management, threat hunting, and intelligence sharing across tenants.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [Connector Types](#connector-types)
- [RBAC & Permissions](#rbac--permissions)
- [Internationalization](#internationalization)
- [Styling](#styling)
- [Code Quality](#code-quality)
- [NPM Scripts](#npm-scripts)

---

## Tech Stack

| Category        | Technology                            | Version |
| --------------- | ------------------------------------- | ------- |
| Framework       | Next.js (App Router, webpack dev)     | 16.1.6  |
| Language        | TypeScript (strict mode, all flags)   | 5       |
| UI Library      | React + React DOM                     | 19.2.3  |
| Styling         | Tailwind CSS v4 (CSS-first)           | 4       |
| Components      | shadcn/ui (Radix primitives)          | 3.8.5   |
| Server State    | @tanstack/react-query                 | 5.90    |
| Global State    | Zustand                               | 5.0     |
| Forms           | React Hook Form + Zod                 | 7.71    |
| Validation      | Zod                                   | 4.3     |
| HTTP Client     | Axios (with auth/tenant interceptors) | 1.13    |
| i18n            | next-intl (EN, ES, IT, FR, AR, DE)    | 4.8     |
| Theming         | next-themes (light/dark/system)       | 0.4     |
| Charts          | Recharts                              | 3.7     |
| Icons           | lucide-react                          | 0.575   |
| PWA             | @serwist/next                         | 9.5     |
| Toast / Dialogs | Sonner + SweetAlert2                  | —       |
| Linting         | ESLint 9 (7 plugins, flat config)     | 9       |
| Formatting      | Prettier + tailwindcss plugin         | 3.8     |
| Git Hooks       | Husky v9 + lint-staged + commitlint   | —       |

---

## Features

- **Operational dashboards** â€” Query-driven operational overview panels for incident status, case aging, noisy rules, connector sync health, runtime backlog, automation quality, and exposure summary
- **Dashboard** — Real-time KPIs (alerts, critical count, open cases, MTTR), alert trends (24h/7d/30d), MITRE ATT&CK top techniques, top assets, pipeline health, recent activity
- **Alerts** — Full-text search, severity/status/time filtering, AI-assisted investigation, acknowledge/close workflows
- **Cases** — Kanban and list views, case lifecycle (open → in_progress → closed), linked alerts, notes, timeline, artifacts, tasks, comments
- **Case Cycles** — Case cycle tracking and management
- **Threat Hunting** — AI-powered interactive sessions with natural language, step-by-step reasoning, event results, quick prompts
- **Threat Intelligence** — IOC search (IP, domain, hash, URL, email), MISP event feed, hit count tracking
- **Incidents** — Incident lifecycle management with timeline and stats
- **Connector Management** — Configure and test 9 integrations, health testing, encrypted credential storage, enable/disable per tenant
- **Data Explorer** — Log/event search across Graylog, Grafana, InfluxDB, Velociraptor, MISP, Shuffle, Logstash; dashboards, pipelines, automation, sync jobs
- **Detection Rules** — Detection rule CRUD with stats
- **Correlation** — Correlation rule engine with conditions
- **Normalization** — Log normalization pipeline management
- **Attack Paths** — Attack path visualization and analysis
- **Cloud Security** — Cloud account and findings management
- **Compliance** — Compliance framework and control tracking
- **Vulnerabilities** — Vulnerability tracking and management
- **UEBA** — User and Entity Behavior Analytics (anomalies, entities, ML models)
- **SOAR** — Shuffle playbook management and execution
- **AI Agents** — AI agent management with sessions
- **Reports** — Report generation and management
- **Admin — System** — Multi-tenant management, service health, audit logs
- **Admin — Tenant** — User management (invite/edit/block/restore), RBAC assignment
- **Admin — Role Settings** — Full checkbox matrix UI for configuring role permissions per tenant. Collapsible modules with sticky header. GLOBAL_ADMIN can view, edit, and reset permissions
- **Dynamic RBAC** — Database-backed permission matrix replacing static role checks. ~70 granular permissions across all modules. Permissions auto-sync every 60 seconds via `/auth/me` polling — no logout needed when admin changes permissions
- **Bulk Alert Actions** — Bulk acknowledge and close alerts with permission-aware checkboxes and action buttons
- **Notifications** — Real-time WebSocket notifications with bell indicator
- **Profile & Settings** — User profile, password change, theme, language, notification preferences
- **Dark Mode** — Full light/dark/system theme via CSS custom properties
- **RTL Support** — Bidirectional layout for Arabic
- **PWA** — Progressive Web App with service worker (via @serwist/next), offline support, mobile responsiveness, and installable on mobile and desktop

---

## Getting Started

### Prerequisites

- Node.js >= 18.18, npm >= 9
- AuraSpear Backend running at `http://localhost:4000/api/v1`

### Quick Start

```bash
# Install dependencies
npm install

# Start development server (webpack, stable with Serwist)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Redirects to `/dashboard` if authenticated, or `/login` if not.

### API Mocking

Set `NEXT_PUBLIC_ENABLE_MSW=true` in `.env.development` to run without a backend. MSW intercepts all API calls.

---

## Environment Variables

Create `.env.development` for local development:

```env
BACKEND_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_OIDC_AUTHORITY=https://login.microsoftonline.com/common/v2.0
NEXT_PUBLIC_OIDC_CLIENT_ID=
NEXT_PUBLIC_OIDC_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_ENABLE_MSW=false
NEXT_PUBLIC_APP_NAME=AuraSpear SOC
NEXT_PUBLIC_APP_ENV=development
```

| Variable                        | Required | Description                                          |
| ------------------------------- | -------- | ---------------------------------------------------- |
| `BACKEND_API_URL`               | Yes      | NestJS backend URL (server-side only, never exposed) |
| `NEXT_PUBLIC_OIDC_AUTHORITY`    | No       | Entra ID authority for SSO                           |
| `NEXT_PUBLIC_OIDC_CLIENT_ID`    | No       | OIDC client ID; empty = email/password mode          |
| `NEXT_PUBLIC_OIDC_REDIRECT_URI` | No       | Post-login redirect URI                              |
| `NEXT_PUBLIC_ENABLE_MSW`        | No       | `true` enables Mock Service Worker for offline dev   |
| `NEXT_PUBLIC_APP_NAME`          | No       | App display name                                     |
| `NEXT_PUBLIC_APP_ENV`           | No       | `development` / `staging` / `production`             |

Environment files: `.env.development`, `.env.staging`, `.env.production`, `.env.docker`

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth routes (no sidebar)
│   │   ├── login/                 # Email/password login
│   │   └── callback/              # OIDC callback
│   ├── (portal)/                  # Main app (AuthGuard + Sidebar)
│   │   ├── dashboard/             # Executive dashboard
│   │   ├── alerts/                # Alert management
│   │   ├── cases/                 # Case list + [id] detail + cycles
│   │   ├── hunt/                  # Threat hunting
│   │   ├── intel/                 # Threat intelligence
│   │   ├── incidents/             # Incident management
│   │   ├── connectors/            # Connector list + [type] config
│   │   ├── explorer/              # Data explorer (8 sub-pages)
│   │   ├── detection-rules/       # Detection rules
│   │   ├── correlation/           # Correlation rules
│   │   ├── normalization/         # Normalization pipelines
│   │   ├── attack-paths/          # Attack path analysis
│   │   ├── cloud-security/        # Cloud findings
│   │   ├── compliance/            # Compliance tracking
│   │   ├── vulnerabilities/       # Vulnerability tracking
│   │   ├── ueba/                  # Behavior analytics
│   │   ├── soar/                  # SOAR playbooks
│   │   ├── ai-agents/             # AI agents
│   │   ├── reports/               # Reports
│   │   ├── system-health/         # System monitoring
│   │   ├── admin/system/          # System admin
│   │   ├── admin/tenant/          # Tenant admin
│   │   ├── profile/               # User profile
│   │   └── settings/              # Preferences
│   ├── api/                       # Server-side API proxy (156 routes)
│   ├── globals.css                # Tailwind v4 theme + status/severity classes
│   ├── layout.tsx                 # Root layout (i18n, fonts, Toaster, SW)
│   ├── providers.tsx              # QueryClient, ThemeProvider, NextIntlClientProvider
│   └── sw.ts                      # Service worker (PWA)
├── components/
│   ├── ui/                        # shadcn/ui primitives (28+ components)
│   ├── common/                    # Shared: AuthGuard, RoleGuard, DataTable, PageHeader, etc.
│   ├── layout/                    # PortalShell, Sidebar, Topbar, TenantSwitcher, etc.
│   └── <domain>/                  # Domain components (alerts, cases, hunt, intel, etc.)
├── hooks/                         # 230+ custom hooks (one file per hook)
├── services/                      # 28 singleton API services
├── stores/                        # 7 Zustand stores (auth, tenant, filter, hunt, ui, notification)
├── types/                         # 34 type definition files
├── enums/                         # 38 enum files
├── i18n/                          # 6 locale files (en, ar, es, fr, de, it)
├── lib/
│   ├── api.ts                     # Axios instance with auth/tenant interceptors
│   ├── backend-proxy.ts           # proxyToBackend() for API routes
│   ├── constants/                 # 25 constant files
│   └── validation/                # 15 Zod validation schemas
```

---

## Architecture

### API Proxy Pattern

The frontend **never calls external services directly**. All requests go through Next.js API routes that proxy to the NestJS backend:

```
Browser → Next.js API Route → NestJS Backend → Wazuh/MISP/etc.
```

- `src/lib/api.ts` — Axios instance with auth token + tenant ID interceptors
- `src/lib/backend-proxy.ts` — Server-side `proxyToBackend()` utility
- `src/app/api/**` — 156 API route handlers (GET, POST, PATCH, DELETE)

### State Management

| Layer        | Tool            | Purpose                                  |
| ------------ | --------------- | ---------------------------------------- |
| Server State | React Query     | API data fetching, caching, invalidation |
| Global State | Zustand         | Auth, tenant, filters, UI (7 stores)     |
| Form State   | React Hook Form | Form management with Zod validation      |
| URL State    | Next.js Router  | Route params, search params              |

### Component Architecture

```
Page → Domain Components → Common Components → shadcn/ui Primitives
                ↓
           Custom Hooks → Services → Axios → API Routes
```

- **Services** — Singleton API wrappers (28 files, one per domain)
- **Hooks** — One hook per file (230+ hooks). Page hooks, data hooks, component hooks
- **Types** — All interfaces in `src/types/<domain>.types.ts`
- **Enums** — All enums in `src/enums/<domain>.enum.ts`
- **Constants** — All constants in `src/lib/constants/<domain>.ts`

---

## Pages & Routes

### Portal Pages (38 pages)

| Route                  | Description                       | Min Role       |
| ---------------------- | --------------------------------- | -------------- |
| `/dashboard`           | Executive dashboard with KPIs     | All roles      |
| `/alerts`              | Alert search and management       | SOC_ANALYST_L1 |
| `/cases`               | Case list (Kanban + table)        | SOC_ANALYST_L1 |
| `/cases/[id]`          | Case detail (artifacts, timeline) | SOC_ANALYST_L1 |
| `/cases/cycles`        | Case cycle list                   | SOC_ANALYST_L1 |
| `/hunt`                | AI-powered threat hunting         | THREAT_HUNTER  |
| `/intel`               | Threat intelligence (IOC, MISP)   | SOC_ANALYST_L1 |
| `/incidents`           | Incident management               | SOC_ANALYST_L1 |
| `/connectors`          | Connector management              | TENANT_ADMIN   |
| `/connectors/[type]`   | Connector configuration           | TENANT_ADMIN   |
| `/explorer/*`          | Data explorer (8 sub-pages)       | SOC_ANALYST_L1 |
| `/detection-rules`     | Detection rule management         | SOC_ANALYST_L2 |
| `/correlation`         | Correlation rule engine           | SOC_ANALYST_L2 |
| `/normalization`       | Normalization pipelines           | SOC_ANALYST_L2 |
| `/attack-paths`        | Attack path analysis              | SOC_ANALYST_L2 |
| `/cloud-security`      | Cloud account findings            | SOC_ANALYST_L1 |
| `/compliance`          | Compliance tracking               | SOC_ANALYST_L1 |
| `/vulnerabilities`     | Vulnerability tracking            | SOC_ANALYST_L1 |
| `/ueba`                | Behavior analytics                | SOC_ANALYST_L2 |
| `/soar`                | SOAR playbooks                    | SOC_ANALYST_L2 |
| `/ai-agents`           | AI agent management               | SOC_ANALYST_L2 |
| `/reports`             | Report generation                 | SOC_ANALYST_L1 |
| `/system-health`       | System monitoring                 | TENANT_ADMIN   |
| `/admin/system`        | System admin (multi-tenant)       | GLOBAL_ADMIN   |
| `/admin/tenant`        | Tenant user management            | TENANT_ADMIN   |
| `/admin/role-settings` | Role permission matrix editor     | GLOBAL_ADMIN   |
| `/profile`             | User profile                      | All roles      |
| `/settings`            | Theme, language, notifications    | All roles      |

### Auth Pages

| Route       | Description           |
| ----------- | --------------------- |
| `/login`    | Email/password login  |
| `/callback` | OIDC callback handler |

---

## Connector Types

| Connector     | Purpose              | Features                          |
| ------------- | -------------------- | --------------------------------- |
| Wazuh Manager | SIEM alerts & agents | Alert ingestion, agent management |
| Wazuh Indexer | Log search           | OpenSearch-based event queries    |
| Graylog       | Log management       | Log streams, search, pipelines    |
| Velociraptor  | EDR / DFIR           | Endpoint detection, forensics     |
| Grafana       | Dashboards           | Metric visualization              |
| InfluxDB      | Time-series          | Metric storage and queries        |
| MISP          | Threat intelligence  | IOC feeds, event correlation      |
| Shuffle       | SOAR                 | Playbook execution, automation    |
| AWS Bedrock   | AI analysis          | AI-powered investigation          |

---

## RBAC & Permissions

### Roles

| Role                 | Level | Access                               |
| -------------------- | ----- | ------------------------------------ |
| `GLOBAL_ADMIN`       | 1     | Full platform access + tenant switch |
| `TENANT_ADMIN`       | 2     | Full tenant access + user management |
| `SOC_ANALYST_L2`     | 3     | Advanced analysis + rule management  |
| `THREAT_HUNTER`      | 4     | Hunting + intelligence               |
| `SOC_ANALYST_L1`     | 5     | Basic alert/case operations          |
| `EXECUTIVE_READONLY` | 6     | Dashboard and reports only           |

### Dynamic Permission System

The platform uses a **database-backed permission matrix** instead of static role checks. GLOBAL_ADMIN can configure which roles can perform which actions on a per-tenant basis via the Role Settings admin page (`/admin/role-settings`).

**Key characteristics:**

- **~70 granular permissions** across all modules: alerts, cases, incidents, connectors, correlation, detection-rules, hunt, reports, admin, intel, SOAR, AI agents, cloud security, compliance, attack paths, UEBA, normalization, vulnerabilities, explorer, notifications, profile, settings, and role-settings
- **Auto-refresh** — Permissions sync every 60 seconds via `/auth/me` polling. When an admin changes a user's permissions, the user sees the updated access without logging out
- **Permission-aware UI** — All pages conditionally show/hide create, edit, and delete buttons based on the user's resolved permissions. Alert checkboxes and bulk actions are hidden when the user lacks acknowledge/close permissions. The escalate button requires both `ALERTS_ESCALATE` and `INCIDENTS_CREATE`
- **Case owner bypass** — Case owners can edit, change status, add comments, tasks, and artifacts regardless of their role-level permissions
- **Bulk alert actions** — Bulk acknowledge and close alerts, with visibility gated by permission checks

### Role Settings Admin Page

The `/admin/role-settings` page provides a full checkbox matrix where GLOBAL_ADMIN can:

- View the current permission state for all roles in the selected tenant
- Toggle individual permissions per role
- Reset a role's permissions back to system defaults
- Navigate collapsible module groups with a sticky header for easy scanning

### Enforcement

Frontend enforcement via `<RoleGuard>` component, `useRoleGuard()` hook, and the `usePermissions()` / `useHasPermission()` hooks. Backend enforces the same rules via `@Roles()` + `RolesGuard` and the permission guard middleware.

---

## Internationalization

- **System**: next-intl v4.8
- **Locales**: English, Arabic, Spanish, French, German, Italian
- **RTL**: Full bidirectional support for Arabic
- **Usage**: `const t = useTranslations('namespace')` → `t('key')`
- **Files**: `src/i18n/{en,ar,es,fr,de,it}.json`
- **Rule**: Never hardcode user-facing text — always use `t()`

---

## Styling

### Tailwind CSS v4

CSS-first configuration (no `tailwind.config.js`). Theme defined in `globals.css` via CSS custom properties.

### Theming

- `next-themes` provides light/dark/system support
- All colors use HSL CSS variables: `--background`, `--foreground`, `--primary`, etc.
- Both light and dark palettes defined in `globals.css`

### Status & Severity Classes

Pre-defined utility classes for consistent status/severity styling:

```css
.status-active, .status-inactive, .status-pending
.severity-critical, .severity-high, .severity-medium, .severity-low
```

> Never use static Tailwind color classes (e.g., `text-red-500`) for status or severity — use the class system.

---

## Code Quality

### Enforced Rules

- **No `any`** — Use `unknown`, generics, or proper types
- **No ESLint disables** — Fix root causes
- **No hardcoded text** — Use `t()` from next-intl
- **No inline types/enums/constants** in component files
- **No custom hooks inside components** — One hook per file in `src/hooks/`
- **No `<table>` directly** — Use `<DataTable>` component
- **No raw HTML inputs** — Use shadcn/ui components
- **No static color classes** for status/severity
- **Explicit return types** on all functions
- **No `Array#reduce()`** — Use `for...of`
- **No nested ternaries**
- **No `await` in loops** — Use `Promise.all()`

### Pre-Commit Hooks

Husky + lint-staged runs on every commit:

1. ESLint (30 concurrent workers)
2. TypeScript type check (`tsc --noEmit`)
3. Prettier formatting

### Commit Convention

Conventional Commits enforced by commitlint: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`

---

## NPM Scripts

```bash
# Development
npm run dev                # Turbopack dev server
npm run dev:debug          # Debug with Node inspector

# Build & Production
npm run build              # Production build
npm start                  # Production server

# Validation (run before committing)
npm run validate           # typecheck + lint:strict + format:check
npm run validate:full      # validate + tests + production build
npm run validate:fix       # lint:fix + format

# Individual Checks
npm run lint               # ESLint check
npm run lint:strict        # ESLint (zero warnings)
npm run lint:fix           # Auto-fix
npm run format             # Prettier format
npm run format:check       # Prettier check
npm run typecheck          # TypeScript check

# Testing
npm test                   # Vitest
npm run test:watch         # Watch mode
```

## Contributor Guides

- Dashboard widgets: [`docs/dashboard-widgets.md`](./docs/dashboard-widgets.md)
- Permissions and route gating: [`docs/permissions-and-routes.md`](./docs/permissions-and-routes.md)
- Contribution workflow: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Install and local environment: [`INSTALL.md`](./INSTALL.md)
