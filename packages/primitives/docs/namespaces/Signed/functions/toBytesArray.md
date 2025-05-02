[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signed](../README.md) / toBytesArray

# Function: toBytesArray()

> **toBytesArray**\<`BITS`\>(`value`, `bits`): `Effect`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [Signed.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signed.ts#L209)

Converts a Signed value to bytes using two's complement representation

## Type Parameters

• **BITS** *extends* `number`

## Parameters

### value

[`Signed`](../type-aliases/Signed.md)\<`BITS`\>

The Signed value.

### bits

`BITS`

The bit size of the integer.

## Returns

`Effect`\<`Uint8Array`\<`ArrayBufferLike`\>\>
