# Wave 1 typecheck repair

**Scope:** packages/config, packages/common, packages/trie

## Errors fixed
- packages/common/src/createCommon.js:5 - added JSDoc parameter/return types for `normalizeHardfork`.
- bundler-packages/config/src/tsconfig/loadTsConfig.js:87 - aligned `TsConfig` JSDoc with the required `compilerOptions` schema and asserted the explicit Effect type.
- bundler-packages/config/src/tsconfig/loadTsConfig.js:114 - changed `catchTag` to match `ParseJsonError`.
- bundler-packages/config/src/tsconfig/loadTsConfig.mocks.spec.ts:36 - fixed via required `compilerOptions` in the loader result type.
- bundler-packages/config/src/tsconfig/loadTsConfig.mocks.spec.ts:60 - fixed via required `compilerOptions` in the loader result type.
- bundler-packages/config/src/tsconfig/loadTsConfig.mocks.spec.ts:78 - fixed via required `compilerOptions` in the loader result type.
- bundler-packages/config/src/tsconfig/loadTsConfig.spec.ts:125 - fixed via required `compilerOptions` in the loader result type.
- bundler-packages/config/src/tsconfig/loadTsConfig.spec.ts:149 - fixed via required `compilerOptions` in the loader result type.
- bundler-packages/config/src/tsconfig/loadTsConfig.spec.ts:180 - fixed via required `compilerOptions` in the loader result type.
- bundler-packages/config/src/tsconfig/loadTsConfig.spec.ts:181 - fixed via required `compilerOptions` in the loader result type.
- bundler-packages/config/src/tsconfig/loadTsConfig.spec.ts:222 - fixed via required `compilerOptions` in the loader result type.
- packages/trie/src/EMPTY_STATE_ROOT.js:52 - added JSDoc parameter/return types for `isArrayIndex`.

## Errors deferred
- None.
