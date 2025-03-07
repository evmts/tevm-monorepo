[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / CreateMemoryDbFn

# Type Alias: CreateMemoryDbFn()\<TKey, TValue\>

> **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb`?) => [`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>

Defined in: [packages/utils/src/CreateMemoryDbFn.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/CreateMemoryDbFn.ts#L4)

## Type Parameters

• **TKey** *extends* `string` \| `number` \| `Uint8Array` = `Uint8Array`

• **TValue** *extends* `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| [`DbObject`](DbObject.md) = `Uint8Array`

## Parameters

### initialDb?

`Map`\<`TKey`, `TValue`\>

## Returns

[`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>
