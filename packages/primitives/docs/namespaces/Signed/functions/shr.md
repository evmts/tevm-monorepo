[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signed](../README.md) / shr

# Function: shr()

> **shr**\<`BITS`\>(`value`, `shift`, `bits`): `Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>

Defined in: [Signed.ts:279](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signed.ts#L279)

Performs a right shift operation on a Signed value

## Type Parameters

• **BITS** *extends* `number`

## Parameters

### value

[`Signed`](../type-aliases/Signed.md)\<`BITS`\>

The Signed value.

### shift

`number`

The number of bits to shift.

### bits

`BITS`

The bit size of the integer.

## Returns

`Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>
