---
name: targeted-testing
description: Select the smallest test that proves the current change before global gates.
loadCondition: on-verification
---

Identify the claim, smallest relevant unit/integration/E2E command, and expected evidence. Run it once per relevant change. Progress toward mandatory full gates only when the smaller layer passes. Classify unrelated failures instead of silently expanding scope.
