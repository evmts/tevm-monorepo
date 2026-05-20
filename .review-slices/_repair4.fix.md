# Wave 1 typecheck repair (round 4)

**Scope:** packages/blockchain, packages/precompiles

## Errors fixed
- packages/blockchain/src/actions/delBlock.js:21 - Branded cached JSON-RPC block hashes as hex strings before adding them to hex hash collections.
- packages/blockchain/src/actions/delBlock.js:47 - Guarded undefined cached block candidates before descendant checks and deletion set insertion.
- packages/blockchain/src/actions/delBlock.js:56 - Guarded undefined tagged blocks before checking the deletion set.
- packages/blockchain/src/actions/putBlock.js:38 - Branded cached JSON-RPC block hashes as hex strings before using them as block map keys.
- packages/precompiles/src/defineCall.ts:75 - Built an explicit `ExecResult` and assigned optional fields only when present.

## Errors deferred
- None.
