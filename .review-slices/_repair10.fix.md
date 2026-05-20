# Wave 1 typecheck repair (round 10)

## Errors fixed
- packages/http-client/src/HttpClient.ts:6 - replaced the `ReturnType<typeof createHttpClient>` alias with an explicit `TevmClient`-based interface so `HttpClient` no longer depends on the factory return type.
- packages/http-client/src/createHttpClient.js:8 - kept the JSDoc return annotation valid by breaking the recursive `createHttpClient` -> `HttpClient` -> `createHttpClient` type chain.
