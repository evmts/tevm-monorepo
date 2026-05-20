---
id: 007
status: todo
priority: P1
area: engine-api
depends_on: [006]
---

# testing_buildBlockV1 And Payload Builder

## Problem

ZEVM exposes `testing_buildBlockV1` as a builder/testing RPC method. Tevm should support an equivalent method for execution test harnesses.

## Scope

- Implement `testing_buildBlockV1`.
- Accept parent hash, payload attributes, transactions or null, and extra data.
- Return an Engine API builder payload envelope.
- Reuse the Engine API payload builder where possible.
- Validate malformed params and transaction application failures.

## Acceptance Criteria

- Method is runtime-registered and typed.
- Tests cover successful empty block, supplied transactions, malformed params, unknown parent, and transaction application failure.
- The method is usable by Hive/execution-spec style harnesses.

