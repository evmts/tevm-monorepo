[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugStorageRangeAtParams

# Type Alias: DebugStorageRangeAtParams

> **DebugStorageRangeAtParams** = `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:154

Params taken by `debug_storageRangeAt` handler

## Properties

### address

> `readonly` **address**: [`Hex`](Hex.md)

Defined in: packages/actions/types/debug/DebugParams.d.ts:166

Contract address to get storage for

***

### blockTag

> `readonly` **blockTag**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md)

Defined in: packages/actions/types/debug/DebugParams.d.ts:158

Block number, block hash, or block tag

***

### maxResult

> `readonly` **maxResult**: `number`

Defined in: packages/actions/types/debug/DebugParams.d.ts:174

Maximum number of storage entries to return

***

### startKey

> `readonly` **startKey**: [`Hex`](Hex.md)

Defined in: packages/actions/types/debug/DebugParams.d.ts:170

Storage key to start from (hex string)

***

### txIndex

> `readonly` **txIndex**: `number`

Defined in: packages/actions/types/debug/DebugParams.d.ts:162

Transaction index in the block (0-indexed)
