[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / TevmSendApi

# Type Alias: TevmSendApi

> **TevmSendApi** = `object`

Defined in: packages/decorators/dist/index.d.ts:1834

API interface for sending JSON-RPC requests to Tevm
Provides methods for both single and bulk requests

## Example

```typescript
import { TevmSendApi } from '@tevm/decorators'

// Example usage with a Tevm client
const client: TevmSendApi = {
  send: async (request) => { return null }, // implementation
  sendBulk: async (requests) => { return [] } // implementation
}

// Send a single request
await client.send({
  method: 'eth_blockNumber',
  params: []
})

// Send multiple requests in bulk
await client.sendBulk([
  { method: 'eth_blockNumber', params: [] },
  { method: 'eth_getBalance', params: ['0x...', 'latest'] }
])
```

## Properties

### send

> **send**: [`TevmJsonRpcRequestHandler`](../../actions/type-aliases/TevmJsonRpcRequestHandler.md)

Defined in: packages/decorators/dist/index.d.ts:1835

***

### sendBulk

> **sendBulk**: [`TevmJsonRpcBulkRequestHandler`](../../actions/type-aliases/TevmJsonRpcBulkRequestHandler.md)

Defined in: packages/decorators/dist/index.d.ts:1836
