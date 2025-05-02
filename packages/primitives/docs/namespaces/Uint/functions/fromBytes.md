[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Uint](../README.md) / fromBytes

# Function: fromBytes()

> **fromBytes**\<`BITS`\>(`bytes`, `bits`): `Effect`\<[`Uint`](../type-aliases/Uint.md)\<`BITS`\>, `Error`\>

Defined in: [Uint.ts:200](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Uint.ts#L200)

Converts bytes to a Uint value

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

`Effect`\<[`Uint`](../type-aliases/Uint.md)\<`BITS`\>, `Error`\>
