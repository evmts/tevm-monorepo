---
id: 011
status: done
priority: P1
area: rpc
---

# Implement eth signing dispatch parity

`eth_sign` and `eth_signTransaction` are typed but not wired through `createHandlers`.

## Acceptance
- runtime handlers for `eth_sign` and `eth_signTransaction` are registered or explicitly deprecated from types

## Evidence

- `packages/actions/src/createHandlers.js` registers `eth_sign` and `eth_signTransaction`.
- `packages/actions/src/eth/ethSignProcedure.spec.ts` and `packages/actions/src/eth/ethSignTransactionProcedure.spec.ts` cover the signing procedures.
- Verified with full `pnpm --filter @tevm/actions test:run`.
