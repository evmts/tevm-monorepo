# Wave 2 typecheck repair (round 4)

**Scope:** packages/memory-client

## Errors fixed
- packages/memory-client/src/createMemoryClient.js:302 - Added a JSDoc `@param` type for `options` so it is not implicitly `any`.
- packages/memory-client/src/createMemoryClient.js:362 - Cast the `tevmViemActions()` extension function to viem's expected `Client<Transport, undefined, undefined>` extension signature.
