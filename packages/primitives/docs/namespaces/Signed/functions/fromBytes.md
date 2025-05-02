[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signed](../README.md) / fromBytes

# Function: fromBytes()

> **fromBytes**\<`BITS`\>(`bytes`, `bits`): `Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>

Defined in: [Signed.ts:232](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signed.ts#L232)

Converts bytes in two's complement representation to a Signed value

## Type Parameters

• **BITS** *extends* `number`

## Parameters

### bytes

`Uint8Array`

The bytes to convert.

### bits

`BITS`

The bit size of the integer.

## Returns

`Effect`\<[`Signed`](../type-aliases/Signed.md)\<`BITS`\>, `Error`\>
