---
name: strategy-reset
description: Change approach after the same strategy reaches its retry budget.
loadCondition: on-retry-limit
---

Freeze the exhausted strategy. Summarize failed hypothesis and new evidence. Change at least one of hypothesis, abstraction level, isolation, evidence source, or execution strategy. Retry the smallest reproducible case once.
