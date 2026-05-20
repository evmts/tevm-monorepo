# Wave 1 typecheck repair (round 7)

**Scope:** packages/memory-client

## Errors fixed
- packages/memory-client/src/createMemoryClient.js:337 - Added a narrow JSDoc `TevmNodeOptions` assertion around the `createTevmTransport` options object to satisfy `exactOptionalPropertyTypes` without changing runtime option normalization.
