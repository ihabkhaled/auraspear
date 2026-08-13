---
name: loop-detector
description: Detect semantic retry, tool, edit/revert, critic, planning, and context loops.
loadCondition: on-loop
---

Compare recent actions by intent, not syntax. If outcomes are unchanged across equivalent attempts, stop repetition. Identify the invariant failure, trigger attention or strategy reset, and require novelty in the next attempt.
