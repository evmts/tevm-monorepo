---
id: 001
status: todo
priority: P0
area: rpc
---

# RPC Parity Matrix And Request Dispatch

## Problem

Tevm should support every Ethereum/ZEVM-compatible RPC method that is practical for its runtime. The current runtime handler map in `packages/actions/src/createHandlers.js` is missing many supportable methods and has type/docs entries for some methods that are not actually registered.

## Scope

- Build a canonical Tevm RPC support matrix from `packages/actions/src/createHandlers.js`, action types, decorators, server, and the ZEVM JSON-RPC contract.
- Classify each method as supported, missing, intentionally unsupported, or blocked by another ticket.
- Add tests that assert the runtime request path and the published types agree.
- Make `requestProcedure` dispatch behavior explicit for implemented, unimplemented, and unsupported methods.
- Use `tevm_*` as Tevm's canonical extension namespace.
- Do not make canonical `zevm_*` names a hard requirement, except where aliases are low-cost and do not confuse Tevm's public API.

## Acceptance Criteria

- A generated or checked-in method matrix exists in the repo.
- Every method in the matrix has an owner package and implementation status.
- Runtime registration tests fail if a typed method is not present in `createHandlers`.
- The matrix excludes Voltaire primitives and any Guillotine Mini engine swap work.
- Follow-up tickets exist for each missing method group.

