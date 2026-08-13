---
name: resume-task
description: Resume from compact task state without rereading the repository.
loadCondition: on-resume
---

Load goal and `.ai/context/current-task.*`; validate freshness against touched sources; load only relevant changed files; continue the recorded next action. Rebuild state only if stale or inconsistent.
