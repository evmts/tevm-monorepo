# Wave 1 typecheck repair (round 8)

**Scope:** packages/server

## Errors fixed
- packages/server/src/internal/handleBulkRequest.js:12 - Added the `suppressNotifications?: boolean` JSDoc option shape so destructuring is typed.
- packages/server/src/internal/parseRequest.js:67 - Added the `allowEmptyBatch?: boolean`, `maxBatchSize?: number`, and `requireJsonrpc?: boolean` JSDoc option shape so destructuring is typed.
