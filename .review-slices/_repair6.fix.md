# Wave 1 typecheck repair (round 6)

**Scope:** packages/actions, packages/node

## Errors fixed
- Added JSDoc annotations for EVM `beforeMessage`, `afterMessage`, and `step` event handler params in the five trace helpers under `packages/actions/src/internal`.
- Typed the mux tracer listener registry with concrete EVM event names so cleanup passes a keyed event name to `removeListener`.
- Replaced transaction-instance spreads passed to `createImpersonatedTx` in the four debug replay procedures with explicit tx data fields and conditional spreads for optional `to`, `accessList`, and fee fields.
- Guarded `getBlockNumber(transport)` in `packages/node/src/createTevmNode.js` so it is only called when a fork transport exists.

## Verification
- Toolchain verification was not run because this repair was constrained to avoid pnpm, bun, nx, npm, cargo, node, tsc, and vitest.
