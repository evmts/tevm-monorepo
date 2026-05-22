[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / createMemoryDb

# Function: createMemoryDb()

> **createMemoryDb**(`initialDb?`): [`MemoryDb`](../type-aliases/MemoryDb.md)\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [tevm-monorepo/packages/utils/src/createMemoryDb.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/createMemoryDb.js#L22)

**`Internal`**

A simple EVM-compatible DB instance that uses an in-memory Map as its backend
Pass in an initial DB optionally to prepoulate the DB.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `initialDb?` | `Map`\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\> |

## Returns

[`MemoryDb`](../type-aliases/MemoryDb.md)\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

## Throws
