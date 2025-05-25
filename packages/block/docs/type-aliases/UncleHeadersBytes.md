[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / UncleHeadersBytes

# Type Alias: UncleHeadersBytes

> **UncleHeadersBytes** = `Uint8Array`[][]

Defined in: packages/block/src/types.ts:416

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
