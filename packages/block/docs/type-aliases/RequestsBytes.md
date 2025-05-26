[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / RequestsBytes

# Type Alias: RequestsBytes

> **RequestsBytes** = `Uint8Array`[]

Defined in: [packages/block/src/types.ts:259](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L259)

Represents serialized consensus layer requests in byte format

Used in the Cancun upgrade (EIP-4788) for including consensus layer data
in execution layer blocks. Each element in the array is a serialized request
with data from the consensus layer.

## See

https://eips.ethereum.org/EIPS/eip-4788 for more details

## Example

```typescript
import { RequestsBytes } from '@tevm/block'

// Process consensus layer requests from their byte representation
function processRequests(requestsBytes: RequestsBytes): void {
  for (const requestBytes of requestsBytes) {
    // Parse request data
    const parentBeaconBlockRoot = requestBytes.slice(0, 32)

    // Process the consensus layer request
    storeBeaconBlockRoot(parentBeaconBlockRoot)
  }
}
```
