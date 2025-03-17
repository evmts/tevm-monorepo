[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / EIP1193RequestOptions

# Type Alias: EIP1193RequestOptions

> **EIP1193RequestOptions**: `object`

Defined in: packages/decorators/dist/index.d.ts:356

Options for EIP-1193 compatible JSON-RPC requests.
Controls retry behavior for network requests to Ethereum providers.

## Type declaration

### retryCount?

> `optional` **retryCount**: `number`

### retryDelay?

> `optional` **retryDelay**: `number`

## Example

```typescript
import { EIP1193RequestOptions } from '@tevm/decorators'
import { requestEip1193 } from '@tevm/decorators'

const node = createTevmNode().extend(requestEip1193())

// Add retry options to handle network instability
const options: EIP1193RequestOptions = {
  retryCount: 3,     // Retry failed requests up to 3 times
  retryDelay: 1000   // Wait 1 second between retries
}

await node.request({
  method: 'eth_getBalance',
  params: ['0x1234...', 'latest']
}, options)
```
