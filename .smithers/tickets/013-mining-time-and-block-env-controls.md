---
id: 013
status: done
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

## Evidence

- `packages/actions/src/createHandlers.js` wires automine, interval mining, manual mining, time, timestamp, block gas limit, base fee, prevRandao, coinbase, and min gas price controls.
- `packages/actions/src/Mine/mineHandler.js` applies timestamp precedence and block environment overrides while clearing one-shot overrides after use.
- `packages/actions/src/anvil/anvilSetPrevRandaoProcedure.js` implements `anvil_setPrevRandao`.
- Verified with `packages/actions/src/Mine/mineHandler.spec.ts`, Anvil control procedure tests, `packages/actions/src/createHandlers.spec.ts`, and full `@tevm/actions` tests.
