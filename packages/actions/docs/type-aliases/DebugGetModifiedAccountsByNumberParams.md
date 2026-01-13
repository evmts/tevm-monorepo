[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugGetModifiedAccountsByNumberParams

# Type Alias: DebugGetModifiedAccountsByNumberParams

> **DebugGetModifiedAccountsByNumberParams** = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L236)

Params taken by `debug_getModifiedAccountsByNumber` handler

## Properties

### endBlockNumber?

> `readonly` `optional` **endBlockNumber**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`

Defined in: [packages/actions/src/debug/DebugParams.ts:244](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L244)

Ending block number (optional, defaults to startBlockNumber + 1)

***

### startBlockNumber

> `readonly` **startBlockNumber**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`

Defined in: [packages/actions/src/debug/DebugParams.ts:240](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L240)

Starting block number
