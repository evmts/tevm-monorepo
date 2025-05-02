[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signed](../README.md) / asr

# Function: asr()

> **asr**\<`BITS`\>(`value`, `shift`, `_bits`): `Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>

Defined in: [Signed.ts:296](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signed.ts#L296)

Performs an arithmetic right shift operation on a Signed value
(preserves the sign bit)

## Type Parameters

• **BITS** *extends* `number`

## Parameters

### value

[`Signed`](../type-aliases/Signed.md)\<`BITS`\>

The Signed value.

### shift

`number`

The number of bits to shift.

### \_bits

`BITS`

## Returns

`Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>
