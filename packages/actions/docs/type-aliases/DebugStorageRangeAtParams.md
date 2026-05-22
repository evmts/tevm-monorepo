[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugStorageRangeAtParams

# Type Alias: DebugStorageRangeAtParams

> **DebugStorageRangeAtParams** = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:264](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L264)

Params taken by `debug_storageRangeAt` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Hex`](Hex.md) | Contract address to get storage for | [packages/actions/src/debug/DebugParams.ts:276](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L276) |
| <a id="blocktag"></a> `blockTag` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Block number, block hash, or block tag | [packages/actions/src/debug/DebugParams.ts:268](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L268) |
| <a id="maxresult"></a> `maxResult` | `readonly` | `number` | Maximum number of storage entries to return | [packages/actions/src/debug/DebugParams.ts:284](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L284) |
| <a id="startkey"></a> `startKey` | `readonly` | [`Hex`](Hex.md) | Storage key to start from (hex string) | [packages/actions/src/debug/DebugParams.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L280) |
| <a id="txindex"></a> `txIndex` | `readonly` | `number` | Transaction index in the block (0-indexed) | [packages/actions/src/debug/DebugParams.ts:272](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L272) |
