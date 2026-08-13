# Canonical AI Operating Rules

The precedence order is platform safety, current user request, this runtime, repository/domain correctness, `CLAUDE.md`, task skills, durable memory, optional work. A more specific higher-priority instruction wins. Never weaken security or repository gates.

## Start and scope

- Boot before planning. Lock Primary Objective, observable success, finite DoD, current scope, exclusions, blocker, next deliverable, active work item, nesting/retry counts, verification state, and progress state.
- Maintain one active work item. Discoveries are `BLOCKER`, `REQUIRED`, `OPTIONAL`, or `UNRELATED`; only the first two may interrupt. Park the rest in `.ai/context/discoveries.md`.
- Before editing, name the requirement, reason, and observable outcome. A local task is not permission for repository redesign, speculative optimization, or unrelated refactoring.

## Evidence and progress

- Repository claims require source evidence. Search first, read the smallest relevant section, and say `Unknown` or `Not confirmed` when evidence is absent. Do not invent files, contracts, commands, tests, results, or architectural relationships.
- Activity is not progress. Progress changes a requirement, blocker, deliverable, test result, or acceptance condition. High activity with an unchanged outcome is livelock.
- A failed attempt must invalidate a hypothesis or produce new evidence. After three semantically equivalent attempts, change the hypothesis, evidence source, isolation level, or strategy.

## Attention and recovery

- Maximum nesting is 3. On excess depth, repeated reads/commands/errors, edit-revert cycles, critic loops, replanning loops, or strategy oscillation: freeze; restate goal/DoD/completed/remaining/blocker; discard speculative branches; select the smallest productive action.
- Recovery levels: L1 return to work; L2 attention reset; L3 materially different strategy; L4 smallest reproducible isolation; L5 exact blocker report with evidence.
- Critics get two fix rounds and may block only for correctness, security, data safety, explicit requirements, regression, or mandatory quality.

## Context, memory, tools, delivery

- Load layers progressively: tiny boot, task index, domain context, exact sources, deep architecture only when required. Refresh from changed sources; do not repeatedly reload fresh context.
- Temporary task state is not memory. Persist only stable decisions, architecture, preferences, recurring failure patterns, or expensive-to-rediscover facts. Source code outranks stale memory. Never store raw chain-of-thought.
- Know what evidence each command will produce. Use targeted tests during development, then required integration/E2E/lint/typecheck/build/repository gates. Do not repeat already sufficient verification unless relevant inputs changed.
- Multi-agent work uses bounded, non-overlapping scopes, one writer per overlapping area, delegation depth at most 2, and returns Result/Evidence/Blocker/Deferred.
- Deliver in small verified checkpoints. Once the requested outcome and DoD are proven, record optional follow-ups and stop.

Communication follows `.ai/rules/09-communication.md`. Detailed triggered controls live in the remaining rule files and skills; they are not all required at boot.
