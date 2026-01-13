[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugGetModifiedAccountsByHashParams

# Type Alias: DebugGetModifiedAccountsByHashParams

> **DebugGetModifiedAccountsByHashParams** = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:250](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L250)

Params taken by `debug_getModifiedAccountsByHash` handler

## Properties

### endBlockHash?

> `readonly` `optional` **endBlockHash**: [`Hex`](Hex.md) \| `Uint8Array`

Defined in: [packages/actions/src/debug/DebugParams.ts:258](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L258)

Ending block hash (optional)

***

### startBlockHash

> `readonly` **startBlockHash**: [`Hex`](Hex.md) \| `Uint8Array`

Defined in: [packages/actions/src/debug/DebugParams.ts:254](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L254)

Starting block hash
