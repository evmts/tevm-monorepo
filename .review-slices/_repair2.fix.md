# Wave 1 typecheck repair (round 2)

**Scope:** packages/block, bundler-packages/runtime

## Errors fixed
- packages/block/src/ClRequest.spec.ts:30 - Added a non-null assertion for the JSON header in the test where the header is constructed with requestsRoot.
- bundler-packages/runtime/src/generateTevmBody.js:5 - Added a JSDoc param type for escapeJSDoc to remove the implicit any.
- bundler-packages/runtime/src/generateTevmBodyDts.js:4 - Added a JSDoc param type for escapeJSDoc to remove the implicit any.

## Errors deferred
- None.
