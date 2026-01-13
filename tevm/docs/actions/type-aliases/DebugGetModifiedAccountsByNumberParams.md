[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugGetModifiedAccountsByNumberParams

# Type Alias: DebugGetModifiedAccountsByNumberParams

> **DebugGetModifiedAccountsByNumberParams** = `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:128

Params taken by `debug_getModifiedAccountsByNumber` handler

## Properties

### endBlockNumber?

> `readonly` `optional` **endBlockNumber**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`

Defined in: packages/actions/types/debug/DebugParams.d.ts:136

Ending block number (optional, defaults to startBlockNumber + 1)

***

### startBlockNumber

> `readonly` **startBlockNumber**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`

Defined in: packages/actions/types/debug/DebugParams.d.ts:132

Starting block number
