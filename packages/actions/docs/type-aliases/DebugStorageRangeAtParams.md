[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugStorageRangeAtParams

# Type Alias: DebugStorageRangeAtParams

> **DebugStorageRangeAtParams** = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:264](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L264)

Params taken by `debug_storageRangeAt` handler

## Properties

### address

> `readonly` **address**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/debug/DebugParams.ts:276](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L276)

Contract address to get storage for

***

### blockTag

> `readonly` **blockTag**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md)

Defined in: [packages/actions/src/debug/DebugParams.ts:268](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L268)

Block number, block hash, or block tag

***

### maxResult

> `readonly` **maxResult**: `number`

Defined in: [packages/actions/src/debug/DebugParams.ts:284](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L284)

Maximum number of storage entries to return

***

### startKey

> `readonly` **startKey**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/debug/DebugParams.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L280)

Storage key to start from (hex string)

***

### txIndex

> `readonly` **txIndex**: `number`

Defined in: [packages/actions/src/debug/DebugParams.ts:272](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L272)

Transaction index in the block (0-indexed)
