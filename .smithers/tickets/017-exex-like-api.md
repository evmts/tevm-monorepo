---
id: 017
status: done
priority: P1
area: extensions
---

# ExEx-Like Execution Extension API

## Problem

Tevm should expose an ExEx-like API so callers can subscribe to execution events and build extension logic around blocks, transactions, state changes, payloads, and reorgs.

## Scope

- Design an extension API inspired by execution extensions.
- Expose lifecycle hooks for:
  - block import.
  - transaction execution.
  - receipt/log creation.
  - state diff or state root changes.
  - reorg/canonical head changes.
  - Engine API payload events if Engine API is enabled.
- Provide backpressure/error-handling semantics.
- Support use in tests and local devnets without changing default behavior.

## Acceptance Criteria

- API is documented and typed.
- Hooks can be registered through node options.
- Tests cover normal execution, errors, async hooks, hook ordering, and teardown.
- The API works with manual mining, automine, interval mining, and Engine API imports.

