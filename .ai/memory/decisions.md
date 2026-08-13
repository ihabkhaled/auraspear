# Durable Decisions

## Canonical AI runtime

- Decision: `.ai/rules/00-master-rules.md` is canonical behavior; model files are adapters.
- Why: prevents instruction duplication and drift.
- Scope: repository agent operations.
- Evidence: `.ai/manifests/*.json` and active routers.
- Replacement: a reviewed framework migration with regenerated manifests and passing `npm run ai:check`.
