[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [FixedBytes](../README.md) / fixedBytesFromBytes

# Function: fixedBytesFromBytes()

> **fixedBytesFromBytes**\<`N`\>(`length`): `Schema`\<[`FixedBytes`](../type-aliases/FixedBytes.md)\<`N`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [FixedBytes.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/FixedBytes.ts#L33)

Creates a Schema enforcing a Uint8Array of fixed length N branded as FixedBytes<N>.

## Type Parameters

• **N** *extends* `number`

## Parameters

### length

`N`

The exact length required

## Returns

`Schema`\<[`FixedBytes`](../type-aliases/FixedBytes.md)\<`N`\>, `Uint8Array`\<`ArrayBufferLike`\>\>
