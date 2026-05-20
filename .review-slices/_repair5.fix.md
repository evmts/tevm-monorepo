# Wave 1 typecheck repair (round 5)

**Scope:** packages/evm, packages/txpool

## Errors fixed
- packages/txpool/src/TxPool.ts:85 - Added `override` to `cleanup`.
- packages/evm/src/createEvm.js:78 - Used optional chaining for possibly undefined opcode `dynamicFee`.
- packages/evm/src/Evm.js:7 - Added JSDoc `@param` type for `precompileAddress`.
- packages/evm/src/Evm.js:47 - Assigned `_customPrecompiles` through a typed mutable instance view.
- packages/evm/src/Evm.js:49 - Assigned `_customPrecompiles` through a typed mutable instance view.
- packages/evm/src/Evm.js:74 - Assigned `_customPrecompiles` through a typed mutable instance view.

## Errors deferred
- None.
