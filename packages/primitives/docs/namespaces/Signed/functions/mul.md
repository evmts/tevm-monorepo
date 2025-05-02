[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signed](../README.md) / mul

# Function: mul()

> **mul**\<`BITS`\>(`a`, `b`, `bits`): `Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>

Defined in: [Signed.ts:154](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signed.ts#L154)

Multiplies two Signed values

## Type Parameters

• **BITS** *extends* `number`

## Parameters

### a

[`Signed`](../type-aliases/Signed.md)\<`BITS`\>

First Signed value.

### b

[`Signed`](../type-aliases/Signed.md)\<`BITS`\>

Second Signed value.

### bits

`BITS`

The bit size of the integers.

## Returns

`Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>
