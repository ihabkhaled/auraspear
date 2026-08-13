# Repository Map

- `src/app`: Next.js App Router pages, layouts, and API proxy routes.
- `src/components`: render-focused UI; shared primitives live in `common` and `ui`.
- `src/hooks`: all React hooks and page orchestration.
- `src/services`: typed frontend API service layer.
- `src/types`, `src/enums`, `src/lib/constants`: repository-mandated declarations.
- `src/i18n`: application and marketing translations.
- `test`: Vitest tests; `e2e`: Playwright flows.
- `docs/ARCHITECTURE.md`: application architecture; `docs/AI-SURFACES.md`: product AI feature map.
- `.ai`: agent operating runtime; `CLAUDE.md`: detailed repository engineering rules.
- Required feature-complete gate: `npm run validate:full`. Framework gate: `npm run ai:check`.
