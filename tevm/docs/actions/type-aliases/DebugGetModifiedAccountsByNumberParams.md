[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugGetModifiedAccountsByNumberParams

# Type Alias: DebugGetModifiedAccountsByNumberParams

> **DebugGetModifiedAccountsByNumberParams** = `object`

Params taken by `debug_getModifiedAccountsByNumber` handler

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="endblocknumber"></a> `endBlockNumber?` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` | Ending block number (optional, defaults to startBlockNumber + 1) |
| <a id="startblocknumber"></a> `startBlockNumber` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` | Starting block number |
