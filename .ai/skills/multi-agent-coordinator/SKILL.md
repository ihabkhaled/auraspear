---
name: multi-agent-coordinator
description: Coordinate bounded parallel agents without overlapping scope or deadlock.
loadCondition: on-multi-agent
---

Assign parent objective, exact non-overlapping scope, expected output, stop condition, and evidence. Keep delegation depth <=2 and one writer per overlap. Require Result, Evidence, Unresolved blocker, Deferred findings. Coordinator alone changes scope and terminates.
