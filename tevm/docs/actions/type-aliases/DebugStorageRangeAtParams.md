[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugStorageRangeAtParams

# Type Alias: DebugStorageRangeAtParams

> **DebugStorageRangeAtParams** = `object`

Params taken by `debug_storageRangeAt` handler

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Hex`](Hex.md) | Contract address to get storage for |
| <a id="blocktag"></a> `blockTag` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Block number, block hash, or block tag |
| <a id="maxresult"></a> `maxResult` | `readonly` | `number` | Maximum number of storage entries to return |
| <a id="startkey"></a> `startKey` | `readonly` | [`Hex`](Hex.md) | Storage key to start from (hex string) |
| <a id="txindex"></a> `txIndex` | `readonly` | `number` | Transaction index in the block (0-indexed) |
