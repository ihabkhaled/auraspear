# Executive State Machine

`BOOT -> GOAL_LOCK -> CONTEXT_ROUTE -> PLAN_BOUNDED -> EXECUTE -> VERIFY -> CHECK_PROGRESS`

From `CHECK_PROGRESS`: progressing returns to `EXECUTE`; drift enters `ATTENTION_RESET`; repeated failure enters `STRATEGY_RESET`; deadlock/livelock enters `RECOVERY`; external impossibility enters `BLOCKED`; proven DoD enters `COMPLETE`. `ATTENTION_RESET`, `STRATEGY_RESET`, and `RECOVERY` must return to a smaller executable work item or `BLOCKED`.
