# AuraSpear SOC — Frontend Installation Guide

## Table of Contents

1. [System Requirements](#1-system-requirements)
2. [Quick Start](#2-quick-start)
3. [Step-by-Step Installation](#3-step-by-step-installation)
4. [Environment Variables](#4-environment-variables)
5. [Running the App](#5-running-the-app)
6. [NPM Scripts Reference](#6-npm-scripts-reference)
7. [Pre-commit Hooks](#7-pre-commit-hooks)
8. [API Proxy & Backend Integration](#8-api-proxy--backend-integration)
9. [Internationalization](#9-internationalization)
10. [PWA Setup](#10-pwa-setup)
11. [API Mocking (MSW)](#11-api-mocking-msw)
12. [Docker Deployment](#12-docker-deployment)
13. [Code Quality Tools](#13-code-quality-tools)
14. [Windows-Specific Notes](#14-windows-specific-notes)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. System Requirements

| Requirement     | Version  | Notes                            |
| --------------- | -------- | -------------------------------- |
| **Node.js**     | >= 18.18 | LTS recommended (20.x or 22.x)   |
| **npm**         | >= 9     | Comes with Node.js               |
| **Git**         | Any      | For cloning and pre-commit hooks |
| **Backend API** | Running  | NestJS backend at port 4000      |

**Optional:**

| Tool            | Purpose                                      |
| --------------- | -------------------------------------------- |
| pnpm            | Alternative package manager (used in Docker) |
| Docker          | For containerized deployment                 |
| Git Bash / WSL2 | Recommended shell on Windows for Husky hooks |

---

## 2. Quick Start

```bash
# 1. Clone and enter the repository
git clone <repository-url>
cd auraspear

# 2. Install dependencies (also sets up pre-commit hooks)
npm install

# 3. Configure environment
cp .env.example .env.development
# Edit .env.development — set BACKEND_API_URL to point to your NestJS backend

# 4. Start the dev server
npm run dev

# App is now running at http://localhost:3000
```

> **Note:** The backend must be running at `http://localhost:4000/api/v1` (or the URL in `BACKEND_API_URL`) for API calls to work. See the backend [INSTALL.md](../auraspear-backend/INSTALL.md) to set it up first.

---

## 3. Step-by-Step Installation

### Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd auraspear
```

### Step 2 — Install Dependencies

```bash
npm install
```

This automatically runs the `prepare` script which initializes Husky pre-commit hooks. On CI environments (GitHub Actions, Vercel, Netlify), Husky is skipped automatically.

### Step 3 — Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.development

# Open and edit the file
# Set BACKEND_API_URL to your running NestJS backend
```

See [Section 4](#4-environment-variables) for the full variable reference.

### Step 4 — Verify Installation

Run all quality checks to confirm the setup is valid:

```bash
npm run typecheck     # TypeScript: zero errors expected
npm run lint          # ESLint: should pass with warnings
npm run format:check  # Prettier: all files properly formatted
```

Or run the full pipeline in one command:

```bash
npm run validate
```

### Step 5 — Start the Development Server

```bash
npm run dev
# Starts: next dev --webpack
# Listening at: http://localhost:3000
```

On first visit, the middleware redirects to `/login` if no valid session is found. Log in with any seeded test user from the backend (e.g., `admin@aura-finance.io` / `Admin@123`).

---

## 4. Environment Variables

### File Priority (Next.js loads in this order)

1. `.env.local` — highest priority, never committed
2. `.env.development` — for development mode
3. `.env.production` — for production builds
4. `.env` — base fallback

### Server-Side Variables (never sent to browser)

| Variable          | Required | Default                        | Description                                                                                                            |
| ----------------- | -------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `BACKEND_API_URL` | **Yes**  | `http://localhost:4000/api/v1` | NestJS backend base URL. Used exclusively by Next.js API proxy routes in `src/app/api/`. Never exposed to the browser. |

### Client-Side Variables (`NEXT_PUBLIC_` prefix)

| Variable                        | Required | Default                                         | Description                                                                                                                                   |
| ------------------------------- | -------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`           | No       | `/api`                                          | Axios base URL for browser requests. Calls Next.js API routes, which proxy to the backend. Keep as `/api` unless hosting on a different path. |
| `NEXT_PUBLIC_OIDC_AUTHORITY`    | No       | `https://login.microsoftonline.com/common/v2.0` | Microsoft Entra ID (Azure AD) authority URL for SSO. Leave empty to use email/password auth only.                                             |
| `NEXT_PUBLIC_OIDC_CLIENT_ID`    | No       | `` (empty)                                      | OAuth 2.0 client ID from your Azure AD app registration. Empty string disables OIDC.                                                          |
| `NEXT_PUBLIC_OIDC_REDIRECT_URI` | No       | `http://localhost:3000/callback`                | Redirect URI after OIDC login. Must match the URI registered in Azure AD.                                                                     |
| `NEXT_PUBLIC_ENABLE_MSW`        | No       | `false`                                         | Set to `true` to enable Mock Service Worker — intercepts all API calls, no backend needed. Useful for UI development in isolation.            |
| `NEXT_PUBLIC_APP_NAME`          | No       | —                                               | Application display name shown in the browser tab and PWA manifest.                                                                           |
| `NEXT_PUBLIC_APP_ENV`           | No       | —                                               | Environment label (`development`, `staging`, `production`). Used for display/debugging.                                                       |

### Example `.env.development`

```env
# Backend connection (server-side only)
BACKEND_API_URL=http://localhost:4000/api/v1

# Axios base URL (browser → Next.js API routes)
NEXT_PUBLIC_API_URL=/api

# Mock Service Worker — set true to skip backend entirely
NEXT_PUBLIC_ENABLE_MSW=false

# Microsoft Entra ID SSO — leave empty for email/password mode
NEXT_PUBLIC_OIDC_AUTHORITY=https://login.microsoftonline.com/common/v2.0
NEXT_PUBLIC_OIDC_CLIENT_ID=
NEXT_PUBLIC_OIDC_REDIRECT_URI=http://localhost:3000/callback

# App metadata
NEXT_PUBLIC_APP_NAME=AuraSpear SOC
NEXT_PUBLIC_APP_ENV=development
```

### Example `.env.production`

```env
BACKEND_API_URL=https://api.your-domain.com/api/v1

NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_ENABLE_MSW=false

NEXT_PUBLIC_OIDC_AUTHORITY=https://login.microsoftonline.com/{tenant-id}/v2.0
NEXT_PUBLIC_OIDC_CLIENT_ID=your-azure-app-client-id
NEXT_PUBLIC_OIDC_REDIRECT_URI=https://your-domain.com/callback

NEXT_PUBLIC_APP_NAME=AuraSpear SOC
NEXT_PUBLIC_APP_ENV=production
```

---

## 5. Running the App

### Development

```bash
npm run dev
# http://localhost:3000
# Hot reload via Turbopack
```

### Development with Node Inspector

```bash
npm run dev:debug
# Starts with --inspect flag
# Attach Chrome DevTools to debug server-side code
```

### Production Build

```bash
# 1. Build
npm run build
# Creates optimized output in .next/

# 2. Start production server
npm start
# http://localhost:3000
```

---

## 6. NPM Scripts Reference

### Development

| Script       | Command                                       | Description                                    |
| ------------ | --------------------------------------------- | ---------------------------------------------- |
| `dev`        | `next dev --webpack`                          | Start dev server with webpack hot reload       |
| `dev:debug`  | `NODE_OPTIONS='--inspect' next dev --webpack` | Dev server with Node.js inspector              |
| `build`      | `next build --webpack`                        | Create production-optimized build in `.next/`  |
| `start`      | `NODE_ENV=production next start`              | Run production server (requires `build` first) |
| `start:prod` | `NODE_ENV=production next start`              | Alias for `start`                              |

### Code Quality

| Script            | Command                                    | Description                               |
| ----------------- | ------------------------------------------ | ----------------------------------------- |
| `lint`            | `eslint .`                                 | Run ESLint across all files               |
| `lint:strict`     | `eslint . --max-warnings 0`                | ESLint with zero tolerance for warnings   |
| `lint:fix`        | `eslint . --fix`                           | Auto-fix ESLint violations                |
| `format`          | `prettier --write .`                       | Format all files with Prettier            |
| `format:check`    | `prettier --check "src/**/*.{ts,tsx,...}"` | Verify formatting without modifying files |
| `typecheck`       | `tsc --noEmit --pretty`                    | Full TypeScript compile check (no output) |
| `typecheck:watch` | `tsc --noEmit --pretty --watch`            | TypeScript check in watch mode            |
| `validate`        | typecheck + lint:strict + format:check     | Full pipeline — run before every PR       |
| `validate:full`   | validate + test + build                    | Full repo confidence check                |
| `validate:fix`    | lint:fix + format                          | Auto-fix all fixable issues               |
| `lint-staged`     | `lint-staged --concurrent false`           | Run linters on git staged files only      |

### Lint Reports

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `lint:mkdir`      | Create `eslint-reports/` directory     |
| `lint-report-all` | Generate full ESLint JSON report       |
| `lint-report-ts`  | Generate TypeScript-only ESLint report |
| `lint-report-js`  | Generate JavaScript-only ESLint report |

---

## 7. Pre-commit Hooks

Every `git commit` triggers an automated quality gate using **Husky v9** + **lint-staged** + **commitlint**.

### Hook Chain

```
git commit
  └── .husky/pre-commit
        ├── npm run lint-staged   → ESLint auto-fix + Prettier format on staged files
        ├── npm run typecheck     → Full TypeScript check
        └── npm run build         → Full production build (catches Next.js errors)
  └── .husky/commit-msg
        └── commitlint            → Validates commit message format
```

### lint-staged (`.lintstagedrc.cjs`)

Runs on staged files only (faster than linting everything):

```javascript
{
  '*.{ts,tsx,js,jsx}': 'eslint --fix --max-warnings 0',
  '*.{ts,tsx,js,jsx,json,css,md,yml,yaml}': 'prettier --write && git add'
}
```

### Commit Message Format (commitlint)

Enforces [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]
```

**Allowed types:**

| Type       | Use for                              |
| ---------- | ------------------------------------ |
| `feat`     | New feature                          |
| `fix`      | Bug fix                              |
| `docs`     | Documentation only                   |
| `style`    | Formatting, no logic change          |
| `refactor` | Code restructure, no behavior change |
| `perf`     | Performance improvement              |
| `test`     | Adding or fixing tests               |
| `build`    | Build system or dependencies         |
| `ci`       | CI/CD configuration                  |
| `chore`    | Maintenance tasks                    |
| `revert`   | Revert a previous commit             |
| `i18n`     | Translation / internationalization   |
| `a11y`     | Accessibility improvement            |
| `ui`       | UI/UX change                         |

**Rules:**

- Subject max 100 characters
- Lowercase subject (no PascalCase, no UPPERCASE)

**Valid examples:**

```
feat: add dark mode toggle to settings page
fix: resolve pagination reset on filter change
i18n: add Arabic translations for connector errors
chore: update next-intl to v4.8.3
```

**Invalid examples:**

```
Added new feature         # Missing type prefix
feat: Added new feature   # Capitalized subject
FEAT: new feature         # Uppercase type
```

---

## 8. API Proxy & Backend Integration

### Architecture

All browser API requests go to Next.js API routes (`/api/*`), which then proxy to the NestJS backend. The browser never directly contacts the backend.

```
Browser (Axios client)
  │  GET /api/alerts?page=1&severity=critical
  ▼
Next.js API Route  (src/app/api/alerts/route.ts)
  │  proxyToBackend(request)
  ▼
NestJS Backend  (BACKEND_API_URL/alerts?page=1&severity=critical)
  │  JWT validation + tenant isolation
  ▼
PostgreSQL Database
```

### Axios Client (`src/lib/api.ts`)

| Setting                         | Value                                                              |
| ------------------------------- | ------------------------------------------------------------------ |
| Base URL                        | `NEXT_PUBLIC_API_URL` (default: `/api`)                            |
| Request interceptor             | Adds `Authorization: Bearer <token>`                               |
| Request interceptor             | Adds `X-Tenant-Id: <tenantId>` (for GLOBAL_ADMIN tenant switching) |
| Response interceptor (401)      | Attempts JWT refresh from refresh token                            |
| Response interceptor (401 fail) | Clears auth store → redirects to `/login`                          |

### Proxy Layer (`src/lib/backend-proxy.ts`)

`proxyToBackend(request, options?)` handles:

- Forwarding all query parameters from the incoming URL
- Forwarding `Authorization` and `X-Tenant-Id` headers to the backend
- Serializing the request body (JSON)
- Returning a consistent `{ data, error?, messageKey?, errors? }` envelope

### Protected Routes (middleware)

`src/middleware.ts` runs on every request and:

- Redirects unauthenticated users from portal pages to `/login`
- Redirects authenticated users from `/login` to `/dashboard`
- Allows public paths: `/login`, `/callback`, `/api/auth/*`, static files

---

## 9. Internationalization

### Supported Languages

| Code | Language | Direction     |
| ---- | -------- | ------------- |
| `en` | English  | LTR (default) |
| `es` | Spanish  | LTR           |
| `it` | Italian  | LTR           |
| `fr` | French   | LTR           |
| `ar` | Arabic   | RTL           |
| `de` | German   | LTR           |

### Configuration

- **Library:** `next-intl` v4.8.3
- **Storage:** `locale` cookie (persists across sessions)
- **RTL:** Applied via `html[dir="rtl"]` for Arabic
- **Translation files:** `src/i18n/{locale}.json`

### Usage in Components

**Client components** (with `'use client'`):

```typescript
import { useTranslations } from 'next-intl'

const t = useTranslations('alerts')
t('severity.critical') // → "Critical"
```

**Server components:**

```typescript
import { getTranslations } from 'next-intl/server'

const t = await getTranslations('alerts')
t('severity.critical')
```

### Adding New Translations

When adding user-facing text, update all six locale files:

- `src/i18n/en.json`
- `src/i18n/es.json`
- `src/i18n/it.json`
- `src/i18n/fr.json`
- `src/i18n/ar.json`
- `src/i18n/de.json`

Tool/product names are NOT translated: Wazuh, Graylog, Velociraptor, Grafana, InfluxDB, MISP, Shuffle, Bedrock.

---

## 10. PWA Setup

### Overview

The app is a Progressive Web App (PWA) using `@serwist/next` for service worker generation.

| Asset                    | Location                                 |
| ------------------------ | ---------------------------------------- |
| PWA Manifest             | `public/manifest.json`                   |
| Service Worker source    | `src/app/sw.ts`                          |
| Generated service worker | `public/sw.js` (auto-generated at build) |
| App icon 192×192         | `public/icons/icon-192.png`              |
| App icon 512×512         | `public/icons/icon-512.png`              |
| Maskable icon            | `public/icons/icon-maskable-512.png`     |
| Apple touch icon         | `public/apple-touch-icon.png`            |

### PWA Manifest Settings

```json
{
  "name": "AuraSpear SOC",
  "start_url": "/dashboard",
  "display": "standalone",
  "theme_color": "#135bec",
  "background_color": "#101622"
}
```

### Notes

- Service worker is only generated during **production builds** (`npm run build`)
- In development, the service worker is disabled to avoid caching issues
- Users see a browser "Install App" prompt after loading the production build

---

## 11. API Mocking (MSW)

Mock Service Worker intercepts all API requests in the browser, allowing frontend development without a running backend.

### Enable Mocking

In `.env.development`:

```env
NEXT_PUBLIC_ENABLE_MSW=true
```

Restart the dev server. All API calls are intercepted by MSW handlers in `src/mocks/`.

### Disable Mocking (default)

```env
NEXT_PUBLIC_ENABLE_MSW=false
```

All requests flow through the API proxy to the real NestJS backend.

---

## 12. Docker Deployment

### Files

| File                 | Purpose                       |
| -------------------- | ----------------------------- |
| `Dockerfile`         | Multi-stage production build  |
| `docker-compose.yml` | Single-service Docker Compose |

### Dockerfile Stages

| Stage     | Base             | Action                                                      |
| --------- | ---------------- | ----------------------------------------------------------- |
| `base`    | `node:20-alpine` | Set up pnpm via corepack                                    |
| `deps`    | base             | Install all dependencies (`pnpm install --frozen-lockfile`) |
| `builder` | deps             | Build Next.js (`pnpm build`)                                |
| `runner`  | node:20-alpine   | Copy built app, run as non-root `nextjs` user               |

### Build & Run

```bash
# Build the Docker image
docker build -t auraspear-soc .

# Run the container
docker run -p 3000:3000 --env-file .env.local auraspear-soc

# Or use Docker Compose
docker-compose up --build
```

### Environment Variables for Docker

Create `.env.local` with production values before building:

```env
BACKEND_API_URL=https://api.your-domain.com/api/v1
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_ENABLE_MSW=false
NEXT_PUBLIC_OIDC_AUTHORITY=https://login.microsoftonline.com/{tenant-id}/v2.0
NEXT_PUBLIC_OIDC_CLIENT_ID=your-client-id
NEXT_PUBLIC_OIDC_REDIRECT_URI=https://your-domain.com/callback
```

---

## 13. Code Quality Tools

### TypeScript (`tsconfig.json`)

All strict flags are enabled:

| Flag                         | Effect                                                           |
| ---------------------------- | ---------------------------------------------------------------- |
| `strictNullChecks`           | `null`/`undefined` must be handled explicitly                    |
| `noUncheckedIndexedAccess`   | Array/object index access returns `T \| undefined`               |
| `exactOptionalPropertyTypes` | `prop?: string` accepts only `string`, not `string \| undefined` |
| `noImplicitAny`              | Every value must have an explicit type                           |
| `noUnusedLocals`             | Unused variables are errors                                      |
| `noUnusedParameters`         | Unused function parameters are errors                            |
| `noImplicitReturns`          | All code paths in functions must return a value                  |
| `noImplicitOverride`         | Subclass overrides must use `override` keyword                   |

Path alias: `@/*` → `./src/*`

### ESLint (`eslint.config.mjs`)

7 plugins enforcing 60+ rules. Key rules:

| Rule                           | Effect                                                            |
| ------------------------------ | ----------------------------------------------------------------- |
| `no-explicit-any`              | No `any` type — use `unknown`, generics, or proper types          |
| `no-non-null-assertion`        | No `!` — use `?.` or null checks                                  |
| `no-console`                   | No `console.log` — only `console.warn`/`console.error`            |
| `eqeqeq`                       | Always `===`, never `==`                                          |
| `react-hooks/exhaustive-deps`  | All hook dependencies must be listed                              |
| `import-x/order`               | Imports must be grouped: builtin → external → internal → relative |
| `unicorn/prefer-array-find`    | Use `.find()` not `.filter()[0]`                                  |
| `security/detect-unsafe-regex` | No ReDoS-vulnerable regexes                                       |

### Prettier (`.prettierrc`)

| Setting               | Value                                                       |
| --------------------- | ----------------------------------------------------------- |
| Semicolons            | `false` (no semicolons)                                     |
| Quotes                | Single quotes                                               |
| Print width           | 100 chars                                                   |
| Tab width             | 2 spaces                                                    |
| Trailing commas       | ES5 style                                                   |
| Arrow function parens | Omitted when possible: `x => x`                             |
| End of line           | LF (Unix)                                                   |
| Plugin                | `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes) |

---

## 14. Windows-Specific Notes

### Shell Requirement for Husky

Pre-commit hooks use bash syntax. Use **Git Bash** or **WSL2** — not PowerShell.

```bash
# From Git Bash terminal:
git commit -m "feat: add new feature"
```

If Husky fails silently in PowerShell, switch to Git Bash.

### Line Endings

Prettier is configured for LF (Unix line endings). Git should be configured to handle line ending conversion:

```bash
git config core.autocrlf input
```

### Package Lock Files

The repo contains both `package-lock.json` (npm) and `pnpm-lock.yaml` (pnpm):

- **Local development:** Use `npm install`
- **Docker:** Uses `pnpm install --frozen-lockfile`
- Do not mix package managers in the same environment

### Node.js Path Resolution

TypeScript path alias `@/*` works on Windows. No additional configuration needed — Next.js and `tsc` handle it transparently.

---

## 15. Troubleshooting

### Pre-commit Hook Fails

The hook runs lint-staged → typecheck → build. Fix issues in this order:

```bash
# 1. Fix ESLint violations
npm run lint:fix

# 2. Fix formatting
npm run format

# 3. Fix TypeScript errors
npm run typecheck

# 4. Verify build passes
npm run build
```

### Backend Connection Refused

Verify the backend is running and reachable:

```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","database":"connected","redis":"connected"}
```

If not running, start the backend first. Alternatively, enable MSW mocking:

```env
NEXT_PUBLIC_ENABLE_MSW=true
```

### Hot Reload Stopped Working

Turbopack occasionally needs a restart:

```bash
# Stop server with Ctrl+C, then:
npm run dev
```

### Husky Hooks Not Running

Reinitialize Husky:

```bash
npm install   # Re-runs the prepare script which sets up Husky
```

Or manually:

```bash
npx husky install
```

### TypeScript Errors After Pulling Changes

```bash
# Clean install
rm -rf node_modules
npm install

# Then re-check
npm run typecheck
```

### PWA Not Installing

- Service worker only activates in **production** builds
- Run `npm run build && npm start` to test PWA behavior locally
- Clear browser cache if the old service worker is cached

### `next-intl` Translation Key Not Found

Ensure the key exists in all 6 locale files (`en.json`, `es.json`, `it.json`, `fr.json`, `ar.json`, `de.json`). Missing keys render the raw key string in development.
