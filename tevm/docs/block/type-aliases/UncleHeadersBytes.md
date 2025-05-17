[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / UncleHeadersBytes

# Type Alias: UncleHeadersBytes

> **UncleHeadersBytes** = `Uint8Array`[][]

Defined in: packages/block/types/types.d.ts:401

Represents serialized uncle (ommer) block headers

Uncle blocks are valid blocks that weren't included in the main chain.
In Ethereum's PoW era, miners would include references to these blocks
and receive a partial reward. Each element is a serialized block header.

While uncles are not relevant in post-merge Ethereum (PoS), the data
structure remains for backward compatibility.

## Example

```typescript
import { UncleHeadersBytes, BlockHeader } from '@tevm/block'

// Decode uncle headers from their serialized form
function decodeUncleHeaders(uncleBytes: UncleHeadersBytes): BlockHeader[] {
  return uncleBytes.map(headerBytes => {
    // Process each uncle header using the same header decoding logic
    return decodeBlockHeader(headerBytes)
  })
}

// Check if a block has uncles
function hasUncles(uncleBytes: UncleHeadersBytes): boolean {
  return uncleBytes.length > 0
}
```
