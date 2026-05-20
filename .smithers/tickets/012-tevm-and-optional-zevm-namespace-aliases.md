---
id: 012
status: done
priority: P2
area: rpc
---

# tevm_* Canonical Namespace And Optional zevm_* Aliases

## Problem

Tevm should use `tevm_*` as its canonical extension namespace. Some ZEVM method names may be useful as compatibility aliases, but Tevm should not make `zevm_*` the primary API.

## Scope

- Audit existing generated Anvil/Hardhat/Ganache/EVM/Tevm aliases.
- Define canonical `tevm_*` methods for Tevm-specific controls.
- Decide which `zevm_*` aliases are low-risk compatibility aliases.
- Avoid aliasing methods that have materially different semantics.
- Ensure alias docs do not imply Tevm is the ZEVM binary/client.

## Acceptance Criteria

- Namespace policy is documented.
- Runtime aliases have tests.
- Incompatible aliases are intentionally rejected or omitted with a documented reason.

## Evidence

- `packages/actions/src/rpcNamespacePolicy.ts` defines `tevm_*` as canonical, records `zevm_lightSyncStatus` as the only compatibility alias, and records rejected `zevm_voltaire_*` and `zevm_guillotineMini_*` families with reasons.
- `docs/parity-suites.md` documents the namespace policy beside the parity suite commands.
- `packages/actions/src/createHandlers.js` registers canonical `tevm_lightSyncStatus` and the low-risk `zevm_lightSyncStatus` alias.
- `packages/actions/src/requestProcedure.js` blocks intentionally rejected alias families through the RPC method matrix.
- `packages/actions/src/createHandlers.spec.ts` and `packages/actions/src/requestProcedure.spec.ts` cover the runtime alias and rejected-family behavior.
