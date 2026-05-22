[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugStorageRangeAtResult

# Type Alias: DebugStorageRangeAtResult

> **DebugStorageRangeAtResult** = `object`

Result from `debug_storageRangeAt`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="nextkey"></a> `nextKey` | [`Hex`](Hex.md) \| `null` | Next storage key for pagination (null if no more entries) |
| <a id="storage"></a> `storage` | `Record`\<[`Hex`](Hex.md), [`DebugStorageEntry`](DebugStorageEntry.md)\> | Storage entries |
