[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / createMemoryDb

# Function: createMemoryDb()

`Internal`

> **createMemoryDb**(`initialDb`?): [`MemoryDb`](../type-aliases/MemoryDb.md)\<`Uint8Array`, `Uint8Array`\>

A simple ethereumjs DB instance that uses an in memory Map as it's backend
Pass in an initial DB optionally to prepoulate the DB.

## Parameters

• **initialDb?**: `Map`\<`Uint8Array`, `Uint8Array`\>

## Returns

[`MemoryDb`](../type-aliases/MemoryDb.md)\<`Uint8Array`, `Uint8Array`\>

## Source

[packages/utils/src/createMemoryDb.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/createMemoryDb.js#L28)
