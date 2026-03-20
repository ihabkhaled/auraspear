# AuraSpear SOC — AI Development Guidelines

## ABSOLUTE RULES — NEVER VIOLATE

1. **NEVER use `any`** — Use `unknown`, generics, or proper types. `@typescript-eslint/no-explicit-any: error`.
2. **NEVER disable ESLint rules** — No `// eslint-disable`, no `@ts-ignore`, no `@ts-expect-error`. Fix the root cause. No exceptions.
3. **NEVER use static Tailwind color classes** for semantic colors — Always use the status/severity class system.
4. **NEVER use `<table>` directly** — Always use `<DataTable>` from `@/components/common/DataTable`.
5. **NEVER use `==` or `!=`** — Always use `===` and `!==` (`eqeqeq: error`).
6. **NEVER use `var`** — Use `const` (preferred) or `let`.
7. **NEVER use `!` (non-null assertion)** — Use proper null checks (`if`, `??`, `?.`).
8. **NEVER use `console.log`** — Only `console.warn` and `console.error` are allowed.
9. **NEVER hardcode user-facing text** — Always use `t()` from `next-intl`.
10. **NEVER use string concatenation** — Use template literals (`prefer-template: warn`).
11. **NEVER use raw HTML `<select>`, `<input>`, `<textarea>`** — Always use shadcn/ui components from `@/components/ui/`.
12. **NEVER add `// eslint-disable-next-line`** — This rule is absolute with zero exceptions. If a rule triggers, fix the code.
13. **NEVER put `const`, `interface`, `enum`, or `type` declarations inside component, hook, service, or API route files** — Enums → `src/enums/`, Types/Interfaces → `src/types/<domain>.types.ts`, Constants → `src/lib/constants/<domain>.ts`. Exception: file-local constants (used only in that file, e.g., a small config object) are acceptable inline at the top of the file.
14. **NEVER put custom hooks inside component files** — All `useXxx` hooks → `src/hooks/` (one hook per file, barrel-exported from `src/hooks/index.ts`).
15. **NEVER put utility / pure functions inside component files** — All non-React helper functions → `src/lib/utils.ts` or domain-specific `src/lib/<domain>.utils.ts`.
16. **NEVER call ANY hook directly in `.tsx` component files** — This includes `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useTranslations`, `useRouter`, `usePathname`, `useTheme`, `useSearchParams`, `useSyncExternalStore`, store hooks (`useAuthStore`, etc.), and ALL other hooks. Extract ALL hook calls into custom hooks in `src/hooks/`. TSX files must contain ONLY JSX rendering and component structure — zero hook imports, zero hook calls.
17. **NEVER use string literal unions** — All string literal types like `'foo' | 'bar'` MUST be enums in `src/enums/`. Use existing enums (e.g., `CaseCycleStatus.ACTIVE`) instead of hardcoded strings like `'active'`.
18. **NEVER define Zod schemas inside component files** — All validation schemas → `src/lib/validation/<domain>.schema.ts`. Exception: schemas that use `t()` translations for error messages must stay inside the component since they depend on hook context.
19. **NEVER use nested ternary expressions** — Use `if/else` with a variable or early returns instead (`no-nested-ternary: warn`).
20. **NEVER shadow variables from outer scope** — Rename inner variables to avoid collision (`@typescript-eslint/no-shadow: warn`).
21. **NEVER use `new RegExp()` with non-literal arguments** — Use literal regex or pre-compiled patterns to avoid injection (`security/detect-non-literal-regexp: warn`).
22. **NEVER use bracket access `obj[variable]` on Record/constant maps** — Use the `lookup()` utility from `@/lib/utils` which uses `Reflect.get()` to avoid `security/detect-object-injection` warnings. Example: `lookup(LABEL_KEYS, severity)` instead of `LABEL_KEYS[severity]`. For array index access use `.at(idx)` instead of `arr[idx]`.
23. **NEVER use `watch()` from react-hook-form's `useForm()` return** — Use `useWatch({ control, name: 'fieldName' })` instead, which is React Compiler compatible (`react-hooks/incompatible-library`).
24. **NEVER place value imports after type imports** — Value imports (`import { foo }`) must come before type imports (`import type { Bar }`) within the same import group (`import-x/order`).
25. **NEVER use uppercase acronyms in filenames** — Use PascalCase without consecutive uppercase letters: `MitreBarChart.tsx` not `MITREBarChart.tsx`, `KpiCard.tsx` not `KPICard.tsx` (`unicorn/filename-case`).
26. **NEVER have blank lines between import groups** — All imports must be contiguous with no empty lines separating them (`import-x/order` with `newlines-between: 'never'`).
27. **NEVER reference loop-mutated variables inside closures** — Capture the variable in a `const` before using it in callbacks like `.find()`, `.map()`, etc. inside loops (`@typescript-eslint/no-loop-func`).
28. **ALWAYS order `@/lib/*` imports alphabetically** — `@/lib/constants/foo` before `@/lib/utils`, `@/lib/api-error` before `@/lib/roles` (`import-x/order` with `alphabetize: asc`).
29. **NEVER leave placeholder/mock AI responses in production** — All AI methods must route through configured connectors (Bedrock, LLM APIs, or OpenClaw Gateway). Rule-based fallbacks are acceptable ONLY when no connector is configured, and must be clearly labeled as `model: 'rule-based'` in the response.
30. **NEVER hardcode a single AI provider** — AI routing must check all configured AI connectors (bedrock → llm_apis → openclaw_gateway) and use the first available. The `AiService.findAvailableAiConnector()` method handles this.
31. **NEVER leave job handlers unregistered** — Every `JobType` enum value MUST have a corresponding handler registered in `JobsModule.onModuleInit()`. Unregistered handlers cause jobs to sit PENDING forever.
32. **NEVER leave executor engines disconnected from the job system** — Normalization, correlation, and detection executors MUST be wired to their respective job handlers. Executors that exist but are never called are dead code.

---

## ESLint Rules (ALL enforced — `eslint.config.mjs`)

### Presets Applied

- `eslint-config-next/core-web-vitals` — Next.js + React + Core Web Vitals rules
- `eslint-config-next/typescript` — TypeScript strict rules via Next.js

### Plugins

- `eslint-plugin-react` — JSX-specific rules (key props, no-danger, no-deprecated, self-closing, boolean-value, etc.)
- `eslint-plugin-react-hooks` — Hook call rules + exhaustive deps
- `eslint-plugin-jsx-a11y` — Accessibility rules (alt-text, aria-props, anchor validation, etc.)
- `eslint-plugin-unicorn` — Modern JS best practices and code modernization
- `eslint-plugin-import-x` — Import organization, no duplicates, no cycles, ordering
- `eslint-plugin-security` — Security-focused rules (ReDoS, injection sinks, timing attacks, bidi)

### TypeScript Strict Rules

| Rule                      | Level     | Details                                                                      |
| ------------------------- | --------- | ---------------------------------------------------------------------------- |
| `no-explicit-any`         | **error** | NEVER use `any`. Use `unknown`, generics, or proper types                    |
| `no-unused-vars`          | **error** | Exception: `_` prefix (`argsIgnorePattern: '^_'`, `varsIgnorePattern: '^_'`) |
| `no-non-null-assertion`   | **error** | NEVER use `!` — use proper null checks                                       |
| `consistent-type-imports` | **warn**  | Use `import type { Foo }` (inline style)                                     |
| `no-shadow`               | **warn**  | Prevent variable name collisions with outer scope                            |
| `default-param-last`      | **error** | Default parameters must come last in function signature                      |
| `no-useless-empty-export` | **error** | No empty `export {}` that does nothing                                       |
| `no-loop-func`            | **error** | No functions defined inside loops (closure bugs)                             |
| `no-require-imports`      | **error** | No `require()` — use ES module imports                                       |

### General Code Quality Rules

| Rule                          | Level                    | Details                                                    |
| ----------------------------- | ------------------------ | ---------------------------------------------------------- |
| `eqeqeq`                      | **error**                | Always use `===` / `!==`                                   |
| `no-console`                  | **warn**                 | Only `console.warn` and `console.error` allowed            |
| `prefer-const`                | **error**                | Use `const` when not reassigned                            |
| `no-var`                      | **error**                | Use `const` / `let`                                        |
| `no-implicit-coercion`        | **error**                | No `!!`, `+str`, etc. Use explicit `Boolean()`, `Number()` |
| `no-template-curly-in-string` | **warn**                 | Warn when `${x}` appears in regular strings                |
| `curly`                       | **error** (`multi-line`) | Multi-line `if`/`else`/`for`/`while` must use braces       |
| `no-throw-literal`            | **error**                | Only throw `Error` objects                                 |
| `prefer-template`             | **warn**                 | Use template literals over string concatenation            |
| `no-useless-rename`           | **error**                | No `{ foo: foo }` style renaming                           |
| `object-shorthand`            | **warn**                 | Use `{ foo }` instead of `{ foo: foo }`                    |
| `no-lonely-if`                | **warn**                 | Combine with parent `else` when possible                   |
| `no-else-return`              | **warn**                 | Return early instead of `else` blocks                      |

### Bug Prevention Rules

| Rule                         | Level     | Details                                                |
| ---------------------------- | --------- | ------------------------------------------------------ |
| `no-await-in-loop`           | **warn**  | Prefer `Promise.all()` over sequential awaits in loops |
| `no-promise-executor-return` | **error** | Don't return values from Promise executor              |
| `no-constructor-return`      | **error** | Constructors must not return values                    |
| `no-unreachable-loop`        | **error** | Loops must execute more than once                      |
| `no-self-compare`            | **error** | No `x === x` (use `Number.isNaN()` instead)            |
| `no-sequences`               | **error** | No comma operator (confusing control flow)             |

### Clean Code Rules

| Rule                    | Level     | Details                                                          |
| ----------------------- | --------- | ---------------------------------------------------------------- |
| `prefer-object-spread`  | **error** | Use `{ ...obj }` instead of `Object.assign()`                    |
| `no-unneeded-ternary`   | **error** | No `x ? true : false` (just use `x`)                             |
| `prefer-arrow-callback` | **error** | Use arrow functions for callbacks                                |
| `prefer-destructuring`  | **warn**  | Prefer `const { x } = obj` over `const x = obj.x` (objects only) |
| `no-nested-ternary`     | **warn**  | Avoid nested `a ? b : c ? d : e`                                 |
| `no-useless-concat`     | **error** | No `'a' + 'b'` (just write `'ab'`)                               |
| `no-return-assign`      | **error** | No assignment in return statements                               |
| `no-param-reassign`     | **warn**  | Don't reassign function parameters (props allowed)               |

### Security Rules (Core ESLint)

| Rule              | Level     | Details                                     |
| ----------------- | --------- | ------------------------------------------- |
| `no-eval`         | **error** | Never use `eval()`                          |
| `no-implied-eval` | **error** | No `setTimeout('code')` style implicit eval |
| `no-new-func`     | **error** | No `new Function('code')`                   |
| `no-script-url`   | **error** | No `javascript:` URLs                       |

### Security Rules (eslint-plugin-security)

| Rule                                      | Level     | Details                                                     |
| ----------------------------------------- | --------- | ----------------------------------------------------------- |
| `security/detect-unsafe-regex`            | **error** | Detect catastrophic exponential-time regexes (ReDoS)        |
| `security/detect-bidi-characters`         | **error** | Detect trojan source attacks via bidi control characters    |
| `security/detect-new-buffer`              | **error** | Detect deprecated `Buffer()` constructor                    |
| `security/detect-non-literal-regexp`      | **warn**  | Detect `RegExp()` with non-literal args (injection risk)    |
| `security/detect-object-injection`        | **warn**  | Detect dynamic `obj[variable]` access (prototype pollution) |
| `security/detect-possible-timing-attacks` | **warn**  | Detect possible timing attacks in comparisons               |
| `security/detect-pseudoRandomBytes`       | **warn**  | Detect `Math.random()` (not cryptographically secure)       |
| `security/detect-non-literal-fs-filename` | **warn**  | Detect dynamic paths in `fs` operations (path traversal)    |
| `security/detect-child-process`           | **warn**  | Detect `child_process` with non-literal arguments           |

### React Rules

| Rule                               | Level     | Details                                                                                          |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `react-hooks/rules-of-hooks`       | **error** | Hooks must be called at the top level                                                            |
| `react-hooks/exhaustive-deps`      | **warn**  | Dependencies array must be complete                                                              |
| `react/jsx-key`                    | **error** | Must provide `key` in iterators (including Fragment shorthand)                                   |
| `react/no-danger`                  | **error** | No `dangerouslySetInnerHTML`                                                                     |
| `react/no-deprecated`              | **warn**  | No deprecated React APIs                                                                         |
| `react/no-unescaped-entities`      | **error** | Escape `'`, `"`, `>`, `}` in JSX text                                                            |
| `react/jsx-no-target-blank`        | **error** | `target="_blank"` requires `rel="noopener noreferrer"`                                           |
| `react/self-closing-comp`          | **warn**  | Self-close components with no children                                                           |
| `react/jsx-boolean-value`          | **warn**  | Prefer `<Comp disabled />` over `<Comp disabled={true} />`                                       |
| `react/jsx-curly-brace-presence`   | **warn**  | No unnecessary curly braces in JSX                                                               |
| `react/jsx-no-useless-fragment`    | **warn**  | No useless `<></>` fragments                                                                     |
| `react-hooks/incompatible-library` | **warn**  | Don't use `watch()` from react-hook-form — use `useWatch({ control, name })` instead             |
| `react-hooks/static-components`    | **error** | Don't create component references during render — resolve outside or use `React.createElement()` |

### Accessibility Rules (jsx-a11y)

| Rule                   | Level     | Details                     |
| ---------------------- | --------- | --------------------------- |
| `alt-text`             | **error** | Images must have alt text   |
| `anchor-has-content`   | **error** | Anchors must have content   |
| `aria-props`           | **error** | Valid ARIA attributes only  |
| `aria-role`            | **error** | Valid ARIA roles only       |
| `tabindex-no-positive` | **error** | No positive tabindex values |

### Import Rules (eslint-plugin-import-x)

| Rule                      | Level     | Details                                                |
| ------------------------- | --------- | ------------------------------------------------------ |
| `import-x/no-duplicates`  | **error** | No duplicate imports from same module                  |
| `import-x/no-self-import` | **error** | A module cannot import itself                          |
| `import-x/no-cycle`       | **warn**  | Detect circular dependencies (maxDepth: 4)             |
| `import-x/order`          | **warn**  | Order: builtin → external → internal → relative → type |

### Unicorn Rules (Modern JS Best Practices)

| Rule                                | Level     | Details                                                                                                                  |
| ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `prefer-array-find`                 | **error** | Use `.find()` instead of `.filter()[0]`                                                                                  |
| `prefer-array-flat`                 | **error** | Use `.flat()` instead of manual flattening                                                                               |
| `prefer-array-flat-map`             | **error** | Use `.flatMap()` instead of `.map().flat()`                                                                              |
| `prefer-array-some`                 | **error** | Use `.some()` instead of `.find() !== undefined`                                                                         |
| `prefer-includes`                   | **error** | Use `.includes()` instead of `.indexOf() !== -1`                                                                         |
| `no-array-for-each`                 | **warn**  | Prefer `for...of` over `.forEach()`                                                                                      |
| `prefer-string-replace-all`         | **warn**  | Use `.replaceAll()` instead of `.replace(/g/)`                                                                           |
| `prefer-string-starts-ends-with`    | **error** | Use `.startsWith()`/`.endsWith()`                                                                                        |
| `prefer-number-properties`          | **error** | Use `Number.isNaN()`, `Number.parseInt()`, etc.                                                                          |
| `no-zero-fractions`                 | **error** | No `1.0` — just write `1`                                                                                                |
| `prefer-date-now`                   | **error** | Use `Date.now()` instead of `new Date().getTime()`                                                                       |
| `prefer-type-error`                 | **error** | Throw `TypeError` for type-checking failures                                                                             |
| `prefer-regexp-test`                | **error** | Use `.test()` instead of `.match()` for boolean checks                                                                   |
| `throw-new-error`                   | **error** | Always use `throw new Error()`, not `throw Error()`                                                                      |
| `error-message`                     | **error** | Error constructors must have a message                                                                                   |
| `no-instanceof-array`               | **error** | Use `Array.isArray()` instead of `instanceof Array`                                                                      |
| `no-useless-spread`                 | **error** | No `[...array]` when not needed                                                                                          |
| `no-useless-promise-resolve-reject` | **error** | Use `throw` instead of `Promise.reject()` in async                                                                       |
| `no-unnecessary-await`              | **error** | Don't await non-Promise values                                                                                           |
| `no-lonely-if`                      | **error** | Merge nested `if` into `else if`                                                                                         |
| `no-object-as-default-parameter`    | **error** | No `function(options = {})` pattern                                                                                      |
| `consistent-function-scoping`       | **warn**  | Move functions to smallest needed scope                                                                                  |
| `filename-case`                     | **warn**  | Files: `kebab-case`, `PascalCase`, or `camelCase` — no consecutive uppercase (e.g., `MitreBarChart` not `MITREBarChart`) |

---

## Formatting (Prettier — `.prettierrc`)

| Setting        | Value                                                       |
| -------------- | ----------------------------------------------------------- |
| Semi           | `false` (no semicolons)                                     |
| Single quotes  | `true`                                                      |
| Print width    | `100`                                                       |
| Tab width      | `2`                                                         |
| Trailing comma | `es5`                                                       |
| Arrow parens   | `avoid`                                                     |
| End of line    | `lf`                                                        |
| Plugins        | `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes) |

---

## TypeScript Configuration (`tsconfig.json`)

- **Target**: ES2020
- **Module**: ESNext with `bundler` resolution
- **JSX**: `preserve` (Next.js handles JSX transformation)
- **ALL strict flags enabled**: `strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`
- **`noUnusedLocals`**: `true`
- **`noUnusedParameters`**: `true`
- **`noImplicitReturns`**: `true`
- **`noUncheckedIndexedAccess`**: `true` — indexed access returns `T | undefined`
- **`noFallthroughCasesInSwitch`**: `true` — switch cases must `break`/`return`
- **`forceConsistentCasingInFileNames`**: `true`
- **`useUnknownInCatchVariables`**: `true` — `catch(e)` gives `unknown`, not `any`
- **`exactOptionalPropertyTypes`**: `true` — `foo?: string` means `string`, NOT `string | undefined`
- **`noPropertyAccessFromIndexSignature`**: `true` — must use `obj['key']` for index signatures
- **`noImplicitOverride`**: `true` — subclass methods must use `override` keyword
- **`allowUnusedLabels`**: `false`
- **`allowUnreachableCode`**: `false`

### Path Alias

```typescript
@/* → ./src/*
```

---

## Pre-commit Hooks (Husky + lint-staged)

Every commit runs through:

1. **ESLint** — `next lint --file <staged files>` (uses Next.js ESLint integration)
2. **TypeScript** — `tsc --noEmit --pretty` (full type check)
3. **Prettier** — Auto-formats staged files

Configuration:

- `.husky/pre-commit` → runs `npm run lint-staged`
- `.husky/install.mjs` → skips Husky in production/CI
- `.lintstagedrc.cjs` → defines the pipeline per file type
- `package.json` → `"prepare": "node .husky/install.mjs"` initializes hooks on `npm install`

---

## Design System

- **Theme**: Dark mode primary, cyan/teal accent for primary actions and links
- **KPI Cards**: Use `bg-card`, uppercase muted labels, bold large values
- **Tables**: Dark alternating rows, subtle hover, minimal borders — ALWAYS use `<DataTable>` from `@/components/common/DataTable`
- **Badges**: Semantic, uppercase, small rounded

---

## Styling Rules (MANDATORY)

**Never use static Tailwind color classes** for semantic colors. Always use the status class system from `src/app/globals.css`:

### Text Colors

| Category         | Class                   |
| ---------------- | ----------------------- |
| Warning          | `text-status-warning`   |
| Error            | `text-status-error`     |
| Success          | `text-status-success`   |
| Info             | `text-status-info`      |
| Hint/Helper      | `text-muted-foreground` |
| Validation error | `text-destructive`      |

### Severity Colors

| Category | Text                     | Background             | Border                     |
| -------- | ------------------------ | ---------------------- | -------------------------- |
| Critical | `text-severity-critical` | `bg-severity-critical` | `border-severity-critical` |
| High     | `text-severity-high`     | `bg-severity-high`     | `border-severity-high`     |
| Medium   | `text-severity-medium`   | `bg-severity-medium`   | `border-severity-medium`   |
| Low      | `text-severity-low`      | `bg-severity-low`      | `border-severity-low`      |
| Info     | `text-severity-info`     | `bg-severity-info`     | `border-severity-info`     |

### Background Colors (10-15% opacity)

`bg-status-warning`, `bg-status-error`, `bg-status-success`, `bg-status-info`

### Border Colors (25-30% opacity)

`border-status-warning`, `border-status-error`, `border-status-success`, `border-status-info`

### Alert/Panel Pattern

```jsx
<div className="bg-status-warning border-status-warning flex items-center gap-2 rounded-lg border p-2.5">
  <AlertCircle className="text-status-warning h-3.5 w-3.5 shrink-0" />
  <p className="text-status-warning text-xs font-medium">{message}</p>
</div>
```

### Forbidden Color Classes (NEVER use these)

| Forbidden                                   | Replacement                                  |
| ------------------------------------------- | -------------------------------------------- |
| `text-red-*`                                | `text-destructive` or `text-status-error`    |
| `text-green-*`                              | `text-status-success`                        |
| `text-amber-*`                              | `text-status-warning`                        |
| `text-blue-*` (semantic)                    | `text-status-info`                           |
| `text-gray-*`                               | `text-foreground` or `text-muted-foreground` |
| `bg-white`                                  | `bg-card` or `bg-background`                 |
| `bg-gray-*`                                 | `bg-muted` or `bg-card`                      |
| `border-gray-*`                             | `border-border`                              |
| `dark:bg-*`, `dark:text-*`, `dark:border-*` | Not needed — CSS variables handle dark mode  |

**Exceptions** (allowed as-is):

- `text-white` on brand/status-colored backgrounds (contrast)
- `bg-white/5`, `bg-white/10` opacity overlays on brand sections

### Layout Backgrounds

- **Modal/Dialog backgrounds**: `bg-card`
- **Page backgrounds**: `bg-background`
- **Section/panel backgrounds**: `bg-card` with `border border-border`
- **Hover states**: `hover:bg-muted`
- **Muted sections**: `bg-muted` or `bg-muted/50`

### Dark Mode Colors (MANDATORY)

Theme-aware colors are defined via `@theme` in `src/app/globals.css` using CSS variables that switch with the `.dark` class. Use Tailwind classes — **never use `isDark` conditionals for colors**:

| Instead of                                       | Use                          |
| ------------------------------------------------ | ---------------------------- |
| `isDark ? 'bg-gray-900' : 'bg-white'`            | `bg-card` or `bg-background` |
| `isDark ? 'text-gray-100' : 'text-gray-900'`     | `text-foreground`            |
| `isDark ? 'border-gray-800' : 'border-gray-200'` | `border-border`              |
| `isDark ? 'bg-gray-800' : 'bg-gray-100'`         | `bg-muted`                   |
| `isDark ? 'text-gray-400' : 'text-gray-500'`     | `text-muted-foreground`      |

### Tailwind v4 Theme System

- Theme-aware colors MUST be defined using `@theme inline` in `src/app/globals.css`
- CSS variables are defined in `:root` (light) and `.dark` blocks
- No separate `tailwind.config.js` needed — Tailwind v4 uses CSS-first config

---

## Security Rules (MANDATORY)

35. **NEVER store sensitive data in localStorage without encryption** — Tokens should use HttpOnly cookies when possible. If localStorage must stay, ensure CSP blocks inline scripts.
36. **NEVER use `dangerouslySetInnerHTML`** — If unavoidable, sanitize with DOMPurify first. Currently none in codebase — keep it that way.
37. **EVERY redirect MUST be to a known path** — No open redirects from user input. Validate redirect targets against a whitelist.
38. **Security headers MUST be set in `next.config.ts`** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection: 0, HSTS, Referrer-Policy, Permissions-Policy are all configured.
39. **NEVER log tokens or credentials** — Not in console.warn, not in error handlers, not in Zustand devtools.
40. **API errors MUST NOT expose internal details** — Show only `t(messageKey)` to users. Never display raw error messages from backend.
41. **NEVER forward role/auth headers from client in API proxy** — The backend-proxy must not pass through X-Role or similar headers.

---

## Components — MUST USE (never build custom alternatives)

### DataTable — `@/components/common/DataTable`

**Always use `<DataTable>` instead of raw `<table>` elements.**

```tsx
import { DataTable, type Column } from '@/components/common/DataTable'

const columns: Column<MyType>[] = [
  { key: 'name', label: t('name') },
  {
    key: 'status',
    label: t('status'),
    render: (value) => <Badge variant="success">{value as string}</Badge>,
  },
]

<DataTable columns={columns} data={items} emptyMessage={t('noItems')} loading={isFetching} />
```

### Toast (Notifications) — `@/components/common/Toast`

**Library**: `sonner`. Always use `Toast` for user notifications.

```tsx
import { Toast } from '@/components/common'

Toast.success(t('item.created'))
Toast.error(t(getErrorKey(error)))
Toast.warning(t('item.warning'))
Toast.info(t('item.info'))
```

### SweetAlert (Confirmation Dialogs) — `@/components/common/SweetAlert`

**Library**: `sweetalert2`. Always use `SweetAlertDialog` for confirmation dialogs.

```tsx
import { SweetAlertDialog, SweetAlertIcon } from '@/components/common'

const confirmed = await SweetAlertDialog.show({
  text: t('confirmDelete'),
  icon: SweetAlertIcon.QUESTION,
})
if (confirmed) {
  /* proceed */
}
```

### PageHeader — `@/components/common/PageHeader`

```tsx
<PageHeader
  title={t('page.title')}
  description={t('page.description')}
  action={{ label: t('addItem'), icon: <Plus className="h-4 w-4" />, onClick: handleAdd }}
/>
```

### Badge — `@/components/ui/badge`

Variants: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`, `pending`, etc.

### Button — `@/components/ui/button`

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `success`

### Dialog, Input, Select, Textarea — `@/components/ui/`

Always use shadcn/ui form components, not raw HTML elements.

---

## Libraries — Reference

| Library                             | Purpose                | Import                                            |
| ----------------------------------- | ---------------------- | ------------------------------------------------- |
| `next`                              | Framework (App Router) | `next/navigation`, `next/server`, `next/image`    |
| `next-intl`                         | i18n (server + client) | `useTranslations`, `getTranslations`              |
| `next-themes`                       | Theme management       | `useTheme` from `next-themes`                     |
| `@tanstack/react-query`             | Server state, caching  | `useQuery`, `useMutation`, `useQueryClient`       |
| `react-hook-form`                   | Form management        | `useForm`, `Controller`                           |
| `zod`                               | Schema validation      | `z.object()`, `z.string()`                        |
| `axios`                             | HTTP client            | via `@/lib/api` (pre-configured instance)         |
| `dayjs`                             | Date formatting        | `formatDate()` from `@/lib/utils`                 |
| `lucide-react`                      | Icons                  | `<Search />`, `<Filter />`, `<Plus />`, etc.      |
| `sonner`                            | Toast notifications    | via `Toast` from `@/components/common`            |
| `sweetalert2`                       | Confirmation dialogs   | via `SweetAlertDialog` from `@/components/common` |
| `zustand`                           | Global state stores    | stores in `@/stores/`                             |
| `clsx` + `class-variance-authority` | CSS class utilities    | `cn()` from `@/lib/utils`                         |

---

## AI Connector Strategy

The platform supports three AI execution paths, checked in priority order:

| Connector        | Type               | Purpose                                                   |
| ---------------- | ------------------ | --------------------------------------------------------- |
| AWS Bedrock      | `bedrock`          | Direct cloud AI (Claude models)                           |
| LLM APIs         | `llm_apis`         | OpenAI-compatible endpoints (GPT, Claude API, local LLMs) |
| OpenClaw Gateway | `openclaw_gateway` | AI gateway/orchestration layer                            |

### Routing

- `AiService.findAvailableAiConnector(tenantId)` checks all three in priority order
- First enabled and healthy connector is used
- Falls back to rule-based response if none available
- Audit log records which provider/model was used

### Per-method support

All AI methods (hunt, investigate, explain, agent task) work with all three connectors.

### Connector config

- Bedrock: region, model, AWS credentials
- LLM APIs: baseUrl, apiKey, defaultModel, organizationId
- OpenClaw Gateway: baseUrl, apiKey

---

## Job Types & Handlers

Every job type MUST have a registered handler in `JobsModule`:

| JobType                      | Handler                   | Status                                |
| ---------------------------- | ------------------------- | ------------------------------------- |
| `CONNECTOR_SYNC`             | ConnectorSyncHandler      | Active                                |
| `DETECTION_RULE_EXECUTION`   | DetectionExecutionHandler | Active — creates alerts on match      |
| `CORRELATION_RULE_EXECUTION` | CorrelationHandler        | Active — increments hitCount          |
| `NORMALIZATION_PIPELINE`     | NormalizationHandler      | Active — updates pipeline metrics     |
| `SOAR_PLAYBOOK`              | SoarPlaybookHandler       | Active                                |
| `HUNT_EXECUTION`             | HuntExecutionHandler      | Active                                |
| `AI_AGENT_TASK`              | AiAgentTaskHandler        | Active — routes through AI connectors |
| `REPORT_GENERATION`          | ReportGenerationHandler   | Active                                |

---

## Enums — MANDATORY Conventions

**All string literal types MUST be enums. Never use string union types like `'foo' | 'bar'`.**

- All enums live in `src/enums/` with descriptive filenames (e.g., `alert.enum.ts`, `case.enum.ts`)
- Barrel export from `src/enums/index.ts`

```typescript
// src/enums/alert.enum.ts
export enum AlertSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}
```

---

## Constants — MANDATORY Conventions

- **All shared/domain constants MUST live in `src/lib/constants/`** — never define inline in component, hook, or service files
- Organized by domain: `storage.ts`, `connectors.constants.ts`, `roles.ts`, `locales.ts`, `alerts.ts`, `cases.ts`, `hunt.ts`
- Use descriptive filenames matching the domain
- Import from `@/lib/constants/<domain>`

---

## Type Conventions

- **All interfaces and type aliases MUST live in `src/types/`** — never define inline in hooks, services, API routes, or page files
- Organized by domain: `admin.types.ts`, `alert.types.ts`, `case.types.ts`, `common.types.ts`, `auth.types.ts`, `dashboard.types.ts`, `profile.types.ts`, `storage.types.ts`, etc.
- Barrel export from `src/types/index.ts` — every new type file must be added here
- Use `import type { Foo } from '@/types'` for type-only imports (via barrel)
- Use `interface` for object shapes, `type` for unions/intersections
- **Duplicates are prohibited** — if two files need the same interface, define it once in `src/types/` and import from there

---

## i18n (next-intl)

- All user-facing text must use `t()` from `next-intl`
- Client components: `const t = useTranslations('namespace')`
- Server components: `const t = await getTranslations('namespace')`
- Translation files: `src/i18n/en.json`, `src/i18n/ar.json`, etc.
- Supported locales: `en`, `es`, `it`, `fr`, `ar`, `de`
- Backend error messageKeys follow `errors.<module>.<key>` pattern
- Use `getErrorKey()` from `@/lib/api-error.ts` to extract i18n keys from API errors
- RTL support is built-in — use `start`/`end` instead of `left`/`right` in CSS (e.g., `ps-3`, `me-2`, `text-start`)

### Translation Rules — MANDATORY

1. **Every new feature MUST include translations** — in all relevant locale files.
2. **Never hardcode user-facing strings** — All text visible to users must go through `t()`.
3. **Cover every user-facing scenario** — Success messages, error messages, validation hints, labels, placeholders, tooltips, confirmation dialogs.
4. **Namespace by module** — `incidents.title`, `incidents.kpi.open`, `correlation.tabs.sigma`, etc.
5. **Never leave placeholder or TODO translations** — Provide real translations for all 6 languages.
6. **Error messages from backend** — `errors.incidents.notFound`, etc. — must exist in frontend i18n too.

---

## Architecture

### Project Structure (Next.js App Router)

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth route group (login, callback)
│   ├── (portal)/           # Main portal route group
│   │   ├── admin/          # Admin pages (system, tenant)
│   │   ├── alerts/         # Alert list + detail
│   │   ├── cases/          # Case list + detail
│   │   ├── connectors/     # Connector management
│   │   ├── dashboard/      # Main dashboard
│   │   ├── hunt/           # Threat hunting
│   │   ├── intel/          # Intelligence feed
│   │   ├── profile/        # User profile page
│   │   ├── settings/       # User settings/preferences page
│   │   └── layout.tsx      # Portal shell layout
│   ├── api/                # Next.js API routes (server-side)
│   ├── globals.css         # Global CSS + status/severity classes
│   ├── layout.tsx          # Root layout (i18n, fonts, Toaster)
│   ├── page.tsx            # Home redirect
│   └── providers.tsx       # Client providers (QueryClient, Theme, i18n)
├── components/
│   ├── admin/              # Admin-specific components
│   ├── alerts/             # Alert-specific components
│   ├── cases/              # Case management components
│   ├── charts/             # Chart visualizations (recharts)
│   ├── common/             # DataTable, PageHeader, Toast, SweetAlert, etc.
│   ├── connectors/         # Connector components
│   ├── dashboard/          # Dashboard components
│   ├── hunt/               # Threat hunting components
│   ├── intel/              # Intelligence components
│   ├── layout/             # Layout chrome (Sidebar, Topbar, etc.)
│   └── ui/                 # shadcn/ui base components
├── enums/                  # ALL enums (barrel export via index.ts)
├── hooks/                  # Custom hooks (useAlerts, useDashboard, etc.)
├── i18n/                   # Translation files + next-intl config
├── lib/                    # Utilities (utils.ts, api.ts, api-error.ts) + constants/
├── middleware.ts            # Next.js middleware (route protection)
├── mocks/                  # MSW mock handlers + data
├── services/               # API service layer (singleton objects + Axios)
├── stores/                 # Zustand global state stores
└── types/                  # ALL types (barrel export via index.ts)
```

### Next.js Specific Patterns

- **Server Components** are the default — only add `'use client'` when the component uses hooks, events, or browser APIs
- **Route groups** `(auth)` and `(portal)` share different layouts without affecting URL
- **API routes** in `src/app/api/` handle server-side logic (mock data, proxy to backend)
- **Middleware** in `src/middleware.ts` handles route protection and auth guards
- **Environment variables**: Use `process.env['NEXT_PUBLIC_*']` for client-side, `process.env['*']` for server-only

### Key Patterns

- **Services**: Singleton objects with async methods, call Axios API instance from `@/lib/api`
- **Hooks**: Custom hooks in `src/hooks/` encapsulate `useQuery`/`useMutation` logic
- **Stores**: Zustand stores in `src/stores/` for global client state (auth, tenant, filters, UI, notifications, hunt). Auth store (`auth-storage`) holds JWT tokens + user info. Tenant store (`tenant-storage`) holds the switched tenant ID for GLOBAL_ADMIN.
- **Error handling**: `try/catch` + `Toast.error(t(getErrorKey(error)))` pattern
- **Loading states**: `<LoadingSpinner>` from `@/components/common`
- **Empty states**: `<EmptyState>` or custom empty message in DataTable
- **Tenant switching**: GLOBAL_ADMIN users can switch tenant context via `TenantSwitcher` component. The selected tenant is stored in `useTenantStore` (`tenant-storage` localStorage key). The Axios interceptor reads `currentTenantId` from the tenant store and sends it as `X-Tenant-Id` header. The backend auth guard overrides the JWT's tenantId with this header for GLOBAL_ADMIN users.
- **Auth validation**: Every API request is validated server-side — the auth guard checks that the user still exists and is active in the database. Blocked/deleted users receive 401 and the frontend forces logout via `clearAuthAndRedirect()`.
- **Protected users**: Users marked `isProtected: true` (seeded GLOBAL_ADMIN) cannot be deleted, blocked, or have their role changed. The UI hides action buttons for protected users and shows a shield icon.
- **Soft delete**: User deletion sets `status: 'inactive'` (not hard delete). Users can be restored. Blocked users have `status: 'suspended'`.

### Search, Filter & Pagination (MANDATORY)

**All search and filter inputs MUST send requests to the backend API. Never filter or search client-side.**

1. **Backend-driven filtering** — Every search input, dropdown filter, and sort control must pass its value as a query parameter to the backend API.

2. **Debounced search** — Use `useDebounce` hook or `useRef` + `setTimeout` with 400ms delay.

3. **Reset page on filter change** — Always reset `currentPage` to `1` when any filter changes.

4. **`placeholderData: keepPreviousData`** — Keep previous data visible while refetching.

5. **DataTable loading** — Pass `isFetching` (NOT `isLoading`) to `DataTable`'s `loading` prop.

6. **Query key must include all filter params** — so react-query refetches when any change.

---

## Hook Pattern (MANDATORY)

Every page gets a page-level hook that orchestrates everything:

```typescript
// src/hooks/useIncidentPage.ts
export function useIncidentPage() {
  const t = useTranslations('incidents')
  const { data, isLoading } = useIncidents()
  const { stats } = useIncidentStats()
  const { form, onSubmit } = useIncidentForm()
  // ... all logic here

  return {
    t,
    data,
    isLoading,
    stats,
    form,
    onSubmit,
    // ... everything the page needs
  }
}
```

```tsx
// src/app/[locale]/incidents/page.tsx
export default function IncidentsPage() {
  const { t, data, isLoading, stats } = useIncidentPage()

  return (
    // ONLY JSX — no hooks, no logic, no side effects
  )
}
```

---

## Component Pattern (MANDATORY)

```tsx
// src/components/incidents/IncidentKpiCards.tsx
import { KpiCard } from '@/components/common/KpiCard'
import type { IncidentStats } from '@/types/incident.types'

interface IncidentKpiCardsProps {
  stats: IncidentStats
  t: (key: string) => string
}

export function IncidentKpiCards({ stats, t }: IncidentKpiCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <KpiCard label={t('kpi.open')} value={stats.open} />
      {/* ... */}
    </div>
  )
}
```

- Props are typed with explicit interfaces
- `t` is passed as a prop (not called inside component)
- No hooks called inside
- Render-only

---

## Form Validation (MANDATORY)

- Every form has a Zod schema in `src/lib/validation/<domain>.schema.ts`
- Validation runs on submit AND on field blur for important fields
- Error messages use `t()` for localization
- Every string field has `.max()`
- Every array field has `.max()`

---

## RBAC / Permission System

- **Permission enum** (`src/enums/permission.enum.ts`) must mirror the backend enum exactly. When adding a new permission to the backend, immediately add it to the frontend enum.
- **All mutation `invalidateQueries` calls MUST include `tenantId`** in the queryKey — e.g., `queryKey: ['alerts', tenantId]` not `queryKey: ['alerts']`. This ensures tenant switching properly invalidates caches.
- **`usePermissionSync` hook** polls `/auth/me` every 60s and includes `tenantId` in its queryKey so tenant switches trigger immediate permission refresh.
- **`useTenantSwitcher`** must call `queryClient.invalidateQueries()` AND manually call `authService.getMe()` to immediately refresh permissions on tenant switch.
- **`getErrorKey()` returns keys WITHOUT the `errors.` prefix** — so hooks that display error toasts must use `useTranslations('errors')`, NOT `useTranslations()`.
- **Page hooks expose `canX` booleans** derived from `hasPermission()`. TSX files gate UI elements with `{canX && (...)}` or pass handlers as `canX ? handler : undefined`.
- **Case owner bypass** is backend-only (`@AllowCaseOwner()` decorator). The frontend does NOT need special handling — the backend allows case owners through.

---

## Testing Requirements (MANDATORY)

For every module:

- Component render tests (loading, empty, error, data states)
- Hook tests (data fetching, state management)
- Table rendering tests (correct columns, correct data)
- Interaction tests (clicks, form submissions)
- i18n rendering checks (keys resolve, no raw keys shown)
- Accessibility: dialogs have aria labels, buttons have labels, tabs are keyboard navigable

Run before claiming done:

```bash
npm run lint
npm run build
npm test
```

---

## Code Quality Checklist

Before committing any module:

- [ ] No `any` types anywhere
- [ ] No ESLint disables
- [ ] No `console.log`
- [ ] No hooks called in `.tsx` files (all in custom hooks)
- [ ] No raw user-facing text (all `t()`)
- [ ] No raw semantic colors (all CSS classes)
- [ ] No raw `<table>`, `<select>`, `<input>`, `<textarea>`
- [ ] No string literal unions (all enums)
- [ ] No inline types/enums/constants in components
- [ ] No utility functions in component files
- [ ] All i18n keys in all 6 languages
- [ ] Form validation on every form
- [ ] Loading/empty/error states handled
- [ ] Tests written and passing
- [ ] Lint passes
- [ ] Build passes

---

## NPM Scripts Reference

| Script            | Command                                | Purpose                          |
| ----------------- | -------------------------------------- | -------------------------------- |
| `dev`             | `next dev --webpack`                   | Start dev server with webpack    |
| `build`           | `next build --webpack`                 | Production build                 |
| `start`           | `next start`                           | Start production server          |
| `lint`            | `eslint .`                             | Run ESLint on all files          |
| `lint:strict`     | `eslint . --max-warnings 0`            | Lint with zero warnings allowed  |
| `lint:fix`        | `eslint . --fix`                       | Auto-fix lint issues             |
| `format`          | `prettier --write ...`                 | Format all source files          |
| `format:check`    | `prettier --check ...`                 | Check formatting without writing |
| `typecheck`       | `tsc --noEmit --pretty`                | Full TypeScript type check       |
| `validate`        | typecheck + lint:strict + format:check | Full validation pipeline         |
| `validate:fix`    | lint:fix + format                      | Auto-fix all issues              |
| `lint-report-all` | `eslint . -f json -o ...`              | Generate JSON lint report        |

---

## Tech Stack Summary

- **Next.js 16** + React 19 + TypeScript 5 (App Router)
- **Tailwind CSS v4** + shadcn/ui components (new-york style)
- **@tanstack/react-query** for server state
- **react-hook-form** + zod for forms
- **Zustand** for global client state
- **next-intl** for i18n (multi-locale, RTL support)
- **next-themes** for dark/light mode
- **Axios** (pre-configured instance with tenant interceptor)
- **lucide-react** for icons
- **sonner** for toast notifications
- **sweetalert2** for confirmation dialogs
- **MSW** for API mocking in development
- **Husky** + **lint-staged** for pre-commit hooks
- **Prettier** + **prettier-plugin-tailwindcss** for formatting
- **Jest** + **React Testing Library** for testing

---

## Audit Rules (discovered during SpearX audit — MANDATORY)

### Hook Splitting

29. **No page hook > 150 lines** — Split into `useModulePageDialogs()`, `useModulePageCrud()`, `useModulePageFilters()`. The parent hook composes them and returns the same interface.

### Responsive Design

30. **All grid layouts MUST have responsive breakpoints** — Never use `grid-cols-N` (N>1) without `sm:`/`lg:` variants. Patterns:
    - KPI cards: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
    - Form grids: `grid-cols-1 sm:grid-cols-2`
    - Detail grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    - Dialog widths: `max-w-[95vw] sm:max-w-xl`

### Collapsible Panels

31. **All detail panel sections with > 3 items MUST be Collapsible** — Use `<Collapsible defaultOpen>` from `@/components/ui/collapsible` with a `<ChevronDown>` trigger. Apply to all JSON views, lists, timelines, and MITRE mappings.

### Column Translation Interfaces

32. **All column translation interfaces go in `src/types/<module>.types.ts`** — Never define `*ColumnTranslations` or `*ChartProps` interfaces inline in component files.

### Constants with JSX

33. **Constants containing React components/JSX may stay inline** — Pure data constants (string maps, config objects) must go to `src/lib/constants/`. Constants referencing `LucideIcon` or JSX elements are acceptable inline with a comment explaining the exception.

### Translations

34. **Every backend `BusinessException` messageKey must have a matching `errors.*` key in ALL 6 locale files** — When adding a new error in the backend, immediately add the translation key to all frontend locale files.
35. **Operational dashboard work MUST extend shared contracts first** — Prefer extending `analytics-overview`, `operations-overview`, or shared dashboard utilities before introducing page-local fetch shapes or placeholder math.
36. **Feature-complete changes MUST update contributor docs and validation guidance** — If a change affects local setup, validation steps, dashboards, permissions, or contributor workflow, update the relevant `README.md`, `INSTALL.md`, docs, and Codex/GPT companion rules in the same change.
