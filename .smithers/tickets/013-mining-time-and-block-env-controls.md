---
id: 013
status: todo
priority: P1
area: mining
---

# Mining, Time, And Block Environment Controls

## Problem

Tevm has several Anvil-style mining and time controls, but the semantics need to be completed and tested against a clear contract.

## Scope

- Support canonical Tevm controls for:
  - automine get/set.
  - interval mining get/set.
  - manual mining and detailed mining.
  - increase time.
  - set time.
  - set next block timestamp.
  - block timestamp interval.
  - block gas limit.
  - next block base fee.
  - previous randao.
  - coinbase.
  - min gas price.
- Preserve current Anvil/Hardhat/EVM aliases where compatible.
- Do not introduce a separate Zig/WASM Guillotine engine for this work.

## Acceptance Criteria

- Controls have deterministic timestamp precedence.
- Explicit multi-block mining can mine empty blocks.
- Interval mining owns exactly one timer and stops correctly.
- `setPrevRandao` is implemented or explicitly scoped if unsupported by the current block model.
- Tests cover mode switches, pending tx inclusion, empty blocks, timestamp monotonicity, and block environment overrides.

