# AuraSpear SOC Platform

A multi-tenant **Security Operations Center (SOC)** platform built with Next.js 16, React 19, and TypeScript 5. AuraSpear integrates with Wazuh, Graylog, Velociraptor, Grafana, InfluxDB, MISP, Shuffle, and AWS Bedrock to provide real-time threat detection, case management, threat hunting, and intelligence sharing across tenants.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [API Proxy Routes](#api-proxy-routes)
- [Services](#services)
- [Hooks](#hooks)
- [Zustand Stores](#zustand-stores)
- [Enums](#enums)
- [Types](#types)
- [Constants](#constants)
- [Common Components](#common-components)
- [Connector Types](#connector-types)
- [RBAC Roles](#rbac-roles)
- [Styling System](#styling-system)
- [Internationalization](#internationalization)
- [Code Quality](#code-quality)
- [NPM Scripts](#npm-scripts)

---

## Tech Stack

| Category          | Technology                                        | Version  |
| ----------------- | ------------------------------------------------- | -------- |
| Framework         | Next.js (App Router, Turbopack)                   | 16.1.6   |
| Language          | TypeScript (strict mode, all flags enabled)       | 5        |
| UI Library        | React + React DOM                                 | 19.2.3   |
| Styling           | Tailwind CSS v4 (CSS-first, no config file)       | 4        |
| Component Library | shadcn/ui (Radix primitives, new-york style)      | 3.8.5    |
| Server State      | @tanstack/react-query                             | 5.90.21  |
| Global State      | Zustand                                           | 5.0.11   |
| Forms             | React Hook Form + @hookform/resolvers             | 7.71.2   |
| Validation        | Zod                                               | 4.3.6    |
| HTTP Client       | Axios (pre-configured with interceptors)          | 1.13.6   |
| i18n              | next-intl (EN, ES, IT, FR, AR, DE)                | 4.8.3    |
| Theming           | next-themes (light/dark/system via CSS variables) | 0.4.6    |
| Icons             | lucide-react                                      | 0.575.0  |
| Charts            | Recharts                                          | 3.7.0    |
| Toast             | Sonner                                            | 2.0.7    |
| Dialogs           | SweetAlert2                                       | 11.26.21 |
| Date Utilities    | dayjs + date-fns                                  | 1.11.19  |
| PWA               | @serwist/next + serwist                           | 9.5.6    |
| API Mocking       | MSW (Mock Service Worker)                         | dev only |
| Linting           | ESLint 9 (flat config, 7 plugins)                 | 9        |
| Formatting        | Prettier + prettier-plugin-tailwindcss            | 3.8.1    |
| Git Hooks         | Husky v9 + lint-staged                            | 9.1.7    |
| Commit Linting    | @commitlint/cli + @commitlint/config-conventional | 19.8.1   |

---

## Features

- **Dashboard** — Real-time KPIs (total alerts, critical count, open cases, MTTR), alert trend charts (24h/7d/30d), MITRE ATT&CK top techniques, top targeted assets, pipeline health overview
- **Alerts Management** — Full-text search, severity filtering, status filtering, time range selector (24h/7d/30d), AI-assisted investigation, acknowledge/close workflows, sortable columns
- **Case Management** — Kanban and list views, case lifecycle (open → in_progress → closed), linked alerts, case notes, timeline events, artifact tracking, severity-based prioritization
- **Threat Hunting** — Interactive AI-powered hunt sessions with natural language queries, step-by-step reasoning display, event results browser, quick prompt templates
- **Threat Intelligence** — IOC search (IP, domain, hash, URL, email), MISP event feed with pagination and sorting, hit count tracking, source attribution
- **Connector Management** — Configure and test 8 security tool integrations (Wazuh, Graylog, Velociraptor, Grafana, InfluxDB, MISP, Shuffle, AWS Bedrock), enable/disable per tenant, connection health testing, encrypted credential storage
- **Admin — System** — Multi-tenant management (GLOBAL_ADMIN), service health monitoring, audit log viewer with search and date filters, system configuration
- **Admin — Tenant** — Tenant user management, user invite/edit/block/restore, RBAC role assignment, user sort and filter
- **Profile** — View and update user name, change password with current password confirmation
- **Settings** — Theme selector (light/dark/system), language selector (6 locales), notification preferences (email + in-app)
- **Multi-tenant Isolation** — All data strictly scoped to tenant; GLOBAL_ADMIN can switch context via tenant header
- **Dark Mode** — Full light/dark/system theme support via CSS custom properties
- **RTL Support** — Bidirectional layout for Arabic and other RTL languages (uses `start`/`end` CSS classes)
- **RBAC** — 6-level role hierarchy enforced on both frontend (RoleGuard) and backend (RolesGuard)
- **PWA** — Service worker via @serwist/next, installable on mobile and desktop

---

## Prerequisites

- **Node.js** >= 18.18
- **npm** >= 9
- **AuraSpear Backend** running at `http://localhost:4000/api/v1` (see backend README)

---

## Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd auraspear

# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app will redirect to `/dashboard` if authenticated, or `/login` if not.

### API Mocking

Set `NEXT_PUBLIC_ENABLE_MSW=true` in `.env.development` to enable MSW mocking (no backend required). The service worker at `public/mockServiceWorker.js` intercepts all API calls.

---

## Environment Variables

Create `.env.development` for local development:

```env
# NestJS backend API base URL (server-side only, not exposed to browser)
BACKEND_API_URL=http://localhost:4000/api/v1

# Microsoft Entra ID / OIDC authority URL (for SSO, optional in dev)
NEXT_PUBLIC_OIDC_AUTHORITY=https://login.microsoftonline.com/common/v2.0

# OIDC client ID (leave empty in dev to use email/password login)
NEXT_PUBLIC_OIDC_CLIENT_ID=

# OIDC redirect URI after authentication
NEXT_PUBLIC_OIDC_REDIRECT_URI=http://localhost:3000/callback

# Enable MSW mock service worker (set true to mock all API calls without backend)
NEXT_PUBLIC_ENABLE_MSW=false
```

| Variable                        | Required | Description                                             |
| ------------------------------- | -------- | ------------------------------------------------------- |
| `BACKEND_API_URL`               | Yes      | NestJS backend URL — proxied server-side, never exposed |
| `NEXT_PUBLIC_OIDC_AUTHORITY`    | No       | Entra ID authority for SSO flows                        |
| `NEXT_PUBLIC_OIDC_CLIENT_ID`    | No       | OIDC client ID; empty = email/password mode             |
| `NEXT_PUBLIC_OIDC_REDIRECT_URI` | No       | Where Entra ID redirects after login                    |
| `NEXT_PUBLIC_ENABLE_MSW`        | No       | `true` activates Mock Service Worker for offline dev    |

---

## Project Structure

```
auraspear/
├── public/
│   ├── mockServiceWorker.js        # MSW service worker
│   ├── manifest.json               # PWA manifest
│   └── icons/                      # App icons
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Auth route group (no portal layout)
│   │   │   ├── login/page.tsx      # Email/password login form
│   │   │   ├── callback/page.tsx   # OIDC callback handler
│   │   │   └── layout.tsx          # Auth layout (no sidebar)
│   │   ├── (portal)/               # Main app route group (AuthGuard + Sidebar)
│   │   │   ├── dashboard/          # Executive dashboard
│   │   │   ├── alerts/             # Alert list + filter sidebar
│   │   │   ├── cases/              # Case list + Kanban board
│   │   │   │   └── [id]/           # Case detail view
│   │   │   ├── hunt/               # Threat hunting interface
│   │   │   ├── intel/              # Threat intelligence feed
│   │   │   ├── connectors/         # Connector list
│   │   │   │   └── [type]/         # Connector detail + config form
│   │   │   ├── admin/
│   │   │   │   ├── system/         # System admin (health, audit)
│   │   │   │   └── tenant/         # Tenant config + users
│   │   │   ├── profile/            # User profile
│   │   │   ├── settings/           # User preferences
│   │   │   └── layout.tsx          # PortalShell (Sidebar + Topbar)
│   │   ├── api/                    # Server-side API proxy routes
│   │   │   ├── admin/              # Admin endpoints
│   │   │   ├── alerts/             # Alert endpoints
│   │   │   ├── auth/               # Auth endpoints
│   │   │   ├── cases/              # Case endpoints
│   │   │   ├── connectors/         # Connector endpoints
│   │   │   ├── dashboard/          # Dashboard endpoints
│   │   │   ├── hunt/               # Hunt endpoints
│   │   │   ├── intel/              # Intel endpoints
│   │   │   └── users/              # User/profile endpoints
│   │   ├── globals.css             # Tailwind v4 theme + status/severity classes
│   │   ├── layout.tsx              # Root layout (i18n, fonts, Toaster, SW)
│   │   ├── page.tsx                # Root redirect to /dashboard
│   │   └── providers.tsx           # QueryClient, ThemeProvider, NextIntlClientProvider
│   ├── components/
│   │   ├── admin/                  # Admin-specific components
│   │   │   ├── AddUserDialog.tsx
│   │   │   ├── AuditLogTable.tsx
│   │   │   ├── CreateTenantDialog.tsx
│   │   │   ├── EditTenantDialog.tsx
│   │   │   ├── EditUserDialog.tsx
│   │   │   ├── IntegrationConfigPanel.tsx
│   │   │   ├── ServiceHealthCard.tsx
│   │   │   ├── ServiceHealthGrid.tsx
│   │   │   ├── TenantListTable.tsx
│   │   │   └── TenantUserTable.tsx
│   │   ├── alerts/
│   │   │   ├── AlertDetailDrawer.tsx
│   │   │   ├── AlertFilterSidebar.tsx
│   │   │   └── AlertTableColumns.tsx
│   │   ├── cases/
│   │   │   ├── CaseArtifactPanel.tsx
│   │   │   ├── CaseDetailHeader.tsx
│   │   │   ├── CaseKanbanBoard.tsx
│   │   │   ├── CaseKanbanCard.tsx
│   │   │   ├── CaseListTable.tsx
│   │   │   ├── CaseTimeline.tsx
│   │   │   └── CaseToolbar.tsx
│   │   ├── charts/
│   │   │   └── SeverityDistributionChart.tsx
│   │   ├── common/                 # Shared reusable components
│   │   │   ├── AuthGuard.tsx       # Redirects unauthenticated users
│   │   │   ├── RoleGuard.tsx       # Hides UI for insufficient roles
│   │   │   ├── DataTable.tsx       # MANDATORY table component
│   │   │   ├── PageHeader.tsx      # Page title + action button
│   │   │   ├── LoadingSpinner.tsx  # Centered spinner
│   │   │   ├── EmptyState.tsx      # Empty data state UI
│   │   │   ├── ErrorMessage.tsx    # Error alert panel
│   │   │   ├── Pagination.tsx      # Page navigation controls
│   │   │   ├── SeverityBadge.tsx   # Color-coded severity indicator
│   │   │   ├── StatusDot.tsx       # Animated status dot
│   │   │   ├── MITREBadge.tsx      # MITRE technique badge
│   │   │   ├── KPICard.tsx         # Dashboard metric card
│   │   │   ├── TimeRangeSelector.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   ├── MonoText.tsx        # Monospace text for IPs/hashes
│   │   │   ├── Toast.tsx           # Sonner toast wrapper
│   │   │   └── SweetAlert.tsx      # SweetAlert2 dialog wrapper
│   │   ├── connectors/
│   │   │   ├── ConnectorCard.tsx
│   │   │   ├── ConnectorForm.tsx
│   │   │   ├── SecurityIndicators.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── hunt/
│   │   │   ├── HuntInputArea.tsx
│   │   │   ├── HuntStatusBar.tsx
│   │   │   └── ReasoningSteps.tsx
│   │   ├── intel/
│   │   │   ├── IntelStatsGrid.tsx
│   │   │   ├── MISPEventFeed.tsx
│   │   │   └── MISPTagPill.tsx
│   │   ├── layout/
│   │   │   ├── PortalShell.tsx     # App shell (sidebar + topbar + content)
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── ThemeSwitcher.tsx   # Light/dark/system toggle
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── UserMenu.tsx        # Avatar dropdown (profile, settings, logout)
│   │   └── ui/                     # shadcn/ui primitives
│   │       ├── button.tsx, badge.tsx, card.tsx, dialog.tsx
│   │       ├── input.tsx, select.tsx, textarea.tsx
│   │       ├── table.tsx, tabs.tsx, drawer.tsx
│   │       └── ... (all Radix-based)
│   ├── enums/                      # All string enums (one file per domain)
│   ├── hooks/                      # Custom React hooks (one file per hook)
│   ├── i18n/                       # Translation files (6 locales)
│   ├── lib/
│   │   ├── api.ts                  # Axios instance with auth + tenant interceptors
│   │   ├── api-error.ts            # getErrorKey() for i18n error keys
│   │   ├── backend-proxy.ts        # proxyToBackend() for API routes
│   │   ├── utils.ts                # cn(), formatDate(), etc.
│   │   ├── cookies.ts              # Cookie read/write helpers
│   │   ├── connector-utils.ts      # Connector helper functions
│   │   ├── health-utils.ts         # Service health helpers
│   │   ├── integration-utils.ts    # Integration status helpers
│   │   ├── roles.ts                # Role hierarchy helpers
│   │   ├── severity-utils.ts       # Severity color/label helpers
│   │   ├── case.utils.ts           # Case number formatting
│   │   ├── constants/              # Domain-specific constants
│   │   │   ├── alerts.ts
│   │   │   ├── cases.ts
│   │   │   ├── connectors.constants.ts
│   │   │   ├── hunt.ts
│   │   │   ├── locales.ts
│   │   │   ├── roles.ts
│   │   │   └── storage.ts
│   │   └── validation/
│   │       └── connectors.schema.ts  # Zod schemas for connector forms
│   ├── mocks/                      # MSW mock handlers (dev only)
│   │   ├── handlers/               # Per-domain mock handlers
│   │   └── browser.ts              # MSW browser worker setup
│   ├── services/                   # API service layer (singleton objects)
│   │   ├── alert.service.ts
│   │   ├── case.service.ts
│   │   ├── connector.service.ts
│   │   ├── admin.service.ts
│   │   ├── hunt.service.ts
│   │   ├── intel.service.ts
│   │   ├── profile.service.ts
│   │   ├── settings.service.ts
│   │   └── index.ts
│   ├── stores/                     # Zustand global state
│   │   ├── auth.store.ts           # JWT tokens + user (persisted)
│   │   ├── tenant.store.ts         # Current tenant ID (persisted)
│   │   ├── filter.store.ts         # Alert/case filter state
│   │   ├── hunt.store.ts           # Hunt session messages
│   │   ├── ui.store.ts             # Sidebar, modal UI state
│   │   ├── notification.store.ts   # Notification queue
│   │   └── index.ts
│   └── types/                      # All TypeScript interfaces (barrel export)
│       ├── admin.types.ts
│       ├── alert.types.ts
│       ├── auth.types.ts
│       ├── case.types.ts
│       ├── chart.types.ts
│       ├── common.types.ts
│       ├── dashboard.types.ts
│       ├── hunt.types.ts
│       ├── intel.types.ts
│       ├── layout.types.ts
│       ├── profile.types.ts
│       ├── storage.types.ts
│       └── index.ts
├── .env.development
├── .husky/
├── .lintstagedrc.cjs
├── commitlint.config.cjs
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## Architecture

### Auth Flow

1. User visits `/login` → enters email + password
2. Frontend POSTs to `/api/auth/login` (Next.js API route)
3. API route proxies to `{BACKEND_API_URL}/auth/login`
4. On success: response contains `{ accessToken, refreshToken, user: { sub, email, tenantId, tenantSlug, role } }`
5. Auth store (`useAuthStore`) saves tokens + user to `auth-storage` localStorage via Zustand persist
6. Axios interceptor (`src/lib/api.ts`) attaches `Authorization: Bearer {accessToken}` to every request
7. Axios interceptor also attaches `X-Tenant-Id` header:
   - For GLOBAL_ADMIN: reads `currentTenantId` from `useTenantStore` (allows tenant switching)
   - For all other roles: uses `user.tenantId` from auth store
8. On 401 response: interceptor attempts token refresh via `POST /api/auth/refresh`; on failure, calls `clearAuthAndRedirect()` (clears store + localStorage, redirects to `/login`)
9. `<AuthGuard>` in portal layout redirects unauthenticated users to `/login`

### API Proxy Pattern

All Next.js API routes (under `src/app/api/`) use `proxyToBackend()` from `src/lib/backend-proxy.ts`. This function:

- Reads `BACKEND_API_URL` (server-side env var, never exposed to browser)
- Forwards the HTTP method, headers, body, and query params to the NestJS backend
- Transparently relays the response (status code + body) back to the frontend

Example: `GET /api/alerts?page=1&limit=10` → proxied to `http://localhost:4000/api/v1/alerts?page=1&limit=10`

This pattern keeps the backend URL private and enables the frontend to work behind a single origin without CORS configuration changes.

### Service Layer Pattern

Each domain has a singleton service object:

```typescript
// src/services/alert.service.ts
export const alertService = {
  getAlerts: (params?: AlertSearchParams) =>
    api.get<ApiResponse<Alert[]>>('/alerts', { params }).then(r => r.data),
  getAlertById: (id: string) => api.get<ApiResponse<Alert>>(`/alerts/${id}`).then(r => r.data),
}
```

Services use the pre-configured Axios `api` instance and return typed Promises. Hooks wrap services with React Query.

### Hook Pattern

```typescript
// Data hook (React Query)
export function useAlerts(params?: AlertSearchParams) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => alertService.getAlerts(params),
    placeholderData: keepPreviousData,
  })
}

// Page hook (encapsulates all state for a page)
export function useAlertsPage() {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState<AlertSeverity[]>([])
  // ... pagination, sort, filter state
  const { data, isFetching } = useAlerts({ query, severity, ... })
  return { data, isFetching, query, setQuery, ... }
}
```

Page hooks prevent page components from having business logic — pages only import one hook and render the returned state.

### Multi-Tenant Architecture

- GLOBAL_ADMIN can manage all tenants and switch tenant context by clicking a tenant from the tenant list
- The selected tenant ID is stored in `useTenantStore` (`tenant-storage` localStorage)
- Axios interceptor sends `X-Tenant-Id: {tenantId}` header on every request
- Backend `AuthGuard` reads this header for GLOBAL_ADMIN users and overrides `request.user.tenantId`
- All backend queries include `WHERE tenant_id = ?` — data never leaks across tenants

---

## Pages & Routes

### Auth Routes

| Route       | File                       | Description                                        |
| ----------- | -------------------------- | -------------------------------------------------- |
| `/login`    | `(auth)/login/page.tsx`    | Email/password login with theme + locale selectors |
| `/callback` | `(auth)/callback/page.tsx` | OIDC callback redirect (Entra ID flow)             |
| `/`         | `page.tsx`                 | Redirects to `/dashboard`                          |

### Portal Routes (require authentication)

| Route                | File                                  | Description                                                                        |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `/dashboard`         | `(portal)/dashboard/page.tsx`         | KPI cards, alert trend chart, MITRE top techniques, asset risks, pipeline health   |
| `/alerts`            | `(portal)/alerts/page.tsx`            | Alert table, filter sidebar (severity, time range, status), search, AI investigate |
| `/cases`             | `(portal)/cases/page.tsx`             | Kanban board + list toggle, severity filter, search, create case dialog            |
| `/cases/[id]`        | `(portal)/cases/[id]/page.tsx`        | Case detail — timeline, linked alerts, notes, artifacts, status management         |
| `/hunt`              | `(portal)/hunt/page.tsx`              | AI threat hunt — query input, quick prompts, reasoning steps, event results        |
| `/intel`             | `(portal)/intel/page.tsx`             | IOC search, MISP event feed, intel stats grid                                      |
| `/connectors`        | `(portal)/connectors/page.tsx`        | Connector cards (8 types), status badges, enable/disable toggles                   |
| `/connectors/[type]` | `(portal)/connectors/[type]/page.tsx` | Connector detail — config form, test connection, delete, type-specific fields      |
| `/admin/system`      | `(portal)/admin/system/page.tsx`      | Service health grid, audit log table (TENANT_ADMIN+)                               |
| `/admin/tenant`      | `(portal)/admin/tenant/page.tsx`      | Tenant user table, invite/edit/block/restore users (GLOBAL_ADMIN only full access) |
| `/profile`           | `(portal)/profile/page.tsx`           | User info, update name, change password form                                       |
| `/settings`          | `(portal)/settings/page.tsx`          | Theme selector, language selector, notification preferences                        |

---

## API Proxy Routes

All routes live under `src/app/api/` and proxy to the NestJS backend.

### Auth

| Method | Route               | Backend Path    |
| ------ | ------------------- | --------------- |
| POST   | `/api/auth/login`   | `/auth/login`   |
| GET    | `/api/auth/me`      | `/auth/me`      |
| POST   | `/api/auth/refresh` | `/auth/refresh` |
| POST   | `/api/auth/logout`  | `/auth/logout`  |

### Alerts

| Method | Route                          | Backend Path              |
| ------ | ------------------------------ | ------------------------- |
| GET    | `/api/alerts`                  | `/alerts`                 |
| GET    | `/api/alerts/[id]`             | `/alerts/:id`             |
| POST   | `/api/alerts/[id]/acknowledge` | `/alerts/:id/acknowledge` |
| POST   | `/api/alerts/[id]/investigate` | `/alerts/:id/investigate` |
| POST   | `/api/alerts/[id]/close`       | `/alerts/:id/close`       |

### Cases

| Method | Route             | Backend Path |
| ------ | ----------------- | ------------ |
| GET    | `/api/cases`      | `/cases`     |
| POST   | `/api/cases`      | `/cases`     |
| GET    | `/api/cases/[id]` | `/cases/:id` |
| PATCH  | `/api/cases/[id]` | `/cases/:id` |

### Connectors

| Method | Route                           | Backend Path               |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/api/connectors`               | `/connectors`              |
| POST   | `/api/connectors`               | `/connectors`              |
| GET    | `/api/connectors/[type]`        | `/connectors/:type`        |
| PATCH  | `/api/connectors/[type]`        | `/connectors/:type`        |
| DELETE | `/api/connectors/[type]`        | `/connectors/:type`        |
| POST   | `/api/connectors/[type]/test`   | `/connectors/:type/test`   |
| POST   | `/api/connectors/[type]/toggle` | `/connectors/:type/toggle` |

### Dashboard

| Method | Route                            | Backend Path                       |
| ------ | -------------------------------- | ---------------------------------- |
| GET    | `/api/dashboard/kpis`            | `/dashboards/summary`              |
| GET    | `/api/dashboard/alert-trends`    | `/dashboards/alert-trend`          |
| GET    | `/api/dashboard/mitre-stats`     | `/dashboards/mitre-top-techniques` |
| GET    | `/api/dashboard/asset-risks`     | `/dashboards/top-targeted-assets`  |
| GET    | `/api/dashboard/pipeline-health` | `/dashboards/pipeline-health`      |

### Hunt

| Method | Route                              | Backend Path               |
| ------ | ---------------------------------- | -------------------------- |
| POST   | `/api/hunt/sessions`               | `/hunts/run`               |
| POST   | `/api/hunt/sessions/[id]/messages` | `/hunts/runs/:id/messages` |
| GET    | `/api/hunt/sessions/[id]/events`   | `/hunts/runs/:id/events`   |

### Intel

| Method | Route                    | Backend Path        |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/intel/misp-events` | `/ti/events/recent` |
| GET    | `/api/intel/ioc-search`  | `/ti/iocs/search`   |

### Admin

| Method | Route                                                  | Backend Path                               |
| ------ | ------------------------------------------------------ | ------------------------------------------ |
| GET    | `/api/admin/tenants`                                   | `/tenants`                                 |
| POST   | `/api/admin/tenants`                                   | `/tenants`                                 |
| GET    | `/api/admin/tenants/current`                           | `/tenants/current`                         |
| GET    | `/api/admin/tenants/[tenantId]`                        | `/tenants/:id`                             |
| PATCH  | `/api/admin/tenants/[tenantId]`                        | `/tenants/:id`                             |
| DELETE | `/api/admin/tenants/[tenantId]`                        | `/tenants/:id`                             |
| GET    | `/api/admin/tenants/[tenantId]/users`                  | `/tenants/:id/users`                       |
| POST   | `/api/admin/tenants/[tenantId]/users`                  | `/tenants/:id/users`                       |
| GET    | `/api/admin/tenants/[tenantId]/users/[userId]`         | `/tenants/:tenantId/users/:userId`         |
| PATCH  | `/api/admin/tenants/[tenantId]/users/[userId]`         | `/tenants/:tenantId/users/:userId`         |
| DELETE | `/api/admin/tenants/[tenantId]/users/[userId]`         | `/tenants/:tenantId/users/:userId`         |
| POST   | `/api/admin/tenants/[tenantId]/users/[userId]/block`   | `/tenants/:tenantId/users/:userId/block`   |
| POST   | `/api/admin/tenants/[tenantId]/users/[userId]/unblock` | `/tenants/:tenantId/users/:userId/unblock` |
| POST   | `/api/admin/tenants/[tenantId]/users/[userId]/restore` | `/tenants/:tenantId/users/:userId/restore` |
| PATCH  | `/api/admin/tenants/[tenantId]/users/[userId]/role`    | `/tenants/:tenantId/users/:userId/role`    |
| GET    | `/api/admin/health`                                    | `/health/services`                         |
| GET    | `/api/admin/audit-logs`                                | `/audit-logs`                              |

### Users / Profile

| Method | Route                        | Backend Path             |
| ------ | ---------------------------- | ------------------------ |
| GET    | `/api/users/profile`         | `/users/profile`         |
| PATCH  | `/api/users/profile`         | `/users/profile`         |
| POST   | `/api/users/change-password` | `/users/change-password` |
| GET    | `/api/users/preferences`     | `/users/preferences`     |
| PATCH  | `/api/users/preferences`     | `/users/preferences`     |

---

## Services

All services live in `src/services/` and are singleton objects. They use the Axios `api` instance from `src/lib/api.ts` which handles auth headers automatically.

### `alertService`

- `getAlerts(params?: AlertSearchParams)` — Search alerts with query, severity, status, timeRange, sortBy, sortOrder, page, limit
- `getAlertById(id)` — Get single alert by ID
- `investigateAlert(id)` — Trigger AI investigation of alert

### `caseService`

- `getCases(params?: CaseSearchParams)` — List cases with filters and pagination
- `getCase(id)` — Get case detail
- `createCase(data)` — Create new case
- `updateCase(id, data)` — Update case fields

### `connectorService`

- `list()` — List all connectors for current tenant
- `getByType(type)` — Get connector config by type
- `create(data)` — Create new connector
- `update(type, data)` — Update connector config
- `remove(type)` — Delete connector
- `test(type)` — Test connector connection (returns latencyMs + error if any)
- `toggle(type, enabled)` — Enable or disable connector

### `huntService`

- `createSession(data)` — Start new threat hunting session
- `sendMessage(sessionId, content)` — Send message in hunt session
- `getEvents(sessionId)` — Get events found by hunt session

### `intelService`

- `getMISPEvents(params?)` — Get MISP events with pagination and sort
- `searchIOC(query, type, page, limit, sortBy, sortOrder, source)` — Search IOC database

### `adminService`

- `getTenants()` — List all tenants (GLOBAL_ADMIN)
- `getCurrentTenant()` — Get current authenticated tenant
- `createTenant(data)` — Create new tenant
- `updateTenant(tenantId, data)` — Update tenant name
- `deleteTenant(tenantId)` — Delete tenant
- `getUsers(tenantId, params?)` — List tenant users with sort/filter
- `addUser(tenantId, data)` — Add user to tenant
- `updateUser(tenantId, userId, data)` — Update user role/name/password
- `removeUser(tenantId, userId)` — Delete (soft) user
- `blockUser(tenantId, userId)` — Suspend user
- `unblockUser(tenantId, userId)` — Unsuspend user
- `restoreUser(tenantId, userId)` — Restore deleted user
- `getServiceHealth()` — Get connector health status
- `getAuditLogs(params?)` — Get audit logs with filters

### `profileService`

- `getProfile()` — Get authenticated user's full profile
- `updateProfile(data)` — Update name (requires current password)
- `changePassword(data)` — Change password (verifies current password)

### `settingsService`

- `getPreferences()` — Get user preferences (theme, language, notifications)
- `updatePreferences(data)` — Upsert user preferences

---

## Hooks

All hooks live in `src/hooks/` (one file per hook) and are barrel-exported from `src/hooks/index.ts`.

### Data Fetching Hooks (React Query)

| Hook                                | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| `useAlerts(params?)`                | Fetch paginated alert list with filters        |
| `useAlert(id)`                      | Fetch single alert detail                      |
| `useCases(params?)`                 | Fetch paginated case list                      |
| `useCase(id)`                       | Fetch single case detail                       |
| `useCreateCase()`                   | Mutation: create case                          |
| `useUpdateCase()`                   | Mutation: update case                          |
| `useMISPEvents(params?)`            | Fetch MISP events with pagination/sort         |
| `useIOCSearch(...)`                 | Search IOCs (query, type, source, page, limit) |
| `useTenants()`                      | Fetch all tenants (GLOBAL_ADMIN)               |
| `useCurrentTenant()`                | Fetch current tenant info                      |
| `useCreateTenant()`                 | Mutation: create tenant                        |
| `useUpdateTenant()`                 | Mutation: update tenant                        |
| `useDeleteTenant()`                 | Mutation: delete tenant                        |
| `useTenantUsers(tenantId, params?)` | Fetch users with sort/filter params            |
| `useAddUser()`                      | Mutation: add user to tenant                   |
| `useUpdateUser()`                   | Mutation: update user                          |
| `useRemoveUser()`                   | Mutation: soft-delete user                     |
| `useBlockUser()`                    | Mutation: suspend user                         |
| `useUnblockUser()`                  | Mutation: unsuspend user                       |
| `useRestoreUser()`                  | Mutation: restore deleted user                 |
| `useServiceHealth()`                | Fetch connector health status                  |
| `useAuditLogs(params?)`             | Fetch audit logs                               |
| `useConnectors()`                   | Fetch all connectors for tenant                |
| `useProfile()`                      | Fetch authenticated user profile               |
| `useUpdateProfile()`                | Mutation: update profile                       |
| `useChangePassword()`               | Mutation: change password                      |
| `usePreferences()`                  | Fetch user preferences                         |
| `useUpdatePreferences()`            | Mutation: update preferences                   |

### Page State Hooks

| Hook                       | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| `useAlertsPage()`          | Full alerts page: search, filters, sort, pagination, drawer state     |
| `useCasesPage()`           | Full cases page: search, view mode, severity filter, sort, pagination |
| `useHuntPage()`            | Full hunt page: session state, messages, reasoning steps              |
| `useIntelPage()`           | Full intel page: IOC search, MISP feed, stats, pagination for both    |
| `useSystemAdminPage()`     | System admin: health data, audit logs, sort/filter                    |
| `useTenantConfigPage()`    | Tenant config: user list with sort/filter, dialogs                    |
| `useConnectorDetailPage()` | Connector detail: form state, test mutation, save mutation            |
| `useProfilePage()`         | Profile: form state, edit mode, change password form                  |
| `useSettingsPage()`        | Settings: preferences state, auto-save on change                      |

### Auth & Utility Hooks

| Hook                   | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `useLoginForm()`       | Email/password login form state with validation          |
| `useLogout()`          | Clears auth store, localStorage, redirects to `/login`   |
| `usePreferencesSync()` | Syncs theme/language preferences from backend on mount   |
| `usePagination(opts)`  | Manages page, limit, total state with navigation helpers |
| `useSidebarHealth()`   | Provides service health data for sidebar footer          |

---

## Zustand Stores

### Auth Store (`auth-storage` localStorage key)

Persisted via Zustand `persist` middleware.

```typescript
interface AuthState {
  accessToken: string
  refreshToken: string
  user: AuthUser | null // { sub, email, tenantId, tenantSlug, role }
  isAuthenticated: boolean
  setTokens(accessToken, refreshToken): void
  setUser(user): void
  logout(): void
}
```

### Tenant Store (`tenant-storage` localStorage key)

Persisted. GLOBAL_ADMIN uses this to switch tenant context.

```typescript
interface TenantState {
  currentTenantId: string
  tenants: Tenant[]
  setCurrentTenant(id: string): void
  setTenants(tenants: Tenant[]): void
}
```

The Axios interceptor in `src/lib/api.ts` reads `currentTenantId` from this store and sends it as the `X-Tenant-Id` header. Backend `AuthGuard` uses this header to override `request.user.tenantId` for GLOBAL_ADMIN.

### Filter Store (ephemeral)

Alert/case filter state — resets on page refresh.

```typescript
interface FilterState {
  severity: AlertSeverity[]
  timeRange: TimeRange
  agents: string[]
  kqlQuery: string
  setSeverity
  setTimeRange
  setAgents
  setKqlQuery
  resetFilters
}
```

### Hunt Store (ephemeral)

Active hunt session state.

```typescript
interface HuntState {
  messages: HuntMessage[]
  huntStatus: HuntStatus | null
  huntId: string | null
  addMessage
  setHuntStatus
  setHuntId
  clearSession
}
```

---

## Enums

All enums live in `src/enums/` and are barrel-exported from `src/enums/index.ts`. **Never use string union types — always use enums.**

### `admin.enum.ts`

```typescript
enum UserRole {
  GLOBAL_ADMIN,
  TENANT_ADMIN,
  SOC_ANALYST_L2,
  SOC_ANALYST_L1,
  THREAT_HUNTER,
  EXECUTIVE_READONLY,
}
enum ServiceStatus {
  HEALTHY,
  DEGRADED,
  DOWN,
  MAINTENANCE,
}
enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}
enum TenantStatus {
  ACTIVE,
  TRIAL,
  INACTIVE,
}
enum ThemePreference {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
enum SupportedLocale {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  AR = 'ar',
  IT = 'it',
  DE = 'de',
}
```

### `connector.enum.ts`

```typescript
enum ConnectorType {
  WAZUH = 'wazuh',
  GRAYLOG = 'graylog',
  VELOCIRAPTOR = 'velociraptor',
  GRAFANA = 'grafana',
  INFLUXDB = 'influxdb',
  MISP = 'misp',
  SHUFFLE = 'shuffle',
  BEDROCK = 'bedrock',
}
enum ConnectorStatus {
  NOT_CONFIGURED,
  CONNECTED,
  DISCONNECTED,
  TESTING,
}
enum ConnectorAuthType {
  API_KEY,
  BASIC,
  BEARER,
  IAM,
}
enum ConnectorCategory {
  SIEM,
  EDR,
  OBSERVABILITY,
  THREAT_INTEL,
  SOAR,
  AI,
}
```

### `alert.enum.ts`

```typescript
enum AlertSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}
enum AlertStatus {
  NEW = 'new_alert',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  FALSE_POSITIVE = 'false_positive',
}
```

### `case.enum.ts`

```typescript
enum CaseStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}
enum CaseSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
enum CaseTaskStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
}
enum CaseTimelineEntryType {
  NOTE,
  ALERT,
  STATUS,
  ACTION,
}
enum CaseArtifactType {
  IP,
  HASH,
  DOMAIN,
  URL,
}
enum CaseViewMode {
  BOARD = 'board',
  LIST = 'list',
}
enum CaseSortField {
  CREATED = 'createdAt',
  UPDATED = 'updatedAt',
  SEVERITY = 'severity',
}
```

### `hunt.enum.ts`

```typescript
enum HuntStatus {
  IDLE,
  RUNNING,
  COMPLETED,
  ERROR,
}
enum MessageRole {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}
enum ReasoningStepStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  ERROR,
}
```

### Other Enums

- `SortOrder` — `ASC = 'asc'`, `DESC = 'desc'`
- `TimeRange` — `H24 = '24h'`, `D7 = '7d'`, `D30 = '30d'`
- `IOCType` — `IP`, `DOMAIN`, `URL`, `MD5`, `SHA1`, `SHA256`, `HASH`, `FILENAME`, `CIDR`, `EMAIL`, `ASN`, `CVE`, etc.
- `IOCSource` — `MISP`, `WAZUH`, `MANUAL`, `THREATFOX`, `OTX`, `VIRUSTOTAL`
- `ChartType` — `LINE`, `AREA`, `BAR`, `PIE`, `DONUT`, `GAUGE`
- `NotificationType` — `ALERT`, `CASE`, `SYSTEM`, `HUNT`

---

## Types

All types/interfaces live in `src/types/` and are barrel-exported from `src/types/index.ts`. **Never define types inside component, hook, or service files.**

### Key Interfaces

**`auth.types.ts`**

```typescript
interface AuthUser {
  sub
  email
  tenantId
  tenantSlug
  role: UserRole
}
interface LoginResponse {
  accessToken
  refreshToken
  user: AuthUser
}
```

**`alert.types.ts`**

```typescript
interface Alert {
  id, timestamp, severity: AlertSeverity, status: AlertStatus,
  ruleName, ruleId, description, agentName, agentId,
  sourceIp, destinationIp, mitreTactics[], mitreTechniques[], rawEvent, tenantId
}
interface AlertSearchParams { page, limit, severity, status, query, timeRange, sortBy, sortOrder }
```

**`case.types.ts`**

```typescript
interface Case {
  id, caseNumber, title, description, status: CaseStatus, severity: CaseSeverity,
  assignee, createdAt, updatedAt, closedAt, linkedAlertIds[], timeline[], tasks[], artifacts[]
}
```

**`admin.types.ts`**

```typescript
interface Tenant {
  id
  name
  slug
  userCount
  alertCount
  caseCount
  createdAt
}
interface TenantUser {
  id
  name
  email
  role: UserRole
  status: UserStatus
  lastLoginAt
  isProtected
  mfaEnabled
}
interface ServiceHealth {
  name
  type
  status: ServiceStatus
  latencyMs
}
interface AuditLogEntry {
  id
  createdAt
  actor
  role
  action
  resource
  resourceId
  ipAddress
  details
}
interface TenantUserListParams {
  sortBy?
  sortOrder?: SortOrder
  role?
  status?
}
```

**`common.types.ts`**

```typescript
interface PaginationMeta {
  page
  limit
  total
  totalPages
  hasNext
  hasPrev
}
interface ApiResponse<T> {
  data: T
  pagination?: PaginationMeta
}
interface Column<T> {
  key
  label
  sortable?
  className?
  render?(value, row): ReactNode
}
```

**`intel.types.ts`**

```typescript
interface MISPEvent {
  id
  mispEventId
  organization
  threatLevel
  info
  date
  tags
  attributeCount
  published
}
interface IOCCorrelation {
  id
  iocValue
  iocType
  source
  hitCount
  firstSeen
  lastSeen
  tags
  severity
}
```

**`profile.types.ts`**

```typescript
interface UserProfile {
  id
  email
  name
  role
  tenantId
  tenantSlug
  createdAt
}
interface UpdateProfileInput {
  name
  currentPassword
}
interface ChangePasswordInput {
  currentPassword
  newPassword
  confirmPassword
}
```

---

## Constants

All shared constants live in `src/lib/constants/`. **Never define shared constants inline in component files.**

| File                      | Exports                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage.ts`              | `AUTH_STORAGE_KEY`, `TENANT_STORAGE_KEY`                                                                                                       |
| `locales.ts`              | `SUPPORTED_LOCALES`, `LOCALES` array with code + labelKey                                                                                      |
| `roles.ts`                | `ROLE_LABEL_KEYS` mapping UserRole → i18n key                                                                                                  |
| `alerts.ts`               | `ALERT_TIME_RANGES` (`24h`, `7d`, `30d`)                                                                                                       |
| `cases.ts`                | `ASSIGNEE_OPTIONS`, `KANBAN_COLUMN_CONFIG`, `CASE_SEVERITY_FILTERS`                                                                            |
| `hunt.ts`                 | `QUICK_PROMPT_KEYS`, `HUNT_STATUS_CONFIG`, `REASONING_STEP_CONFIG_MAP`                                                                         |
| `connectors.constants.ts` | `CONNECTOR_META` (label, description, category, icon per type), `BEDROCK_MODELS`, `AWS_REGIONS`, `CONNECTOR_STATUS_STYLES`, `SECURITY_POSTURE` |

---

## Common Components

All reusable components live in `src/components/common/` and are barrel-exported. **Always use these instead of building custom alternatives.**

| Component                                                     | Usage                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| `<DataTable columns={} data={} loading={} emptyMessage={}>`   | **MANDATORY for all tables** — never use raw `<table>` |
| `<PageHeader title={} description={} action={}>`              | Page titles with optional action button                |
| `<LoadingSpinner>`                                            | Centered loading indicator                             |
| `<EmptyState icon={} title={} description={}>`                | Empty data state                                       |
| `<ErrorMessage error={}>`                                     | Error alert panel                                      |
| `<Pagination page={} totalPages={} onPageChange={} total={}>` | Page navigation                                        |
| `<SeverityBadge severity={}>`                                 | Color-coded badge (critical/high/medium/low/info)      |
| `<StatusDot status={} animate={}>`                            | Animated colored dot indicator                         |
| `<MITREBadge technique={}>`                                   | MITRE ATT&CK badge                                     |
| `<KPICard label={} value={} trend={}>`                        | Dashboard metric card                                  |
| `<CopyButton value={}>`                                       | Copy-to-clipboard icon button                          |
| `<MonoText>`                                                  | Monospace text for IPs, hashes, technical values       |
| `Toast.success/error/warning/info(message)`                   | Sonner toast notification                              |
| `await SweetAlertDialog.show({ text, icon })`                 | SweetAlert2 confirmation dialog                        |
| `<AuthGuard>`                                                 | Redirects unauthenticated to `/login`                  |
| `<RoleGuard roles={[UserRole.TENANT_ADMIN]}>`                 | Hides children for insufficient roles                  |

---

## Connector Types

8 security tool integrations supported:

| Type           | Category      | Auth    | Description                                  |
| -------------- | ------------- | ------- | -------------------------------------------- |
| `wazuh`        | SIEM          | Basic   | Open-source SIEM, intrusion detection, XDR   |
| `graylog`      | SIEM          | Basic   | Log management and analysis platform         |
| `velociraptor` | EDR           | API Key | Digital forensics and incident response tool |
| `grafana`      | Observability | API Key | Metrics dashboards and visualization         |
| `influxdb`     | Observability | Bearer  | Time-series database for metrics             |
| `misp`         | Threat Intel  | API Key | Open-source threat intelligence platform     |
| `shuffle`      | SOAR          | API Key | Security orchestration, automation, response |
| `bedrock`      | AI            | IAM     | AWS Bedrock for Claude AI-powered analysis   |

---

## RBAC Roles

6 roles in descending permission order:

| Role                 | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `GLOBAL_ADMIN`       | Full system access, all tenants, tenant switching, user creation               |
| `TENANT_ADMIN`       | Tenant-level admin, invite/manage users, configure connectors, view audit logs |
| `SOC_ANALYST_L2`     | Advanced analyst, update connectors, run hunts, use AI, create/close cases     |
| `THREAT_HUNTER`      | Dedicated hunting role, run hunts, browse intelligence                         |
| `SOC_ANALYST_L1`     | Basic analyst, acknowledge/close alerts, create cases, add notes               |
| `EXECUTIVE_READONLY` | Read-only access to dashboards and reports                                     |

**Protected Users**: Users with `isProtected: true` (seeded GLOBAL_ADMIN) cannot be deleted, blocked, or have their role changed. The UI hides action buttons for protected users and shows a shield icon.

---

## Styling System

### Color Classes (MANDATORY — never use static Tailwind colors)

Use these semantic class system instead of `text-red-600`, `bg-green-100`, etc.:

**Status Colors**

| Variant | Text                  | Background          | Border                  |
| ------- | --------------------- | ------------------- | ----------------------- |
| Success | `text-status-success` | `bg-status-success` | `border-status-success` |
| Warning | `text-status-warning` | `bg-status-warning` | `border-status-warning` |
| Error   | `text-status-error`   | `bg-status-error`   | `border-status-error`   |
| Info    | `text-status-info`    | `bg-status-info`    | `border-status-info`    |
| Neutral | `text-status-neutral` | `bg-status-neutral` | `border-status-neutral` |

**Severity Colors**

| Severity | Text                     | Background             | Border                     |
| -------- | ------------------------ | ---------------------- | -------------------------- |
| Critical | `text-severity-critical` | `bg-severity-critical` | `border-severity-critical` |
| High     | `text-severity-high`     | `bg-severity-high`     | `border-severity-high`     |
| Medium   | `text-severity-medium`   | `bg-severity-medium`   | `border-severity-medium`   |
| Low      | `text-severity-low`      | `bg-severity-low`      | `border-severity-low`      |
| Info     | `text-severity-info`     | `bg-severity-info`     | `border-severity-info`     |

**Layout Colors**: `bg-background` (page), `bg-card` (panels/modals), `bg-muted` (sections), `text-foreground`, `text-muted-foreground`, `border-border`

### Dark Mode

Dark mode is handled via CSS variables in `src/app/globals.css`. The `.dark` class on `<html>` switches all variables. **Never use `isDark ? 'bg-gray-900' : 'bg-white'` conditionals** — use `bg-card` or `bg-background` instead.

### Tailwind v4 (CSS-first)

Tailwind v4 uses CSS-first configuration — all theme customization is in `@theme inline` blocks inside `globals.css`. There is **no `tailwind.config.js` file**.

---

## Internationalization

**Library**: `next-intl` 4.8.3

**Supported locales**: `en` (base), `es`, `it`, `fr`, `ar` (RTL), `de`

**Translation files**: `src/i18n/{locale}.json`

**Client components**:

```typescript
const t = useTranslations('namespace')
t('key.subkey')
```

**Server components**:

```typescript
const t = await getTranslations('namespace')
```

**Namespaces**: `app`, `nav`, `common`, `dashboard`, `alerts`, `cases`, `hunt`, `intel`, `admin`, `auth`, `language`, `profile`, `settings`, `errors`, `connectors`

**Error keys** follow `errors.<module>.<key>` pattern. Use `getErrorKey(error)` from `@/lib/api-error.ts` to extract the i18n key from an Axios error response.

**Rules**:

- Every new feature **must** include translations in all 6 locale files
- Never hardcode user-facing strings — always use `t()`
- Tool/product names are **not** translated: Wazuh, Graylog, Velociraptor, Grafana, InfluxDB, MISP, Shuffle, Bedrock

**RTL support**: Use `start`/`end` Tailwind variants instead of `left`/`right` (e.g., `ps-3`, `me-2`, `text-start`) so layout flips automatically for Arabic.

---

## Code Quality

### ESLint (flat config, `eslint.config.mjs`)

**7 plugins** enforcing **80+ rules**:

1. `eslint-config-next` — React, React Hooks, JSX-A11y
2. `eslint-plugin-unicorn` — Modern JS (`.find()`, `.includes()`, `.flatMap()`, etc.)
3. `eslint-plugin-import-x` — Import order, no duplicates, no circular deps (maxDepth: 4)
4. `eslint-plugin-security` — ReDoS, bidi characters, injection sinks, timing attacks

**Absolute errors** (never bypass): `no-explicit-any`, `no-non-null-assertion`, `eqeqeq`, `no-var`, `prefer-const`, `react/jsx-key`, `react/no-danger`, `no-eval`

### TypeScript (`tsconfig.json`)

All strict flags enabled including the rarely-used: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `useUnknownInCatchVariables`. Path alias: `@/*` → `./src/*`.

### Prettier (`.prettierrc`)

No semicolons, single quotes, 100 char width, trailing comma ES5, `prettier-plugin-tailwindcss` auto-sorts Tailwind classes.

### Git Hooks (Husky + lint-staged)

Pre-commit: ESLint on staged TypeScript/JavaScript files → TypeScript type check → Prettier format. No commit passes without clean lint + types.

### Commit Linting (commitlint)

Conventional commits enforced: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`.

---

## NPM Scripts

| Script                    | Description                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `npm run dev`             | Start dev server with Turbopack (hot reload)                |
| `npm run dev:debug`       | Start dev server with Node.js inspector attached            |
| `npm run build`           | Create optimized production build                           |
| `npm start`               | Start production server                                     |
| `npm run start:prod`      | Start production server with explicit `NODE_ENV=production` |
| `npm run lint`            | Run ESLint on all files                                     |
| `npm run lint:strict`     | Run ESLint — zero warnings allowed                          |
| `npm run lint:fix`        | Auto-fix lint issues                                        |
| `npm run format`          | Format all source files with Prettier                       |
| `npm run format:check`    | Check formatting (no writes)                                |
| `npm run typecheck`       | Full TypeScript type check (`tsc --noEmit`)                 |
| `npm run typecheck:watch` | TypeScript type check in watch mode                         |
| `npm run validate`        | Full pipeline: typecheck + lint:strict + format:check       |
| `npm run validate:fix`    | Auto-fix: lint:fix + format                                 |
| `npm run lint-report-all` | Generate JSON lint report for all files                     |
| `npm run lint-report-ts`  | Generate JSON lint report for TypeScript files only         |
| `npm run lint-report-js`  | Generate JSON lint report for JavaScript files only         |

---

## Contributing

1. Create a feature branch from `main`
2. Follow all rules in `CLAUDE.md` — ESLint, TypeScript strict, naming conventions
3. Run `npm run validate` before pushing — typecheck + lint + format must all pass
4. Pre-commit hooks automatically enforce lint + types on staged files
5. Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
6. Submit a pull request against `main`

## License

Private project. All rights reserved.
