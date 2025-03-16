[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / TevmSendApi

# Type Alias: TevmSendApi

> **TevmSendApi**: `object`

Defined in: [request/TevmSendApi.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/request/TevmSendApi.ts#L30)

API interface for sending JSON-RPC requests to Tevm
Provides methods for both single and bulk requests

## Type declaration

### send

> **send**: `TevmJsonRpcRequestHandler`

### sendBulk

> **sendBulk**: `TevmJsonRpcBulkRequestHandler`

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
