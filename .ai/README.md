# AuraSpear AI Operating Framework

This is an operational control layer for repository coding agents. The complete authoritative requirements are preserved verbatim in [MASTER-PROMPT.md](MASTER-PROMPT.md). The compact canonical runtime is `.ai/rules/00-master-rules.md`; repository engineering truth remains in `CLAUDE.md`.

## Load order

1. Agent adapter (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GPT.md`, or `.cursorrules`).
2. Tiny `.ai/bootstrap/boot.toon` before planning or action.
3. Canonical `.ai/rules/00-master-rules.md`.
4. One route from `.ai/context/context-index.json`.
5. Triggered skills/deep rules only when needed.
6. Temporary state, then durable memory only after promotion.

Instruction graph: platform constraints -> adapter -> bootstrap -> master rules -> domain rules -> skills -> context -> repository evidence -> task state -> curated memory. References flow in one direction; adapters never redefine policy.

Run `npm run ai:check` after framework changes. `npm run ai:doctor` produces the same concise inventory and validation report. JSON is strict machine data; TOON is the low-cost runtime mirror; SJON is a documented JSON-compatible compatibility mirror and needs no parser dependency.
