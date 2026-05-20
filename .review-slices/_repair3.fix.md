# Wave 1 typecheck repair (round 3)

**Scope:** bundler-packages/base-bundler

## Errors fixed
- src/createCompileFingerprint.js:1 - Added explicit JSDoc parameter and return annotations for the recursive `normalize` helper.
- src/createCompileFingerprint.js:25 - Typed `solc.version` as string-or-function for this helper so the guarded function call type-checks.
- src/resolveCacheKey.js:3 - Added explicit JSDoc parameter and return annotations for `formatPath`.

## Errors deferred
- None.
