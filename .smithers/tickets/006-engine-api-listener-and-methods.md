---
id: 006
status: done
priority: P0
area: engine-api
---

# Engine API Listener And Methods

## Problem

Tevm should support the Engine API RPC surface for execution-client interoperability and Hive-style testing.

## Scope

- Add Engine API handlers for:
  - `engine_exchangeCapabilities`
  - `engine_exchangeTransitionConfigurationV1`
  - `engine_getClientVersionV1`
  - `engine_forkchoiceUpdatedV1` through `engine_forkchoiceUpdatedV4`
  - `engine_newPayloadV1` through `engine_newPayloadV5`
  - `engine_getPayloadV1` through `engine_getPayloadV6`
  - `engine_getPayloadBodiesByHashV1` and `engine_getPayloadBodiesByHashV2`
  - `engine_getPayloadBodiesByRangeV1` and `engine_getPayloadBodiesByRangeV2`
  - `engine_getBlobsV1` through `engine_getBlobsV3`
- Decide whether Engine API is served on the normal RPC server, a separate listener, or both.
- Support payload status values needed by execution-apis and Hive tests.
- Keep payload build jobs in runtime state and invalidate them on reset.

## Acceptance Criteria

- Engine methods are runtime-registered and typed.
- Engine API tests cover valid payloads, unknown parents, invalid payloads, malformed params, unknown payload IDs, and body/blob lookup limits.
- The implementation can be enabled/disabled through node/server config.
- The implementation is compatible with Tevm's block, tx, state, and receipt managers.

## Evidence

- `packages/actions/src/createHandlers.js` registers the Engine API method surface behind `engineEnabled !== false`.
- `packages/actions/src/engine/engineProcedures.js` implements forkchoice, payload build/import/get, body/blob lookups, client metadata, and transition configuration.
- `packages/actions/src/engine/engineProcedures.spec.ts` covers forkchoice/getPayload lifecycle, valid payload import, unknown parent, invalid payload, malformed params, unknown payload IDs, and lookup limits.
- Verified with focused engine tests and full `pnpm --filter @tevm/actions test:run`.
