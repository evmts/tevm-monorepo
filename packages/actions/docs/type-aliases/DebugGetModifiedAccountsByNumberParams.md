[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugGetModifiedAccountsByNumberParams

# Type Alias: DebugGetModifiedAccountsByNumberParams

> **DebugGetModifiedAccountsByNumberParams** = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L236)

Params taken by `debug_getModifiedAccountsByNumber` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="endblocknumber"></a> `endBlockNumber?` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` | Ending block number (optional, defaults to startBlockNumber + 1) | [packages/actions/src/debug/DebugParams.ts:244](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L244) |
| <a id="startblocknumber"></a> `startBlockNumber` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` | Starting block number | [packages/actions/src/debug/DebugParams.ts:240](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L240) |
