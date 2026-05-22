[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugDumpBlockParams

# Type Alias: DebugDumpBlockParams

> **DebugDumpBlockParams** = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:226](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L226)

Params taken by `debug_dumpBlock` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="blocktag"></a> `blockTag` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Block number, block hash, or block tag to dump state for | [packages/actions/src/debug/DebugParams.ts:230](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L230) |
