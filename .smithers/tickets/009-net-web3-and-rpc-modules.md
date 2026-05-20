---
id: 009
status: done
priority: P1
area: rpc
---

# net_*, web3_*, And rpc_modules

## Problem

Several cheap compatibility methods are missing from Tevm's runtime RPC surface.

## Scope

- Implement:
  - `rpc_modules`
  - `net_version`
  - `net_listening`
  - `net_peerCount`
  - `web3_clientVersion`
  - `web3_sha3`
- Return values should reflect Tevm runtime state where possible.
- `web3_sha3` should use Keccak-256.
- `rpc_modules` should report enabled namespaces consistently with registered handlers.

## Acceptance Criteria

- Methods are runtime-registered and typed.
- Tests cover param validation and exact return formats.
- `rpc_modules` changes when optional Engine API/light-client features are disabled.

## Evidence

- `packages/actions/src/createHandlers.js` registers `rpc_modules`, `net_version`, `net_listening`, `net_peerCount`, `web3_clientVersion`, and `web3_sha3`.
- `web3_sha3` uses Keccak-256 and validates hex input.
- `rpc_modules` reflects enabled namespaces and omits Engine API when disabled.
- Verified with `packages/actions/src/createHandlers.spec.ts`, `packages/actions/src/requestProcedure.spec.ts`, and full `@tevm/actions` tests.
