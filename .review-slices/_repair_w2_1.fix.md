# Wave 2 typecheck repair (round 1)

**Scope:** bundler-packages/bundler-cache

## Errors fixed
- bundler-packages/bundler-cache/src/writeArtifacts.js:29 - Guarded Solc input source content access with a `content in source` check so URL-only source entries do not require a `content` property.
- bundler-packages/bundler-cache/src/writeArtifactsSync.js:29 - Guarded Solc input source content access with a `content in source` check so URL-only source entries do not require a `content` property.
