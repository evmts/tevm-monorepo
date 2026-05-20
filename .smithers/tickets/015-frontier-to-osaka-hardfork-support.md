---
id: 015
status: todo
priority: P0
area: hardforks
---

# Frontier To Osaka Hardfork Support

## Problem

Tevm should support execution behavior from Frontier through Osaka, including all active hardfork feature gates exposed by the underlying EVM stack.

## Scope

- Audit hardfork support from Frontier through Osaka across:
  - common configuration.
  - VM/EVM execution.
  - transaction types.
  - block/header fields.
  - precompiles.
  - gas rules.
  - forked block ingestion.
- Add missing hardfork declarations and feature gates.
- Add conformance tests for every hardfork.
- Do not replace the execution engine with a separate Guillotine Mini Zig/WASM backend.

## Acceptance Criteria

- Tevm can configure every hardfork from Frontier through Osaka.
- Conformance tests cover each hardfork boundary.
- Unsupported EIPs are documented with blocking tickets.
- Default hardfork behavior remains backward compatible unless intentionally changed.

