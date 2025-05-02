[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signed](../README.md) / abs

# Function: abs()

> **abs**\<`BITS`\>(`value`, `bits`): `Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>

Defined in: [Signed.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signed.ts#L106)

Gets the absolute value of a Signed value

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

`Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>
