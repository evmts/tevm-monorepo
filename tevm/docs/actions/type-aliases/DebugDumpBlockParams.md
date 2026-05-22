[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugDumpBlockParams

# Type Alias: DebugDumpBlockParams

> **DebugDumpBlockParams** = `object`

Params taken by `debug_dumpBlock` handler

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="blocktag"></a> `blockTag` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Block number, block hash, or block tag to dump state for |
