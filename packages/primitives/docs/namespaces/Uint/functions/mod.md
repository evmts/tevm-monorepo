[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Uint](../README.md) / mod

# Function: mod()

> **mod**\<`BITS`\>(`a`, `b`, `bits`): `Effect`\<[`Uint`](../type-aliases/Uint.md)\<`BITS`\>, `Error`\>

Defined in: [Uint.ts:166](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Uint.ts#L166)

Performs modulo operation on Uint values

## Type Parameters

• **BITS** *extends* `number`

## Parameters

### a

[`Uint`](../type-aliases/Uint.md)\<`BITS`\>

First Uint value.

### b

[`Uint`](../type-aliases/Uint.md)\<`BITS`\>

Second Uint value.

### bits

`BITS`

The bit size of the integers.

## Returns

`Effect`\<[`Uint`](../type-aliases/Uint.md)\<`BITS`\>, `Error`\>
